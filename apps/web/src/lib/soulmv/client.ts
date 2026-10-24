import { soulMVConfig } from './config';
import type {
  MVAtendimento,
  MVCheckinRequest,
  MVCheckinResponse,
  MVPaciente,
  MVTermoAssinadoRequest,
} from './types';

/**
 * Cliente HTTP para a API SOUL MV Portaria / Atendimento
 * Quando process.env.NEXT_PUBLIC_SOULMV_USE_MOCK !== 'false', opera com respostas seguras e idênticas ao schema Swagger
 */
export class SoulMVClient {
  private baseUrl: string;
  private token: string;
  private isMock: boolean;

  constructor() {
    this.baseUrl = soulMVConfig.baseUrl;
    this.token = soulMVConfig.appToken;
    this.isMock = soulMVConfig.isMock;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), soulMVConfig.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Erro SOUL MV HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Buscar paciente no SOUL MV por CPF
   * Endpoint Swagger: GET /api/v1/pacientes/cpf/{cpf}
   */
  async getPacientePorCpf(cpf: string): Promise<MVPaciente> {
    if (this.isMock) {
      return {
        cdPessoaFisica: 84920,
        nrProntuario: 'DEMO-PAC-638578',
        nmPaciente: 'Carlos Alberto da Silva',
        nrCpf: cpf,
        dtNascimento: '1985-06-14',
        cdConvenio: 101,
        dsConvenio: 'Unimed Curitiba - Nacional',
        dsTelefone: '(41) 99872-3011',
        dsEmail: 'carlos.silva@cmac.demo',
      };
    }

    return this.request<MVPaciente>(`/api/v1/pacientes/cpf/${encodeURIComponent(cpf)}`);
  }

  /**
   * Realizar Check-in / Recepção Digital
   * Endpoint Swagger: POST /api/v1/portaria/checkin
   */
  async registrarCheckin(dados: MVCheckinRequest): Promise<MVCheckinResponse> {
    if (this.isMock) {
      return {
        nrAtendimento: 40921,
        nrSenha: 'C-042',
        dsLocal: 'Consultório 04 • Ala B (2º Andar)',
        dtPrevisao: '10:00',
        nmProfissional: 'Dr. Marcos Vinícius',
        dsEspecialidade: 'Cardiologia Clínica',
        status: 'CONFIRMADO',
      };
    }

    return this.request<MVCheckinResponse>('/api/v1/portaria/checkin', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  /**
   * Enviar Termo de Consentimento / TCLE / LGPD assinado para o prontuário
   * Endpoint Swagger: POST /api/v1/prontuario/termos
   */
  async registrarTermoAssinado(termo: MVTermoAssinadoRequest): Promise<{ cdDocumento: number; status: string }> {
    if (this.isMock) {
      return {
        cdDocumento: Math.floor(Math.random() * 90000) + 10000,
        status: 'ARQUIVADO_PRONTUARIO_PEP',
      };
    }

    return this.request<{ cdDocumento: number; status: string }>('/api/v1/prontuario/termos', {
      method: 'POST',
      body: JSON.stringify(termo),
    });
  }

  /**
   * Buscar fila atual e chamadas para exibição no totem/TV
   * Endpoint Swagger: GET /api/v1/portaria/painel-senhas
   */
  async getPainelSenhas(cdUnidade = 'CURITIBA_CENTRAL'): Promise<MVAtendimento[]> {
    if (this.isMock) {
      return [
        {
          nrAtendimento: 40921,
          cdPaciente: 84920,
          dtEntrada: '2026-10-24',
          hrEntrada: '09:45',
          tpAtendimento: 'A',
          dsStatus: 'EM_ATENDIMENTO',
          nrSenha: 'C-042',
          cdConsultorio: 'Consultório 04',
          nmMedico: 'Dr. Marcos Vinícius',
          nrCrm: 'CRM-PR 28.412',
        },
        {
          nrAtendimento: 40922,
          cdPaciente: 84925,
          dtEntrada: '2026-10-24',
          hrEntrada: '09:50',
          tpAtendimento: 'A',
          dsStatus: 'AGUARDANDO',
          nrSenha: 'C-043',
          cdConsultorio: 'Consultório 02',
          nmMedico: 'Dra. Juliana Prado Mendes',
          nrCrm: 'CRM-PR 31.904',
        },
      ];
    }

    return this.request<MVAtendimento[]>(`/api/v1/portaria/painel-senhas?unidade=${encodeURIComponent(cdUnidade)}`);
  }
}

export const soulMV = new SoulMVClient();
