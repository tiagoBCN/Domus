export interface EADData {
  codigoPaciente: string;
  dataAvaliacao: string;
  statusProtocolo: string;
  origemDemanda: string;
  profissional: string;
  pontuacaoAnterior: number | "";

  valores: {
    intercorrencias: number | null;
    sintomas: number | null;
    funcionalidade: number | null;
    procedimentos: number | null;
    dispositivos: number | null;
    tratamento: number | null;
    cuidador: number | null;
  };

  scoreTotal?: number;
  classificacao?: string;
  freqGeral?: string;
  freqACS?: string;
  freqEnf?: string;
  freqMed?: string;
}

export interface HistoricoACS {
  acsNome?: string;
  dataColeta?: string;
  abvd?: string;
  alertaFinal?: string;
  alertaQual?: string;
}

export interface Paciente {
  id: string;
  nome: string;
  cpf?: string;
  prontuario?: string;
  idade?: number;
  dataCriacao?: string;
  statusProtocolo?: string;

  historicoEAD: EADData[];
  historicoACS: ACSData[];
  historicoTriagem: unknown[];
}

export interface AcsChecklistItem {
  id: number;
  informacao: string;
  pergunta: string;
  resposta?: string;
}

export interface AcsFormulario {
  pacienteCodigo?: string;
  dataColeta?: string;
  acsResponsavel?: string;
  mobilidade?: string;
  abvd?: string;
  upaVezes?: number;
  internacaoVezes?: number;
  sintoma?: string;
  sintomaFreq?: string;
  cuidados?: string[];
  dispositivos?: string;
  medicamentosAlterados?: string;
  medicamentosQual?: string;
  cuidadorNome?: string;
  cuidadorStatus?: string;
  piora?: string;
  necessidade?: string;
  alertaFinal?: string;
  alertaQual?: string;
  observacoes?: string[];
}

export interface TriagemFiltro {
  campo: string;
  valor: string;
}

export interface TriagemDados {
  codigoPaciente?: string;
  dataAvaliacao?: string;
  origemDemanda?: string;
  profissional?: string;
  pontuacaoAnterior?: number;
  statusProtocolo?: string;
  filtros?: TriagemFiltro[];
}

export interface EadDominio {
  id: string;
  label: string;
  pontuacao: number;
  observacao?: string;
}

export interface EadResultado {
  dominios: EadDominio[];
  total: number;
  classificacao: string;
}

export interface PacienteForm {
  nome: string;
  prontuario?: string;
  dataCriacao?: string;
  statusProtocolo?: string;
}

export interface ACSData {
  paciente: string;
  dataColeta: string;
  acsNome: string;
  mobilidade: string;
  abvd: string;

  intercorrencias: {
    naoTeve: boolean;
    upaVezes: number;
    hospVezes: number;
  };

  sintomas: string;
  sintomasFreq: string;
  cuidados: string[];
  cuidadosOutro: string;
  dispositivos: string;
  medAlterado: string;
  medQual: string;
  cuidadorNome: string;
  cuidadorStatus: string;
  pioraRecente: string;
  necessidade: string;
  observacoes: string[];
  alertaFinal: string;
  alertaQual: string;
}

export interface TriagemData {
  a1: {
    resolutiva: boolean | null;
    razoavel: boolean | null;
    adesao: boolean | null;
    consentimento: boolean | null;
    infra: boolean | null;
  };
  alta: { [key: string]: boolean };
  media: { [key: string]: boolean };
  e3: {
    internacao: number | null;
    urgencia: number | null;
    tempo: number | null;
    morador: number | null;
    suporte: number | null;
    crianca: string | null;
    neuro: number | null;
    banho: number | null;
    alimentacao: number | null;
    locomocao: number | null;
    poli: number | null;
  };
  classificacaoFinal?: string;
  servicoResponsavel?: string;
  frequenciaRecomendada?: string;
  pontosIAEC?: number;
}