'use client';

import { useEffect, useState } from 'react';

import { clearDemoSession, getOrCreateDemoSession } from '../../lib/demo/demo-auth';
import type { DemoCredentials } from '../../lib/demo/types';

interface PatientDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: 'validado' | 'em_analise';
  size: string;
}

interface Dependente {
  id: string;
  nome: string;
  parentesco: string;
  idade: string;
  cpf: string;
  especialidade: string;
}

export default function PerfilPage() {
  const [session, setSession] = useState<DemoCredentials | null>(null);

  // Estados de Atualização Cadastral
  const [patientName, setPatientName] = useState<string>('Carlos Alberto da Silva');
  const [phone, setPhone] = useState<string>('(41) 99872-3011');
  const [address, setAddress] = useState<string>('Rua Nicolau Maeder, 420 - Juvevê, Curitiba/PR');
  const [emergencyContact, setEmergencyContact] = useState<string>('Mariana Silva (Esposa) - (41) 99123-4567');
  const [isEditingData, setIsEditingData] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Estados de Envio de Documentos
  const [documents, setDocuments] = useState<PatientDocument[]>([
    {
      id: 'doc-1',
      name: 'RG_Frente_Verso.pdf',
      type: 'Documento de Identidade com Foto',
      uploadedAt: '12/10/2026',
      status: 'validado',
      size: '1.4 MB',
    },
    {
      id: 'doc-2',
      name: 'Carteirinha_Unimed_2026.pdf',
      type: 'Comprovante de Convênio',
      uploadedAt: '14/10/2026',
      status: 'validado',
      size: '820 KB',
    },
  ]);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Estados do Formulário de Dependentes
  const [dependentes, setDependentes] = useState<Dependente[]>([
    {
      id: 'dep-1',
      nome: 'Maria Eduarda Silva',
      parentesco: 'Filha',
      idade: '11 anos',
      cpf: '089.***.***-12',
      especialidade: 'Pediatria Humanizada',
    },
    {
      id: 'dep-2',
      nome: 'João Pedro Silva',
      parentesco: 'Filho',
      idade: '6 anos',
      cpf: '094.***.***-45',
      especialidade: 'Pediatria Humanizada',
    },
  ]);
  const [isAddingDependente, setIsAddingDependente] = useState<boolean>(false);
  const [depNome, setDepNome] = useState<string>('');
  const [depParentesco, setDepParentesco] = useState<string>('Filho(a)');
  const [depDataNasc, setDepDataNasc] = useState<string>('');
  const [depCpf, setDepCpf] = useState<string>('');

  useEffect(() => {
    const s = getOrCreateDemoSession();
    setSession(s);
    if (s?.patientName) setPatientName(s.patientName);
  }, []);

  function handleSaveData(e: React.FormEvent) {
    e.preventDefault();
    setIsEditingData(false);
    setSaveSuccessMsg('Dados cadastrais atualizados e sincronizados com sucesso no SOUL MV!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      const file = files[0];
      const newDoc: PatientDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: 'Exame / Pedido Médico Anexo',
        uploadedAt: new Date().toLocaleDateString('pt-BR'),
        status: 'em_analise',
        size: `${(file.size / 1024).toFixed(0)} KB`,
      };
      setDocuments([newDoc, ...documents]);
      setUploadSuccessMsg(`Documento "${file.name}" enviado com sucesso para a recepção digital!`);
      setTimeout(() => setUploadSuccessMsg(null), 4500);
    }
  }

  function handleAddDependente(e: React.FormEvent) {
    e.preventDefault();
    if (!depNome.trim()) return;

    const novoDep: Dependente = {
      id: `dep-${Date.now()}`,
      nome: depNome,
      parentesco: depParentesco,
      idade: depDataNasc ? `Nasc. ${depDataNasc}` : 'Menor de idade',
      cpf: depCpf || 'Pendente de certidão',
      especialidade: 'Clínica Geral / Pediatria',
    };

    setDependentes([...dependentes, novoDep]);
    setIsAddingDependente(false);
    setDepNome('');
    setDepParentesco('Filho(a)');
    setDepDataNasc('');
    setDepCpf('');
    setSaveSuccessMsg(`Dependente ${novoDep.nome} cadastrado e vinculado ao prontuário familiar!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  }

  function handleRemoveDependente(id: string) {
    if (confirm('Deseja realmente remover este dependente do seu cadastro familiar?')) {
      setDependentes(dependentes.filter((d) => d.id !== id));
      setSaveSuccessMsg('Dependente removido com sucesso.');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  }

  function handleLogout() {
    clearDemoSession();
    window.location.href = '/cadastro';
  }

  const remediosNaturais = [
    { nome: 'Água Pura', icon: 'water_drop', desc: 'Hidratação constante ao longo do dia' },
    { nome: 'Ar Puro', icon: 'air', desc: 'Respiração profunda e contato com a natureza' },
    { nome: 'Alimentação Saudável', icon: 'nutrition', desc: 'Dieta equilibrada à base de plantas' },
    { nome: 'Exercício Físico', icon: 'directions_walk', desc: 'Movimento diário regular e consciente' },
    { nome: 'Luz Solar', icon: 'wb_sunny', desc: 'Exposição moderada no início da manhã' },
    { nome: 'Temperança', icon: 'balance', desc: 'Equilíbrio e moderação em todas as coisas' },
    { nome: 'Repouso Reparador', icon: 'bedtime', desc: 'Sono de qualidade e descanso semanal' },
    { nome: 'Confiança em Deus', icon: 'favorite', desc: 'Paz espiritual e fortalecimento mental' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12 animate-fade-in-up">
      {/* Header from Stitch perfil_dependentes_e_sa_de_paciente */}
      <header className="sticky top-0 w-full z-40 bg-primary/95 backdrop-blur-xl shadow-sm pt-safe text-on-primary">
        <div className="h-16 px-4 lg:px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 min-w-0">
            <a
              href="/inicio"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-on-primary hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </a>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-fixed uppercase tracking-wider font-semibold truncate">
                  Clínica Adventista
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-medium">
                  Curitiba
                </span>
              </div>
              <h1 className="text-base font-bold text-on-primary leading-tight truncate">
                Perfil de Saúde, Cadastro &amp; Dependentes
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-on-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {/* Status Messages */}
        {saveSuccessMsg && (
          <div
            role="status"
            className="p-4 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed-variant text-sm font-bold flex items-center gap-2 shadow-sm animate-pulse"
          >
            <span className="material-symbols-outlined text-[22px]">check_circle</span>
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {uploadSuccessMsg && (
          <div
            role="status"
            className="p-4 rounded-2xl bg-secondary-fixed text-on-secondary-fixed text-sm font-bold flex items-center gap-2 shadow-sm animate-pulse"
          >
            <span className="material-symbols-outlined text-[22px]">upload_file</span>
            <span>{uploadSuccessMsg}</span>
          </div>
        )}

        {/* Status Banner */}
        <div className="flex items-center justify-between bg-surface-container-low px-5 py-3 rounded-2xl border border-surface-container">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
            <span className="text-xs md:text-sm font-semibold text-on-surface">
              Prontuário Ativo SOUL MV • Integração Biometria &amp; ICP-Brasil
            </span>
          </div>
          <span className="text-xs text-secondary font-bold font-mono">
            {session?.protocol ?? 'CMAC-DEMO-2026'}
          </span>
        </div>

        {/* Layout em 2 Colunas para Desktop (lg:) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Coluna Principal: 7 cols (Identificação, Atualização Cadastral e Documentos) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Header Card: Identificação do Paciente com Foto Real */}
            <section className="p-5 md:p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-slate-200/80">
              <div className="flex items-center gap-4">
                <div className="relative w-18 h-18 rounded-2xl overflow-hidden shrink-0 shadow-md ring-2 ring-primary/20 bg-slate-100">
                  <img
                    src="/avatars/paciente.jpg"
                    alt={patientName}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-primary truncate">{patientName}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold">
                      Titular
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {session?.email ?? 'paciente.demonstrativo@cmac.demo'}
                  </p>
                  <p className="text-xs text-outline font-mono mt-0.5">
                    CPF: ***.482.919-** • Prontuário MV: {session?.id ?? '84920-01'}
                  </p>
                </div>
              </div>
            </section>

            {/* SEÇÃO 1: ATUALIZAÇÃO CADASTRAL DO PACIENTE */}
            <section className="card-interactive p-5 md:p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[22px] text-secondary">
                    badge
                  </span>
                  <h3 className="text-base font-bold text-primary">Atualização Cadastral</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingData(!isEditingData)}
                  className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isEditingData ? 'close' : 'edit'}
                  </span>
                  <span>{isEditingData ? 'Cancelar' : 'Editar Dados'}</span>
                </button>
              </div>

              {!isEditingData ? (
                /* Visualização dos Dados */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                    <span className="text-outline block mb-0.5">Nome Completo:</span>
                    <strong className="text-sm text-primary font-semibold">{patientName}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                    <span className="text-outline block mb-0.5">Telefone / WhatsApp:</span>
                    <strong className="text-sm text-primary font-semibold">{phone}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container sm:col-span-2">
                    <span className="text-outline block mb-0.5">Endereço Residencial:</span>
                    <strong className="text-sm text-primary font-semibold">{address}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container sm:col-span-2">
                    <span className="text-outline block mb-0.5">Contato de Emergência:</span>
                    <strong className="text-sm text-primary font-semibold">{emergencyContact}</strong>
                  </div>
                </div>
              ) : (
                /* Formulário de Edição */
                <form onSubmit={handleSaveData} className="flex flex-col gap-3.5 text-xs">
                  <div>
                    <label className="text-outline font-medium block mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                      className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-slate-200 text-on-surface font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-outline font-medium block mb-1">Telefone Celular</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-slate-200 text-on-surface font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-outline font-medium block mb-1">Contato de Emergência</label>
                      <input
                        type="text"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-slate-200 text-on-surface font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-outline font-medium block mb-1">Endereço Completo</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-slate-200 text-on-surface font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingData(false)}
                      className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-medium hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-glow px-5 py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Salvar Alterações</span>
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* SEÇÃO 2: ENVIO DE DOCUMENTOS & LAUDOS ANTERIORES */}
            <section className="card-interactive p-5 md:p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[22px] text-secondary">
                    folder_shared
                  </span>
                  <h3 className="text-base font-bold text-primary">Envio de Documentos &amp; Pedidos</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                  Recepção Digital
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Envie fotos do documento oficial (RG/CNH), carteirinha do convênio ou pedidos médicos para agilizar seu atendimento e pré-autorização de guias.
              </p>

              {/* Área de Drag & Drop / Input de Upload */}
              <label className="p-6 rounded-2xl border-2 border-dashed border-secondary/40 hover:border-secondary bg-surface-container-low/50 hover:bg-surface-container-low flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer transition-all">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
                </div>
                <div className="flex flex-col">
                  <strong className="text-sm text-primary font-bold">
                    Clique aqui para enviar um documento
                  </strong>
                  <span className="text-[11px] text-outline mt-0.5">
                    Formatos suportados: PDF, JPG ou PNG (até 15 MB)
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Lista de Documentos Enviados */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-xs font-bold text-primary">Documentos Já Vinculados ao Prontuário:</span>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-3 text-xs border border-surface-container"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">description</span>
                      </div>
                      <div className="min-w-0">
                        <strong className="text-primary font-semibold block truncate">{doc.name}</strong>
                        <span className="text-outline text-[11px]">
                          {doc.type} • {doc.size} • Enviado em {doc.uploadedAt}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        doc.status === 'validado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {doc.status === 'validado' ? 'Validado' : 'Em Análise'}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Carteira Digital de Saúde do Stitch */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-primary">Carteira Digital de Saúde</h3>
                <span className="text-xs text-secondary font-semibold">Elegibilidade Ativa</span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-md flex flex-col justify-between gap-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary-fixed text-[24px]">
                      medical_information
                    </span>
                    <strong className="text-sm tracking-wide">Unimed Curitiba / Bradesco Saúde</strong>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                    Nacional Top
                  </span>
                </div>

                <div className="py-2">
                  <span className="text-[11px] text-surface-container-high block">Número da Carteirinha</span>
                  <span className="font-mono text-lg font-bold tracking-wider text-white">
                    0029 • 4820 • 9182 • 0019
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-surface-container-high border-t border-white/15 pt-2">
                  <span>Validade: 12/2028</span>
                  <span className="text-tertiary-fixed font-semibold">Sem Carências Pendentes</span>
                </div>
              </div>
            </section>
          </div>

          {/* Coluna Secundária: 5 cols (Dependentes, Alertas & 8 Remédios Naturais) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Prontuário Familiar & Dependentes com FORMULÁRIO COMPLETO */}
            <section className="card-interactive p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-secondary">family_restroom</span>
                  <h3 className="text-base font-bold text-primary">Prontuário Familiar &amp; Dependentes</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingDependente(!isAddingDependente)}
                  className="text-xs text-secondary font-semibold hover:underline flex items-center gap-1 cursor-pointer bg-secondary-fixed/20 px-2.5 py-1 rounded-lg"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isAddingDependente ? 'close' : 'person_add'}
                  </span>
                  <span>{isAddingDependente ? 'Cancelar' : 'Adicionar'}</span>
                </button>
              </div>

              {/* FORMULÁRIO DE INCLUSÃO DE DEPENDENTE */}
              {isAddingDependente && (
                <form
                  onSubmit={handleAddDependente}
                  className="p-4 rounded-xl bg-surface-container-low border border-secondary/30 flex flex-col gap-3 text-xs animate-fade-in-up"
                >
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <span className="material-symbols-outlined text-[18px] text-secondary">group_add</span>
                    <span>Novo Dependente</span>
                  </div>

                  <div>
                    <label className="text-outline font-medium block mb-1">Nome Completo do Dependente *</label>
                    <input
                      type="text"
                      placeholder="Ex: Beatriz Silva"
                      value={depNome}
                      onChange={(e) => setDepNome(e.target.value)}
                      required
                      className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest border border-slate-200 text-on-surface font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-outline font-medium block mb-1">Parentesco</label>
                      <select
                        value={depParentesco}
                        onChange={(e) => setDepParentesco(e.target.value)}
                        className="w-full h-10 px-2.5 rounded-lg bg-surface-container-lowest border border-slate-200 text-on-surface font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                      >
                        <option value="Filho(a)">Filho(a)</option>
                        <option value="Cônjuge">Cônjuge</option>
                        <option value="Pai/Mãe">Pai/Mãe</option>
                        <option value="Enteado(a)">Enteado(a)</option>
                        <option value="Tutela Legal">Tutela Legal</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-outline font-medium block mb-1">Data de Nascimento</label>
                      <input
                        type="date"
                        value={depDataNasc}
                        onChange={(e) => setDepDataNasc(e.target.value)}
                        className="w-full h-10 px-2.5 rounded-lg bg-surface-container-lowest border border-slate-200 text-on-surface font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-outline font-medium block mb-1">CPF ou Número da Certidão</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={depCpf}
                      onChange={(e) => setDepCpf(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest border border-slate-200 text-on-surface font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingDependente(false)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-medium hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-glow px-4 py-1.5 rounded-lg bg-primary text-on-primary font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Salvar Dependente</span>
                    </button>
                  </div>
                </form>
              )}

              {/* LISTA DE DEPENDENTES ATIVOS */}
              <div className="flex flex-col gap-2.5">
                {dependentes.map((dep) => (
                  <div
                    key={dep.id}
                    className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-xs border border-surface-container hover:border-secondary/30 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {dep.nome
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div className="min-w-0">
                        <strong className="text-on-surface block font-semibold truncate">{dep.nome}</strong>
                        <span className="text-outline text-[11px] block truncate">
                          {dep.parentesco} • {dep.idade} • {dep.especialidade}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Vinculado
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDependente(dep.id)}
                        title="Remover dependente"
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-outline hover:text-red-700 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Alertas Médicos & Alergias do Stitch */}
            <section className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-slate-200/80">
              <div className="flex items-center gap-2 text-error font-bold text-base">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <span>Alertas Médicos &amp; Alergias</span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Registrados no prontuário eletrônico para segurança em prescrições e procedimentos.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-error-container/40 text-on-error-container text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">block</span>
                  Alergia a Dipirona
                </span>
                <span className="px-3 py-1 rounded-full bg-error-container/40 text-on-error-container text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">block</span>
                  Contraste Iodado (Moderada)
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-container text-primary text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">favorite</span>
                  Hipertensão Leve Controlada
                </span>
              </div>
            </section>

            {/* Os 8 Remédios Naturais da Tradição Adventista de Saúde (Stitch) */}
            <section className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3.5 border border-slate-200/80">
              <div className="flex items-center gap-2.5 text-primary font-bold text-base">
                <span className="material-symbols-outlined text-[22px] text-tertiary">eco</span>
                <span>Os 8 Remédios Naturais</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Princípios de estilo de vida da Rede Adventista de Saúde para promover cura integral e longevidade:
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {remediosNaturais.map((rem) => (
                  <div
                    key={rem.nome}
                    className="p-2.5 rounded-xl bg-surface-container-low flex items-start gap-2 border border-surface-container"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                      {rem.icon}
                    </span>
                    <div className="min-w-0">
                      <strong className="block text-primary font-semibold truncate">{rem.nome}</strong>
                      <span className="text-[10px] text-on-surface-variant line-clamp-2">
                        {rem.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
