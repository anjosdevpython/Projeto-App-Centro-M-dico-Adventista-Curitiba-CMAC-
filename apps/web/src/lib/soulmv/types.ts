/**
 * Modelos de Dados Tipados do Swagger MV API Portaria / Recepção
 */

export interface MVAuthResponse {
  token: string;
  type: 'Bearer';
  expiresIn: number;
}

export interface MVPaciente {
  cdPessoaFisica?: number;
  nrProntuario: string;
  nmPaciente: string;
  nrCpf: string;
  dtNascimento: string;
  cdConvenio?: number;
  dsConvenio?: string;
  dsTelefone?: string;
  dsEmail?: string;
}

export interface MVAtendimento {
  nrAtendimento: number;
  cdPaciente: number;
  dtEntrada: string;
  hrEntrada: string;
  tpAtendimento: 'A' | 'U' | 'I'; // Ambulatorial, Urgência, Internação
  dsStatus: 'AGUARDANDO' | 'EM_TRIAGEM' | 'EM_ATENDIMENTO' | 'FINALIZADO';
  nrSenha?: string;
  cdConsultorio?: string;
  nmMedico?: string;
  nrCrm?: string;
}

export interface MVCheckinRequest {
  nrCpf: string;
  cdUnidade: string;
  nrAgendamento?: string;
  ieValidaDocumentoFoto: boolean;
  ieBiometriaFacial: boolean;
}

export interface MVCheckinResponse {
  nrAtendimento: number;
  nrSenha: string;
  dsLocal: string;
  dtPrevisao: string;
  nmProfissional: string;
  dsEspecialidade: string;
  status: 'CONFIRMADO' | 'PENDENTE_GUICHE';
}

export interface MVTermoAssinadoRequest {
  cdAtendimento: number;
  nrProntuario: string;
  tpTermo: 'TCLE_CONTRASTE' | 'LGPD' | 'TELEMEDICINA';
  dsAssinaturaBase64: string;
  dsHashSha256: string;
  dtAssinatura: string;
}
