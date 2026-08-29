"use client";

import { useState } from "react";
import {
  ClipboardList,
  Search,
  BarChart3,
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  HeartPulse,
  ChevronRight,
  X,
  BookOpen,
} from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import type {
  Paciente,
  EADData,
  ACSData,
  AcsChecklistItem,
  AcsFormulario,
  TriagemFiltro,
  TriagemDados,
  EadDominio,
  EadResultado,
  PacienteForm,
} from "./types/triagens";

// --- TIPOS DE DADOS ---
interface TriagemData {
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

interface IAECOption {
  v: string | number;
  l: string;
}

interface IAECItem {
  title: string;
  opts: IAECOption[];
}

// --- DADOS MOCKADOS INICIAIS ---
const MOCK_PACIENTES: Paciente[] = [
  {
    id: "PAC-0231",
    nome: "Maria de Souza Silva",
    prontuario: "PAC-0231",
    idade: 78,
    dataCriacao: "2026-08-01",
    statusProtocolo: "AD1 (Atenção Básica)",
    historicoACS: [
      {
        paciente: "Maria de Souza Silva",
        dataColeta: "2026-08-05",
        acsNome: "Carlos Alberto",
        mobilidade: "Só com ajuda",
        abvd: "Precisa de ajuda para tomar banho e se vestir.",
        intercorrencias: { naoTeve: true, upaVezes: 0, hospVezes: 0 },
        sintomas: "Dor nas pernas",
        sintomasFreq: "2x por semana",
        cuidados: ["Medicação"],
        cuidadosOutro: "",
        dispositivos: "Nenhum",
        medAlterado: "Não",
        medQual: "",
        cuidadorNome: "Ana Silva (Filha)",
        cuidadorStatus: "Adequado",
        pioraRecente: "Igual",
        necessidade: "Auxílio para locomoção e banho",
        observacoes: [
          "Dificuldade importante para caminhar",
          "Dificuldade para levantar / sentar",
        ],
        alertaFinal: "Não",
        alertaQual: "",
      },
    ],
    historicoTriagem: [],
    historicoEAD: [
      {
        codigoPaciente: "PAC-0231",
        dataAvaliacao: "2026-08-06",
        statusProtocolo: "AD1",
        origemDemanda: "eSF",
        profissional: "Enf. Roberta",
        pontuacaoAnterior: "",
        valores: {
          intercorrencias: 0,
          sintomas: 1,
          funcionalidade: 2,
          procedimentos: 0,
          dispositivos: 0,
          tratamento: 0,
          cuidador: 1,
        },
        scoreTotal: 4,
        classificacao: "Muito baixa",
        freqGeral: "1 visita a cada 30–60 dias",
        freqACS: "1 visita a cada 30–60 dias",
        freqEnf: "Conforme necessidade / planejamento",
        freqMed: "Somente se necessário",
      },
    ],
  },
  {
    id: "PAC-0842",
    nome: "João dos Santos Oliveira",
    prontuario: "PAC-0842",
    idade: 82,
    dataCriacao: "2026-08-10",
    statusProtocolo: "AD2 (SAD / EMAD)",
    historicoACS: [
      {
        paciente: "João dos Santos Oliveira",
        dataColeta: "2026-08-12",
        acsNome: "Fernanda Lima",
        mobilidade: "Não",
        abvd: "Acamado, dependente para todas as atividades básicas.",
        intercorrencias: { naoTeve: false, upaVezes: 1, hospVezes: 1 },
        sintomas: "Falta de ar ao deitar",
        sintomasFreq: "Diário",
        cuidados: ["Curativo", "Medicação"],
        cuidadosOutro: "",
        dispositivos: "Sonda Vesical de Demora",
        medAlterado: "Sim",
        medQual: "Troca do anti-hipertensivo",
        cuidadorNome: "Maria dos Santos (Esposa)",
        cuidadorStatus: "Com dificuldade",
        pioraRecente: "Pior",
        necessidade: "Cuidados com curativo de escara sacral e troca de sonda",
        observacoes: [
          "Dificuldade importante para caminhar",
          "Permanência prolongada no leito",
          "Necessidade evidente de auxílio para ABVD",
          "Presença de feridas / curativos",
          "Presença de sondas ou dispositivos",
          "Dificuldade aparente do cuidador",
        ],
        alertaFinal: "Sim",
        alertaQual:
          "Esposa idosa cansada, paciente acamado com ferida sacral piorando.",
      },
    ],
    historicoTriagem: [
      {
        a1: {
          resolutiva: true,
          razoavel: true,
          adesao: true,
          consentimento: true,
          infra: true,
        },
        alta: {
          npt: false,
          vm: false,
          dialise: false,
          paracentese: false,
          transfusao: false,
        },
        media: {
          curativo: true,
          medInjetavel: false,
          reab: true,
          sonda: true,
          oxigenio: false,
        },
        e3: {
          internacao: 1,
          urgencia: 1,
          tempo: 1,
          morador: 1,
          suporte: 1,
          crianca: "nao",
          neuro: null,
          banho: 2,
          alimentacao: 1,
          locomocao: 2,
          poli: 1,
        },
        classificacaoFinal: "AD2",
        servicoResponsavel:
          "Serviço de Atenção Domiciliar — SAD Melhor em Casa (EMAD/EMAP)",
        frequenciaRecomendada: "No mínimo 1 visita por semana",
        pontosIAEC: 11,
      },
    ],
    historicoEAD: [
      {
        codigoPaciente: "PAC-0842",
        dataAvaliacao: "2026-08-14",
        statusProtocolo: "AD2",
        origemDemanda: "AltaHosp",
        profissional: "Dr. Marcos",
        pontuacaoAnterior: 14,
        valores: {
          intercorrencias: 3,
          sintomas: 2,
          funcionalidade: 3,
          procedimentos: 2,
          dispositivos: 2,
          tratamento: 1,
          cuidador: 2,
        },
        scoreTotal: 15,
        classificacao: "CRÍTICO / ALERTA PRIORITÁRIO (Red Flag Ativa)",
        freqGeral:
          "🚨 VISITA EM ATÉ 7 DIAS (Preferencialmente reavaliação em até 48h)",
        freqACS:
          "Comunicação imediata à equipe da UBS e monitoramento territorial intensivo",
        freqEnf:
          "Visita prioritária em até 7 dias (preferencialmente reavaliação em até 48h) para plano de cuidados e proposições de Assistência Social (CRAS), equipe Multiprofissional ou eMulti/NASF",
        freqMed:
          "Avaliação médica prioritária para estabilização clínica, ajuste terapêutico e análise de encaminhamento para SAD (EMAD/AD2/AD3)",
      },
    ],
  },
];

const Q1 = [
  {
    key: "resolutiva",
    label: "A visita domiciliar é resolutiva?",
    help: "O problema de saúde apresentado pode ser adequadamente resolvido no domicílio, com os recursos que a equipe efetivamente dispõe?",
    stop: "A necessidade do usuário provavelmente será mais bem respondida em outro ponto da rede (UBS, ambulatório de especialidade ou urgência/emergência).",
    action: "Encaminhar para o atendimento adequado",
  },
  {
    key: "razoavel",
    label: "A visita domiciliar é razoável?",
    help: "A frequência de visitas estimada é compatível com a capacidade operacional da equipe, sem risco relevante à segurança do profissional?",
    stop: "O esforço necessário (deslocamento, tempo, recursos) não se justifica frente às alternativas disponíveis, ou há risco à segurança da equipe.",
    action: "Buscar melhor alternativa de atendimento",
  },
  {
    key: "adesao",
    label: "Há adesão do usuário e da família?",
    help: "Usuário e/ou família concordam com o acompanhamento domiciliar, e há cuidador disponível quando o caso exige?",
    stop: "Sem adesão do usuário ou da família, o acompanhamento domiciliar não deve ser iniciado neste momento.",
    action: "Não realizar a visita domiciliar",
  },
  {
    key: "consentimento",
    label: "O consentimento (TCLE) foi obtido?",
    help: "O Termo de Consentimento Livre e Esclarecido foi apresentado e assinado pelo usuário (se consciente) ou por seu representante legal/familiar?",
    stop: "Sem a formalização do consentimento, a admissão em Atenção Domiciliar não deve prosseguir.",
    action: "Não realizar a visita domiciliar",
  },
  {
    key: "infra",
    label: "A infraestrutura domiciliar é adequada?",
    help: "Água potável, energia elétrica, meio de comunicação, acesso da equipe e espaço físico mínimo para o cuidado proposto.",
    stop: null,
    action: null,
  },
] as const;

const ALTA_ITEMS = [
  {
    key: "vm",
    label: "Ventilação mecânica invasiva / VMNI de alta complexidade",
  },
  { key: "paracentese", label: "Paracentese de repetição" },
  { key: "npt", label: "Nutrição parenteral" },
  { key: "transfusao", label: "Transfusão sanguínea domiciliar" },
] as const;

const MEDIA_ITEMS = [
  { key: "curativo", label: "Curativos diários complexos (grandes úlceras)" },
  {
    key: "parenteral",
    label: "Medicação parenteral diária (IM/EV/SC, exceto insulina)",
  },
] as const;

const IAEC_E3 = [
  {
    key: "internacao",
    title: "Internações hospitalares nos últimos 3 meses",
    help: "Considere qualquer motivo de internação.",
    opts: [
      { v: 0, l: "Nenhuma internação" },
      { v: 1, l: "Ao menos 1 internação" },
      { v: 2, l: "2 ou mais internações" },
      { v: 4, l: "Ao menos 1 internação em UTI" },
    ],
  },
  {
    key: "urgencia",
    title: "Procura por serviço de urgência nos últimos 3 meses",
    help: "SAMU, UPA ou Pronto-Socorro.",
    opts: [
      { v: 0, l: "Nenhuma procura" },
      { v: 1, l: "2 vezes" },
      { v: 2, l: "3 a 4 vezes" },
      { v: 3, l: "5 ou mais vezes" },
    ],
  },
  {
    key: "tempo",
    title: "Tempo de permanência hospitalar",
    help: "Considere a maior internação recente.",
    opts: [
      { v: 0, l: "Sem internação prévia" },
      { v: 1, l: "Até 7 dias" },
      { v: 2, l: "De 7 a 30 dias" },
      { v: 3, l: "Mais de 30 dias" },
    ],
  },
  {
    key: "morador",
    title: "Relação morador/cômodo do domicílio",
    help: "Número de moradores dividido pelo número de cômodos.",
    opts: [
      { v: 0, l: "Menor que 1" },
      { v: 1, l: "Igual a 1" },
      { v: 2, l: "Maior que 1" },
    ],
  },
  {
    key: "suporte",
    title: "Suporte familiar / cuidador",
    help: "",
    opts: [
      { v: 0, l: "Suporte familiar adequado" },
      { v: 1, l: "Suporte familiar inadequado" },
    ],
  },
  {
    key: "crianca",
    title: "Faixa etária",
    help: "O paciente é uma criança de até 7 anos?",
    opts: [
      { v: "sim", l: "Sim, até 7 anos" },
      { v: "nao", l: "Não — 8 anos ou mais" },
    ],
  },
] as const;

const IAEC_NEURO = {
  key: "neuro",
  title: "Desenvolvimento neuropsicomotor",
  help: "",
  opts: [
    { v: 0, l: "Acompanha o desenvolvimento esperado" },
    { v: 6, l: "Não acompanha o desenvolvimento esperado" },
  ],
} as const;
const IAEC_ADL = [
  {
    key: "banho",
    title: "Capacidade para tomar banho",
    help: "",
    opts: [
      { v: 0, l: "Independente" },
      { v: 1, l: "Dependente parcial" },
      { v: 2, l: "Dependente completo" },
    ],
  },
  {
    key: "alimentacao",
    title: "Capacidade para alimentar-se",
    help: "",
    opts: [
      { v: 0, l: "Independente" },
      { v: 1, l: "Dependente parcial" },
      { v: 2, l: "Dependente completo" },
    ],
  },
  {
    key: "locomocao",
    title: "Capacidade para locomover-se",
    help: "",
    opts: [
      { v: 0, l: "Independente" },
      { v: 1, l: "Dependente parcial" },
      { v: 2, l: "Dependente completo" },
    ],
  },
] as const;
const IAEC_POLI = {
  key: "poli",
  title: "Polifarmácia",
  help: "Uso de 5 ou mais medicações contínuas, diariamente.",
  opts: [
    { v: 0, l: "Não" },
    { v: 1, l: "Sim" },
  ],
} as const;

const IAEC_SERVICE = {
  AD1: {
    nome: "Atenção Primária à Saúde (APS / ESF / UBS)",
    freq: "No mínimo 1 visita por mês",
    desc: "Problemas de saúde controlados/compensados, menor complexidade.",
  },
  AD2: {
    nome: "Serviço de Atenção Domiciliar — SAD Melhor em Casa (EMAD/EMAP)",
    freq: "No mínimo 1 visita por semana",
    desc: "Maior frequência de cuidado, acompanhamento contínuo até estabilização.",
  },
  AD3: {
    nome: "Serviço de Atenção Domiciliar — SAD Melhor em Casa (EMAD/EMAP)",
    freq: "No mínimo 1 visita por semana (intensiva)",
    desc: "Cuidado multiprofissional de alta complexidade, procedimentos especiais/VMNI.",
  },
} as const;

const EAD_DOMAINS = [
  {
    id: "intercorrencias",
    title: "1. Intercorrências clínicas",
    icon: "🚑",
    note: "Histórico recente de atendimentos não programados e agudizações nos últimos 30 dias (Caderno AD / MS).",
    options: [
      { v: 0, t: "Nenhuma intercorrência nos últimos 30 dias." },
      {
        v: 1,
        t: "1 intercorrência sem necessidade de atendimento de urgência.",
      },
      {
        v: 2,
        t: "≥2 intercorrências ou 1 atendimento em UPA / Pronto-Socorro.",
      },
      {
        v: 3,
        t: "Internação hospitalar recente ou ≥2 atendimentos de urgência.",
      },
    ],
  },
  {
    id: "sintomas",
    title: "2. Sintomas e Estabilidade Clínica",
    icon: "🩺",
    note: "Avaliar grau de compensação clínica, dor ou sintomas descontrolados.",
    options: [
      { v: 0, t: "Ausentes ou clinicamente compensados/controlados." },
      { v: 1, t: "Presentes ≤2 dias/semana, sem limitação das atividades." },
      { v: 2, t: "Presentes ≥3 dias/semana ou com limitação das atividades." },
      {
        v: 3,
        t: "Diários, persistentes ou com necessidade de intervenção imediata.",
      },
    ],
  },
  {
    id: "funcionalidade",
    title: "3. Funcionalidade e Autonomia (ABVD)",
    icon: "🚶",
    note: "Atividades Básicas: alimentação, banho, higiene pessoal, vestir-se, banheiro, continência e mobilidade.",
    options: [
      { v: 0, t: "Independente nas ABVD e locomoção preservada." },
      { v: 1, t: "Dependência leve (1–2 ABVD) ou auxílio de dispositivo." },
      {
        v: 2,
        t: "Dependência moderada (3–4 ABVD) ou auxílio de terceiros para marcha.",
      },
      {
        v: 3,
        t: "Dependência grave (≥5 ABVD), acamamento ou restrição total ao leito.",
      },
    ],
  },
  {
    id: "procedimentos",
    title: "4. Procedimentos de Cuidado",
    icon: "🩹",
    note: "Curativos complexos, medicações parenterais, reabilitação e cuidados específicos de enfermagem.",
    options: [
      { v: 0, t: "Nenhum procedimento domiciliar complexo necessário." },
      { v: 1, t: "Procedimentos ou cuidados simples ≤2 vezes/semana." },
      { v: 2, t: "Procedimentos ou cuidados regulares ≥3 vezes/semana." },
      {
        v: 3,
        t: "Procedimentos diários, múltiplas vezes ao dia ou de maior complexidade.",
      },
    ],
  },
  {
    id: "dispositivos",
    title: "5. Dispositivos e Tecnologias",
    icon: "🧪",
    note: "Sondas (SVD/SNG/GTT), traqueostomia, ostomias, oxigenoterapia e VMNI (CPAP/BIPAP).",
    options: [
      { v: 0, t: "Não utiliza dispositivos médicos." },
      { v: 1, t: "Dispositivo de baixa complexidade com manejo estável." },
      { v: 2, t: "Utiliza dispositivo contínuo com manejo rotineiro." },
      {
        v: 3,
        t: "Necessita manejo, aspiração ou monitorização frequente do dispositivo.",
      },
    ],
  },
  {
    id: "tratamento",
    title: "6. Tratamento e Farmacoterapia",
    icon: "💊",
    note: "Polifarmácia, adesão, estabilidade posológica e ajustes terapêuticos recentes.",
    options: [
      { v: 0, t: "Tratamento medicamentoso estável e bem adaptado." },
      { v: 1, t: "1–2 alterações terapêuticas nos últimos 30 dias." },
      { v: 2, t: "≥3 alterações terapêuticas ou dificuldade no manejo." },
      {
        v: 3,
        t: "Ajustes frequentes, descompensação ou monitorização profissional estrita.",
      },
    ],
  },
  {
    id: "cuidador",
    title: "7. Cuidador e Suporte Domiciliar",
    icon: "🏠",
    note: "Presença de cuidador apto, segurança da moradia e rede de apoio familiar (Cap. 6, MS 2012).",
    options: [
      { v: 0, t: "Cuidador disponível, apto e rede de apoio adequada." },
      { v: 1, t: "Pequenas dificuldades no suporte ou dúvidas no cuidado." },
      {
        v: 2,
        t: "Suporte insuficiente, sobrecarga ou necessidade frequente de orientação.",
      },
      {
        v: 3,
        t: "Ausência ou incapacidade do cuidador para os cuidados necessários.",
      },
    ],
  },
] as const;

const EAD_BANDS = [
  {
    min: 0,
    max: 4,
    key: "muitobaixa",
    label: "Muito baixa",
    freqGeral: "1 visita a cada 30–60 dias",
    acs: "1 visita a cada 30–60 dias",
    enf: "Conforme necessidade / planejamento",
    med: "Somente se necessário",
  },
  {
    min: 5,
    max: 8,
    key: "baixa",
    label: "Baixa",
    freqGeral: "1 visita a cada 30 dias",
    acs: "1 visita / mês",
    enf: "1 visita a cada 30–60 dias",
    med: "Conforme necessidade",
  },
  {
    min: 9,
    max: 13,
    key: "moderada",
    label: "Moderada",
    freqGeral: "2 visitas / mês",
    acs: "1 visita a cada 15 dias",
    enf: "1 visita / mês",
    med: "1 visita a cada 2–3 meses ou conf. nec.",
  },
  {
    min: 14,
    max: 17,
    key: "alta",
    label: "Alta",
    freqGeral: "1 visita / semana",
    acs: "1 visita / semana",
    enf: "2 visitas / mês",
    med: "1 visita / mês",
  },
  {
    min: 18,
    max: 21,
    key: "muitoalta",
    label: "Muito alta",
    freqGeral: "1–2 visitas / semana",
    acs: "1–2 visitas / semana",
    enf: "1 visita / semana",
    med: "1–2 visitas / mês",
  },
] as const;

export default function Page() {
  const [pacientes, setPacientes] = useState<Paciente[]>(MOCK_PACIENTES);
  const [selectedPacienteId, setSelectedPacienteId] =
    useState<string>("PAC-0231");
  const [showGuidelines, setShowGuidelines] = useState<boolean>(false);

  // --- CONTROLE DE MODAIS ---
  const [activeModal, setActiveModal] = useState<
    "acs" | "triagem" | "ead" | null
  >(null);

  // --- ESTADO DOS FORMULÁRIOS ---
  const [acsForm, setAcsForm] = useState<ACSData>({
    paciente: "",
    dataColeta: new Date().toISOString().split("T")[0],
    acsNome: "",
    mobilidade: "",
    abvd: "",
    intercorrencias: { naoTeve: true, upaVezes: 0, hospVezes: 0 },
    sintomas: "",
    sintomasFreq: "",
    cuidados: [],
    cuidadosOutro: "",
    dispositivos: "",
    medAlterado: "",
    medQual: "",
    cuidadorNome: "",
    cuidadorStatus: "",
    pioraRecente: "",
    necessidade: "",
    observacoes: [],
    alertaFinal: "",
    alertaQual: "",
  });
  const [acsResumo, setAcsResumo] = useState<string | null>(null);

  const [triagemStep, setTriagemStep] = useState<number>(0);
  const [triagemFilterIdx, setTriagemFilterIdx] = useState<number>(0);
  const [triagemIAECIdx, setTriagemIAECIdx] = useState<number>(0);
  const [triagemForm, setTriagemForm] = useState<TriagemData>({
    a1: {
      resolutiva: null,
      razoavel: null,
      adesao: null,
      consentimento: null,
      infra: null,
    },
    alta: {
      npt: false,
      vm: false,
      dialise: false,
      paracentese: false,
      transfusao: false,
    },
    media: {
      curativo: false,
      medInjetavel: false,
      reab: false,
      sonda: false,
      oxigenio: false,
    },
    e3: {
      internacao: null,
      urgencia: null,
      tempo: null,
      morador: null,
      suporte: null,
      crianca: null,
      neuro: null,
      banho: null,
      alimentacao: null,
      locomocao: null,
      poli: null,
    },
  });

  const [eadForm, setEadForm] = useState<EADData>({
    codigoPaciente: "",
    dataAvaliacao: new Date().toISOString().split("T")[0],
    statusProtocolo: "Inicio",
    origemDemanda: "eSF",
    profissional: "",
    pontuacaoAnterior: "",
    valores: {
      intercorrencias: null,
      sintomas: null,
      funcionalidade: null,
      procedimentos: null,
      dispositivos: null,
      tratamento: null,
      cuidador: null,
    },
  });
  const [eadResultado, setEadResultado] = useState<EADData | null>(null);

  // --- SUBMISSIONS HANDLERS ---
  const handleAcsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acsForm.paciente) return;

    const obsText =
      acsForm.observacoes.length > 0
        ? acsForm.observacoes.join(", ")
        : "Nenhuma";
    const cuidadosText =
      acsForm.cuidados.length > 0 ? acsForm.cuidados.join(", ") : "Nenhum";

    const resumo = `Paciente: ${acsForm.paciente} | Data: ${acsForm.dataColeta} | ACS: ${acsForm.acsNome}
Mobilidade: ${acsForm.mobilidade}
Intercorrências: ${acsForm.intercorrencias.naoTeve ? "Não" : `UPA: ${acsForm.intercorrencias.upaVezes}x, Hosp: ${acsForm.intercorrencias.hospVezes}x`}
Sintomas: ${acsForm.sintomas || "Nenhum"} (${acsForm.sintomasFreq || "—"})
Cuidados: ${cuidadosText} ${acsForm.cuidadosOutro ? `(${acsForm.cuidadosOutro})` : ""}
Dispositivos: ${acsForm.dispositivos || "Nenhum"}
Medicamento Alterado: ${acsForm.medAlterado} ${acsForm.medQual ? `(${acsForm.medQual})` : ""}
Cuidador: ${acsForm.cuidadorNome} (${acsForm.cuidadorStatus})
Piora: ${acsForm.pioraRecente} | Necessidade: ${acsForm.necessidade}
Obs: ${obsText}
Alerta Urgência: ${acsForm.alertaFinal} ${acsForm.alertaQual ? `(${acsForm.alertaQual})` : ""}`;

    setAcsResumo(resumo);

    const match = pacientes.find(
      (p) => p.nome.toLowerCase() === acsForm.paciente.toLowerCase(),
    );
    if (match) {
      setPacientes(
        pacientes.map((p) =>
          p.id === match.id
            ? {
                ...p,
                historicoACS: [acsForm, ...(p.historicoACS ?? [])],
              }
            : p,
        ),
      );
    } else {
      const newPac: Paciente = {
        id: `PAC-${Math.floor(1000 + Math.random() * 9000)}`,
        nome: acsForm.paciente,
        prontuario: `PRON-${Math.floor(100 + Math.random() * 900)}`,
        idade: 67,
        dataCriacao: new Date().toISOString().split("T")[0],
        statusProtocolo: "Inicio",
        historicoACS: [acsForm],
        historicoTriagem: [],
        historicoEAD: [],
      };
      setPacientes([newPac, ...pacientes]);
    }
  };

  const handleAcsClear = () => {
    setAcsForm({
      paciente: activePaciente?.nome || "",
      dataColeta: new Date().toISOString().split("T")[0],
      acsNome: "",
      mobilidade: "",
      abvd: "",
      intercorrencias: { naoTeve: true, upaVezes: 0, hospVezes: 0 },
      sintomas: "",
      sintomasFreq: "",
      cuidados: [],
      cuidadosOutro: "",
      dispositivos: "",
      medAlterado: "",
      medQual: "",
      cuidadorNome: "",
      cuidadorStatus: "",
      pioraRecente: "",
      necessidade: "",
      observacoes: [],
      alertaFinal: "",
      alertaQual: "",
    });
    setAcsResumo(null);
  };

  const handleTriagemStart = () => {
    setTriagemStep(1);
    setTriagemFilterIdx(0);
    setTriagemIAECIdx(0);
    setTriagemForm({
      a1: {
        resolutiva: null,
        razoavel: null,
        adesao: null,
        consentimento: null,
        infra: null,
      },
      alta: {
        npt: false,
        vm: false,
        dialise: false,
        paracentese: false,
        transfusao: false,
      },
      media: {
        curativo: false,
        medInjetavel: false,
        reab: false,
        sonda: false,
        oxigenio: false,
      },
      e3: {
        internacao: null,
        urgencia: null,
        tempo: null,
        morador: null,
        suporte: null,
        crianca: null,
        neuro: null,
        banho: null,
        alimentacao: null,
        locomocao: null,
        poli: null,
      },
    });
  };

  const handleFilterClick = (answer: boolean) => {
    const q = Q1[triagemFilterIdx];
    if (!q) return;

    setTriagemForm((prev) => ({
      ...prev,
      a1: { ...prev.a1, [q.key]: answer },
    }));

    if (!answer && q.stop) {
      setTriagemStep(-1);
      return;
    }

    if (triagemFilterIdx + 1 < Q1.length) {
      setTriagemFilterIdx((prev) => prev + 1);
      setTriagemStep((prev) => prev + 1);
    } else {
      setTriagemStep(6);
    }
  };

  const handleAltaSubmit = () => {
    const hasAlta = ALTA_ITEMS.some((item) => !!triagemForm.alta[item.key]);
    if (hasAlta) {
      setTriagemForm((prev) => ({
        ...prev,
        classificacaoFinal: "AD3",
        servicoResponsavel: IAEC_SERVICE.AD3.nome,
        frequenciaRecomendada: IAEC_SERVICE.AD3.freq,
        pontosIAEC: undefined,
      }));
      setTriagemStep(9);
      return;
    }
    setTriagemStep(7);
  };

  const handleMediaSubmit = () => {
    const hasMedia = MEDIA_ITEMS.some((item) => !!triagemForm.media[item.key]);
    if (hasMedia) {
      setTriagemForm((prev) => ({
        ...prev,
        classificacaoFinal: "AD2",
        servicoResponsavel: IAEC_SERVICE.AD2.nome,
        frequenciaRecomendada: IAEC_SERVICE.AD2.freq,
        pontosIAEC: undefined,
      }));
      setTriagemStep(9);
      return;
    }
    setTriagemIAECIdx(0);
    setTriagemStep(8);
  };

  const getIAECSequence = () => {
    const seq: any[] = [...IAEC_E3];
    if (triagemForm.e3.crianca === "sim") seq.push(IAEC_NEURO);
    else if (triagemForm.e3.crianca === "nao") seq.push(...IAEC_ADL);
    seq.push(IAEC_POLI);
    return seq;
  };

  const calculateIAECScore = (e3: TriagemData["e3"]) => {
    let total = 0;
    ["internacao", "urgencia", "tempo", "morador", "suporte", "poli"].forEach(
      (key) => {
        const value = e3[key as keyof TriagemData["e3"]];
        if (typeof value === "number") total += value;
      },
    );
    if (e3.crianca === "sim" && typeof e3.neuro === "number") total += e3.neuro;
    if (e3.crianca === "nao") {
      ["banho", "alimentacao", "locomocao"].forEach((key) => {
        const value = e3[key as keyof TriagemData["e3"]];
        if (typeof value === "number") total += value;
      });
    }
    return total;
  };

  const classifyIAEC = (total: number): "AD1" | "AD2" | "AD3" => {
    if (total >= 16) return "AD3";
    if (total >= 10) return "AD2";
    return "AD1";
  };

  const handleIAECClick = (value: number | string) => {
    const seq = getIAECSequence();
    const item = seq[triagemIAECIdx];
    if (!item) return;

    const nextE3 = {
      ...triagemForm.e3,
      [item.key]: value,
    } as TriagemData["e3"];
    setTriagemForm((prev) => ({ ...prev, e3: nextE3 }));

    if (triagemIAECIdx + 1 < seq.length) {
      setTriagemIAECIdx((prev) => prev + 1);
      return;
    }

    const total = calculateIAECScore(nextE3);
    const classificacao = classifyIAEC(total);
    const service = IAEC_SERVICE[classificacao];

    setTriagemForm((prev) => ({
      ...prev,
      e3: nextE3,
      classificacaoFinal: classificacao,
      servicoResponsavel: service.nome,
      frequenciaRecomendada: service.freq,
      pontosIAEC: total,
    }));
    setTriagemStep(9);
  };

  const handleEadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missing = EAD_DOMAINS.filter(
      (dom) => eadForm.valores[dom.id as keyof EADData["valores"]] === null,
    );
    if (missing.length > 0) return;

    const score = EAD_DOMAINS.reduce((sum, dom) => {
      const value = eadForm.valores[dom.id as keyof EADData["valores"]];
      return sum + (typeof value === "number" ? value : 0);
    }, 0);

    const band =
      EAD_BANDS.find((item) => score >= item.min && score <= item.max) ||
      EAD_BANDS[EAD_BANDS.length - 1];
    const redFlags: string[] = [];
    if (eadForm.valores.intercorrencias === 3)
      redFlags.push("Intercorrências clínicas em nível crítico");
    if (eadForm.valores.sintomas === 3)
      redFlags.push("Sintomas persistentes/descompensados");
    if (eadForm.valores.funcionalidade === 3)
      redFlags.push("Dependência funcional grave");
    if (eadForm.valores.cuidador === 3)
      redFlags.push("Ausência/incapacidade do cuidador");

    const hasRedFlag = redFlags.length > 0;
    const resultado: EADData = {
      ...eadForm,
      scoreTotal: score,
      classificacao: hasRedFlag
        ? "CRÍTICO / ALERTA PRIORITÁRIO (Red Flag Ativa)"
        : band.label,
      freqGeral: hasRedFlag
        ? "🚨 VISITA EM ATÉ 7 DIAS (Preferencialmente reavaliação em até 48h)"
        : band.freqGeral,
      freqACS: hasRedFlag
        ? "Comunicação imediata à equipe da UBS e monitoramento territorial intensivo"
        : band.acs,
      freqEnf: hasRedFlag
        ? "Visita prioritária em até 7 dias (preferencialmente reavaliação em até 48h) para plano de cuidados e proposições de Assistência Social (CRAS), equipe Multiprofissional ou eMulti/NASF"
        : band.enf,
      freqMed: hasRedFlag
        ? "Avaliação médica prioritária para estabilização clínica, ajuste terapêutico e análise de encaminhamento para SAD (EMAD/AD2/AD3)"
        : band.med,
    };

    setEadResultado(resultado);

    const target = activePaciente;
    if (target) {
      setPacientes((prev) =>
        prev.map((p) =>
          p.id === target.id
            ? { ...p, historicoEAD: [resultado, ...(p.historicoEAD ?? [])] }
            : p,
        ),
      );
    }
  };

  const handleEadClear = () => {
    setEadForm({
      codigoPaciente: selectedPacienteId,
      dataAvaliacao: new Date().toISOString().split("T")[0],
      statusProtocolo: "Inicio",
      origemDemanda: "eSF",
      profissional: "",
      pontuacaoAnterior: "",
      valores: {
        intercorrencias: null,
        sintomas: null,
        funcionalidade: null,
        procedimentos: null,
        dispositivos: null,
        tratamento: null,
        cuidador: null,
      },
    });
    setEadResultado(null);
  };

  const activePaciente =
    pacientes.find((p) => p.id === selectedPacienteId) || pacientes[0];

  return (
    <div className="min-h-screen bg-[#fdfafc] text-[#2d1822] flex font-sans">
      <Sidebar
        pacientes={pacientes}
        setPacientes={setPacientes}
        selectedPacienteId={selectedPacienteId}
        setSelectedPacienteId={setSelectedPacienteId}
        setShowGuidelines={setShowGuidelines}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          showGuidelines={showGuidelines}
          setShowGuidelines={setShowGuidelines}
          pacientes={pacientes}
          selectedPacienteId={selectedPacienteId}
          setSelectedPacienteId={setSelectedPacienteId}
          setEadForm={setEadForm}
          setAcsForm={setAcsForm}
        />

        {/* --- CONTEÚDO PRINCIPAL --- */}
        <main className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8 overflow-y-auto">
          {showGuidelines ? (
            /* --- DIRETRIZES SCREEN --- */
            <div className="bg-white border border-[#ffe3ec] rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-black text-[#2d1822]">
                  Diretrizes de Elegibilidade e Protocolo SUS
                </h2>
                <p className="text-xs text-gray-500">
                  Documento de suporte clínico rápido.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                <div className="space-y-2 p-4 bg-[#fffafc] rounded-xl border border-[#fff0f5]">
                  <h3 className="font-extrabold text-[#ff75a0] uppercase">
                    ACS (Agente Comunitário)
                  </h3>
                  <p className="text-gray-600">
                    O ACS faz o levantamento de campo. Coleta as informações
                    estruturadas e as repassa ao enfermeiro da ESF para cálculo
                    e estratificação do Escore EAD.
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-[#fffafc] rounded-xl border border-[#fff0f5]">
                  <h3 className="font-extrabold text-[#be80ff] uppercase">
                    Fluxo de Encaminhamento ao SAD
                  </h3>
                  <p className="text-gray-600">
                    Caso o paciente pontue na triagem direta por média ou alta
                    complexidade assistencial, deve-se gerar ficha e formalizar
                    a transferência de modalidade para AD2/AD3 no SAD (Melhor em
                    Casa).
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* --- DASHBOARD PRINCIPAL --- */
            <>
              {/* Quick Cards dos 3 Formulários (Open in Modal) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => {
                    handleAcsClear();
                    setActiveModal("acs");
                  }}
                  className="bg-white border border-[#ffe3ec] p-6 rounded-2xl text-left hover:border-[#ff75a0] transition-all flex flex-col justify-between h-36 relative group cursor-pointer"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="w-10 h-10 rounded-xl bg-[#fff0f5] flex items-center justify-center text-[#ff75a0]">
                      <ClipboardList size={20} />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#be80ff] uppercase tracking-wider">
                      Módulo 1
                    </span>
                  </div>
                  <div>
                    <h3 className="text-md font-black text-[#2d1822]">
                      Coleta Territorial ACS
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Checklist de 10 perguntas de campo.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleTriagemStart();
                    setActiveModal("triagem");
                  }}
                  className="bg-white border border-[#ffe3ec] p-6 rounded-2xl text-left hover:border-[#ff75a0] transition-all flex flex-col justify-between h-36 relative group cursor-pointer"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="w-10 h-10 rounded-xl bg-[#fff0f5] flex items-center justify-center text-[#ff75a0]">
                      <Search size={20} />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#be80ff] uppercase tracking-wider">
                      Módulo 2
                    </span>
                  </div>
                  <div>
                    <h3 className="text-md font-black text-[#2d1822]">
                      Triagem de Entrada
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Elegibilidade básica e IAEC-AD.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleEadClear();
                    setActiveModal("ead");
                  }}
                  className="bg-white border border-[#ffe3ec] p-6 rounded-2xl text-left hover:border-[#ff75a0] transition-all flex flex-col justify-between h-36 relative group cursor-pointer"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="w-10 h-10 rounded-xl bg-[#fff0f5] flex items-center justify-center text-[#ff75a0]">
                      <BarChart3 size={20} />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#be80ff] uppercase tracking-wider">
                      Módulo 3
                    </span>
                  </div>
                  <div>
                    <h3 className="text-md font-black text-[#2d1822]">
                      Escore EAD
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Pontuação de 7 domínios e Red Flags.
                    </p>
                  </div>
                </button>
              </div>

              {/* List & Patient History Container (Subtle & minimalist design) */}
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                id="pacientes-section"
              >
                {/* Pacientes cadastrados */}
                <div className="bg-white border border-[#ffeef4] rounded-2xl p-4 space-y-4 flex flex-col max-h-[600px]">
                  <div className="flex justify-between items-center pb-2 border-b border-[#fff0f5] shrink-0">
                    <h3 className="text-xs font-black uppercase text-[#ff75a0] tracking-wider">
                      Fichas de Pacientes
                    </h3>
                  </div>

                  <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
                    {pacientes.map((p) => {
                      const active = p.id === selectedPacienteId;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPacienteId(p.id)}
                          className={`p-3 rounded-xl cursor-pointer text-xs transition-all ${
                            active
                              ? "bg-[#fff0f6] font-bold text-[#ff75a0]"
                              : "hover:bg-[#fffbfc]"
                          }`}
                        >
                          <div className="flex justify-between">
                            <span>{p.nome}</span>
                            <span className="text-[10px] text-gray-400 font-normal">
                              {p.id}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Histórico do Paciente Selecionado */}
                <div className="md:col-span-2 bg-white border border-[#ffeef4] rounded-2xl p-6 space-y-6">
                  {activePaciente ? (
                    <>
                      <div className="flex justify-between items-start pb-4 border-b border-[#fff5f8]">
                        <div>
                          <p className="text-[11px] text-gray-400">
                            Prontuário: {activePaciente.prontuario} | Cadastro:{" "}
                            {activePaciente.dataCriacao}
                          </p>
                        </div>
                        <span className="text-[10px] font-black uppercase text-[#ff75a0] bg-[#fff0f5] px-2.5 py-1 rounded-md">
                          {activePaciente.statusProtocolo}
                        </span>
                      </div>

                      {/* Escore EAD */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-[#be80ff] uppercase tracking-wider">
                          Histórico Escore EAD
                        </h4>
                        {activePaciente.historicoEAD.length > 0 ? (
                          activePaciente.historicoEAD.map((ead, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-[#fffbfc] border border-[#fff5f8] rounded-xl text-xs flex justify-between items-center"
                            >
                              <div>
                                <span className="font-extrabold text-[#ff75a0]">
                                  {ead.classificacao}
                                </span>
                                <span className="text-[10px] text-gray-400 block mt-0.5">
                                  Visitas: {ead.freqGeral}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-sm">
                                  {ead.scoreTotal}/21
                                </span>
                                <span className="text-[9px] text-gray-400 block">
                                  {ead.dataAvaliacao}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400 italic">
                            Nenhum score EAD registrado.
                          </p>
                        )}
                      </div>

                      {/* Coletas ACS */}
                      <div className="space-y-3 pt-4 border-t border-[#fff5f8]">
                        <h4 className="text-[10px] font-black text-[#be80ff] uppercase tracking-wider">
                          Checklists ACS
                        </h4>
                        {activePaciente.historicoACS.length > 0 ? (
                          activePaciente.historicoACS.map((acs, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-[#fffbfc] border border-[#fff5f8] rounded-xl text-xs space-y-1"
                            >
                              <div className="flex justify-between font-bold">
                                <span>Coletor: {acs.acsNome || "ACS"}</span>
                                <span className="text-[10px] text-gray-400">
                                  {acs.dataColeta}
                                </span>
                              </div>
                              <p className="text-gray-500 text-[11px]">
                                {acs.abvd || "ABVD estável"}
                              </p>
                              {acs.alertaFinal === "Sim" && (
                                <p className="text-[10px] font-bold text-red-500">
                                  🚨 Alerta: {acs.alertaQual}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400 italic">
                            Nenhuma coleta do ACS registrada.
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 italic text-center py-12">
                      Selecione um paciente para ver o histórico.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* --- MODAL 1: ACS COLETA --- */}
      {/* ========================================================================= */}
      {activeModal === "acs" && (
        <div className="fixed inset-0 bg-[#2d1822]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-[#ffe3ec]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#ffeef4] flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-md font-black text-[#2d1822]">
                  Coleta Territorial (ACS)
                </h3>
                <p className="text-[11px] text-gray-400">
                  Preenchimento de dados pelo Agente Comunitário
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <form onSubmit={handleAcsSubmit} className="space-y-4">
                {/* Identificação */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-[#fff0f5]">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-[#ff75a0] block mb-1">
                      Paciente
                    </label>
                    <input
                      type="text"
                      required
                      value={acsForm.paciente}
                      onChange={(e) =>
                        setAcsForm({ ...acsForm, paciente: e.target.value })
                      }
                      placeholder="Nome do paciente"
                      className="w-full p-2 border border-[#ffd6e8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-[#ff75a0] block mb-1">
                      ACS Responsável
                    </label>
                    <input
                      type="text"
                      value={acsForm.acsNome}
                      onChange={(e) =>
                        setAcsForm({ ...acsForm, acsNome: e.target.value })
                      }
                      placeholder="Nome do ACS"
                      className="w-full p-2 border border-[#ffd6e8] rounded-lg"
                    />
                  </div>
                </div>

                {/* 1. Mobilidade */}
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold">1. Mobilidade</span>
                  <div className="flex gap-4">
                    {["Sim", "Não", "Só com ajuda"].map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="mobilidade"
                          checked={acsForm.mobilidade === opt}
                          onChange={() =>
                            setAcsForm({ ...acsForm, mobilidade: opt })
                          }
                          className="accent-[#ff75a0]"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. ABVD */}
                <div className="space-y-1">
                  <span className="font-bold block">2. Ajuda em ABVD</span>
                  <textarea
                    value={acsForm.abvd}
                    onChange={(e) =>
                      setAcsForm({ ...acsForm, abvd: e.target.value })
                    }
                    placeholder="Quais atividades precisa de ajuda..."
                    className="w-full p-2 border border-[#ffd6e8] rounded-lg h-12 resize-none"
                  />
                </div>

                {/* 3. Intercorrências */}
                <div className="space-y-2">
                  <span className="font-bold block">
                    3. Intercorrências nos últimos 30 dias
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acsForm.intercorrencias.naoTeve}
                      onChange={(e) =>
                        setAcsForm({
                          ...acsForm,
                          intercorrencias: {
                            naoTeve: e.target.checked,
                            upaVezes: 0,
                            hospVezes: 0,
                          },
                        })
                      }
                      className="accent-[#ff75a0]"
                    />
                    Não teve intercorrências
                  </label>
                  {!acsForm.intercorrencias.naoTeve && (
                    <div className="flex gap-3 pt-1">
                      <label>
                        UPA (Nº vezes):
                        <input
                          type="number"
                          value={acsForm.intercorrencias.upaVezes}
                          onChange={(e) =>
                            setAcsForm({
                              ...acsForm,
                              intercorrencias: {
                                ...acsForm.intercorrencias,
                                upaVezes: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-12 ml-1 p-1 border border-[#ffd6e8] rounded"
                        />
                      </label>
                      <label>
                        Internações (Nº vezes):
                        <input
                          type="number"
                          value={acsForm.intercorrencias.hospVezes}
                          onChange={(e) =>
                            setAcsForm({
                              ...acsForm,
                              intercorrencias: {
                                ...acsForm.intercorrencias,
                                hospVezes: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-12 ml-1 p-1 border border-[#ffd6e8] rounded"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* 4. Sintomas */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block mb-1">
                      4. Sintoma atual
                    </label>
                    <input
                      type="text"
                      value={acsForm.sintomas}
                      onChange={(e) =>
                        setAcsForm({ ...acsForm, sintomas: e.target.value })
                      }
                      placeholder="Ex: Dor"
                      className="w-full p-2 border border-[#ffd6e8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Frequência</label>
                    <input
                      type="text"
                      value={acsForm.sintomasFreq}
                      onChange={(e) =>
                        setAcsForm({ ...acsForm, sintomasFreq: e.target.value })
                      }
                      placeholder="Ex: Diário"
                      className="w-full p-2 border border-[#ffd6e8] rounded-lg"
                    />
                  </div>
                </div>

                {/* 5. Cuidados */}
                <div className="space-y-1">
                  <span className="font-bold block">5. Cuidados em casa</span>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "Curativo",
                      "Sonda",
                      "Ostomia",
                      "Oxigênio",
                      "Medicação",
                    ].map((cuid) => (
                      <label
                        key={cuid}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={acsForm.cuidados.includes(cuid)}
                          onChange={(e) => {
                            const list = e.target.checked
                              ? [...acsForm.cuidados, cuid]
                              : acsForm.cuidados.filter((c) => c !== cuid);
                            setAcsForm({ ...acsForm, cuidados: list });
                          }}
                          className="accent-[#ff75a0]"
                        />
                        {cuid}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 7. Medicamento Alterado */}
                <div className="flex justify-between items-center">
                  <span className="font-bold">
                    7. Medicamento alterado recentemente?
                  </span>
                  <div className="flex gap-4">
                    {["Sim", "Não"].map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="medAlterado"
                          checked={acsForm.medAlterado === opt}
                          onChange={() =>
                            setAcsForm({ ...acsForm, medAlterado: opt })
                          }
                          className="accent-[#ff75a0]"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 8. Cuidador */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block mb-1">
                      8. Cuidador Principal
                    </label>
                    <input
                      type="text"
                      value={acsForm.cuidadorNome}
                      onChange={(e) =>
                        setAcsForm({ ...acsForm, cuidadorNome: e.target.value })
                      }
                      placeholder="Nome do cuidador"
                      className="w-full p-2 border border-[#ffd6e8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Status</label>
                    <select
                      value={acsForm.cuidadorStatus}
                      onChange={(e) =>
                        setAcsForm({
                          ...acsForm,
                          cuidadorStatus: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-[#ffd6e8] rounded-lg bg-white"
                    >
                      <option value="">Selecione...</option>
                      <option value="Adequado">Adequado</option>
                      <option value="Com dificuldade">Com dificuldade</option>
                    </select>
                  </div>
                </div>

                {/* Alerta Urgência */}
                <div className="p-3 bg-red-50 text-red-950 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-red-700">
                      🚨 Necessita avaliação urgente?
                    </span>
                    <div className="flex gap-3 font-semibold">
                      {["Sim", "Não"].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="alertaFinal"
                            checked={acsForm.alertaFinal === opt}
                            onChange={() =>
                              setAcsForm({ ...acsForm, alertaFinal: opt })
                            }
                            className="accent-red-500"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                  {acsForm.alertaFinal === "Sim" && (
                    <input
                      type="text"
                      required
                      placeholder="Sinalize o motivo da urgência..."
                      value={acsForm.alertaQual}
                      onChange={(e) =>
                        setAcsForm({ ...acsForm, alertaQual: e.target.value })
                      }
                      className="w-full p-1.5 border border-red-200 bg-white rounded text-red-700 font-semibold focus:outline-none"
                    />
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 p-3 bg-[#ff75a0] text-white rounded-xl font-bold hover:bg-[#ff5287]"
                  >
                    Salvar Coleta ACS
                  </button>
                </div>
              </form>

              {/* Resumo formatado gerado */}
              {acsResumo && (
                <div className="bg-emerald-50 text-emerald-900 p-4 border border-emerald-100 rounded-xl space-y-2">
                  <h4 className="font-extrabold">
                    Resumo formatado (copie para o e-SUS):
                  </h4>
                  <pre className="text-[10px] bg-white p-3 rounded border border-emerald-100 whitespace-pre-wrap font-mono">
                    {acsResumo}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL 2: TRIAGEM --- */}
      {/* ========================================================================= */}
      {activeModal === "triagem" && (
        <div className="fixed inset-0 bg-[#2d1822]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col border border-[#ffe3ec]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#ffeef4] flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-md font-black text-[#2d1822]">
                  Triagem de Elegibilidade
                </h3>
                <p className="text-[11px] text-gray-400">
                  Fluxo regulatório para SAD / UBS
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Wizard steps wrapper */}
              {triagemStep === 0 && (
                <div className="space-y-4">
                  <p className="text-gray-500 leading-normal">
                    Determine a elegibilidade do paciente seguindo o roteiro do
                    SUS: filtros preliminares de infraestrutura/consentimento,
                    triagem direta de procedimentos especiais, e por fim o
                    IAEC-AD.
                  </p>
                  <button
                    onClick={handleTriagemStart}
                    className="w-full p-3 bg-[#ff75a0] text-white rounded-xl font-bold hover:bg-[#ff5287]"
                  >
                    Iniciar Triagem
                  </button>
                </div>
              )}

              {/* Filtros Q1 */}
              {triagemStep >= 1 && triagemStep <= 5 && (
                <div className="space-y-4">
                  <span className="text-[9px] uppercase font-bold text-[#be80ff]">
                    Filtros ({triagemFilterIdx + 1}/5)
                  </span>
                  <h4 className="text-sm font-extrabold text-[#2d1822]">
                    {Q1[triagemFilterIdx].label}
                  </h4>
                  <p className="text-gray-400 text-[11px]">
                    {Q1[triagemFilterIdx].help}
                  </p>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleFilterClick(true)}
                      className="flex-1 p-3 bg-emerald-50 text-emerald-800 rounded-xl font-bold border border-emerald-100 hover:bg-emerald-100"
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => handleFilterClick(false)}
                      className="flex-1 p-3 bg-rose-50 text-rose-800 rounded-xl font-bold border border-rose-100 hover:bg-rose-100"
                    >
                      Não
                    </button>
                  </div>
                </div>
              )}

              {/* Parada (Stop) */}
              {triagemStep === -1 && (
                <div className="space-y-4 text-center">
                  <div className="text-red-500 font-extrabold">
                    🚨 Inelegível para a modalidade proposta
                  </div>
                  <p className="p-3 bg-red-50 border border-red-100 text-red-900 rounded-xl">
                    {Q1[triagemFilterIdx]?.stop}
                  </p>
                  <div className="font-bold text-xs">
                    Ação Recomendada:{" "}
                    <span className="text-[#ff75a0]">
                      {Q1[triagemFilterIdx]?.action}
                    </span>
                  </div>
                  <button
                    onClick={handleTriagemStart}
                    className="w-full p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold"
                  >
                    Reiniciar
                  </button>
                </div>
              )}

              {/* Alta Complexidade */}
              {triagemStep === 6 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-[#2d1822]">
                    Procedimentos de Alta Complexidade Domiciliar?
                  </h4>
                  <div className="space-y-1.5">
                    {ALTA_ITEMS.map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2 p-2.5 bg-[#fffbfc] border border-[#fff0f5] rounded-xl cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={triagemForm.alta[item.key] || false}
                          onChange={(e) =>
                            setTriagemForm({
                              ...triagemForm,
                              alta: {
                                ...triagemForm.alta,
                                [item.key]: e.target.checked,
                              },
                            })
                          }
                          className="accent-[#ff75a0]"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={handleAltaSubmit}
                    className="w-full p-3 bg-[#ff75a0] text-white rounded-xl font-bold"
                  >
                    Confirmar e Avançar
                  </button>
                </div>
              )}

              {/* Média Complexidade */}
              {triagemStep === 7 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-[#2d1822]">
                    Cuidados de Média Complexidade?
                  </h4>
                  <div className="space-y-1.5">
                    {MEDIA_ITEMS.map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2 p-2.5 bg-[#fffbfc] border border-[#fff0f5] rounded-xl cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={triagemForm.media[item.key] || false}
                          onChange={(e) =>
                            setTriagemForm({
                              ...triagemForm,
                              media: {
                                ...triagemForm.media,
                                [item.key]: e.target.checked,
                              },
                            })
                          }
                          className="accent-[#ff75a0]"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={handleMediaSubmit}
                    className="w-full p-3 bg-[#ff75a0] text-white rounded-xl font-bold"
                  >
                    Confirmar e Avançar
                  </button>
                </div>
              )}

              {/* IAEC-AD Questions */}
              {triagemStep === 8 && (
                <div className="space-y-4">
                  {(() => {
                    const seq: IAECItem[] = getIAECSequence();
                    const item = seq[triagemIAECIdx];

                    if (!item) return null;

                    return (
                      <>
                        <span className="text-[9px] uppercase font-bold text-[#be80ff]">
                          IAEC-AD ({triagemIAECIdx + 1}/{seq.length})
                        </span>

                        <h4 className="text-sm font-extrabold text-[#2d1822]">
                          {item.title}
                        </h4>

                        <div className="space-y-1.5 pt-1">
                          {item.opts.map((opt) => (
                            <button
                              key={opt.v.toString()}
                              type="button"
                              onClick={() => handleIAECClick(opt.v)}
                              className="w-full flex justify-between p-3 border border-[#ffeef4] bg-white rounded-xl text-left font-bold"
                            >
                              <span>{opt.l}</span>

                              {typeof opt.v === "number" && (
                                <span className="text-[#ff75a0]">
                                  {opt.v} pts
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
              {triagemStep === 9 && (
                <div className="space-y-4 text-center">
                  <div className="inline-block p-4 border border-[#ff75a0] rounded-xl bg-[#fffafc]">
                    <span className="text-[9px] uppercase text-[#ff75a0] font-black block">
                      Classificação Obtida
                    </span>
                    <span className="text-3xl font-black text-[#ff75a0] block">
                      {triagemForm.classificacaoFinal}
                    </span>
                  </div>

                  <div className="p-3 bg-[#fffbfc] border border-[#ffeef4] rounded-xl text-left space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Serviço:</span>
                      <span className="font-extrabold">
                        {triagemForm.servicoResponsavel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Frequência:</span>
                      <span className="font-extrabold text-[#ff75a0]">
                        {triagemForm.frequenciaRecomendada}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleTriagemStart}
                    className="w-full p-2.5 bg-[#ff75a0] text-white rounded-xl font-bold"
                  >
                    Nova Triagem
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL 3: ESCORE EAD --- */}
      {/* ========================================================================= */}
      {activeModal === "ead" && (
        <div className="fixed inset-0 bg-[#2d1822]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-[#ffe3ec]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#ffeef4] flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-md font-black text-[#2d1822]">
                  Escore EAD
                </h3>
                <p className="text-[11px] text-gray-400">
                  Estratificação clínica de 7 domínios
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <form onSubmit={handleEadSubmit} className="space-y-4">
                {/* Identificação */}
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#fff0f5]">
                  <div>
                    <label className="text-[9px] font-black uppercase text-[#ff75a0] block mb-0.5">
                      Escore Anterior
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="21"
                      value={eadForm.pontuacaoAnterior}
                      onChange={(e) =>
                        setEadForm({
                          ...eadForm,
                          pontuacaoAnterior:
                            e.target.value === ""
                              ? ""
                              : parseInt(e.target.value),
                        })
                      }
                      placeholder="Opcional (0-21)"
                      className="w-full p-2 border border-[#ffd6e8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-[#ff75a0] block mb-0.5">
                      Profissional
                    </label>
                    <input
                      type="text"
                      value={eadForm.profissional}
                      onChange={(e) =>
                        setEadForm({ ...eadForm, profissional: e.target.value })
                      }
                      placeholder="Seu nome"
                      className="w-full p-2 border border-[#ffd6e8] rounded-lg"
                    />
                  </div>
                </div>

                {/* 7 Domínios */}
                <div className="space-y-4">
                  {EAD_DOMAINS.map((dom) => (
                    <div key={dom.id} className="space-y-2">
                      <h4 className="font-extrabold text-[#2d1822] flex items-center gap-1.5">
                        <span>{dom.icon}</span>
                        {dom.title}
                      </h4>
                      <p className="text-[10px] text-gray-400">{dom.note}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {dom.options.map((opt) => (
                          <label
                            key={opt.v}
                            className={`flex items-start gap-2 p-2 border rounded-xl cursor-pointer ${
                              eadForm.valores[
                                dom.id as keyof typeof eadForm.valores
                              ] === opt.v
                                ? "border-[#ff75a0] bg-[#fff5f8] font-bold"
                                : "border-[#ffd6e8] hover:bg-[#fffdfd]"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`ead_${dom.id}`}
                              checked={
                                eadForm.valores[
                                  dom.id as keyof typeof eadForm.valores
                                ] === opt.v
                              }
                              onChange={() =>
                                setEadForm({
                                  ...eadForm,
                                  valores: {
                                    ...eadForm.valores,
                                    [dom.id]: opt.v,
                                  },
                                })
                              }
                              className="accent-[#ff75a0] mt-0.5"
                            />
                            <span className="text-[11px] leading-tight">
                              <strong className="text-[#ff75a0] mr-1">
                                ({opt.v} pt)
                              </strong>
                              {opt.t}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full p-3 bg-[#ff75a0] text-white font-bold rounded-xl hover:bg-[#ff5287]"
                >
                  Calcular Escore
                </button>
              </form>

              {/* Resultado EAD */}
              {eadResultado && (
                <div className="p-4 bg-[#fffafc] border border-[#ff75a0] rounded-2xl space-y-3">
                  <div className="text-center">
                    <span className="text-[10px] font-black uppercase text-[#ff75a0] block">
                      Score Total
                    </span>
                    <span className="text-3xl font-black text-[#ff75a0]">
                      {eadResultado.scoreTotal}/21
                    </span>
                    <span className="text-xs font-extrabold uppercase text-[#be80ff] block mt-0.5">
                      {eadResultado.classificacao}
                    </span>
                  </div>

                  <div className="text-[11px] space-y-1 border-t border-[#ffeef4] pt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Freq. Geral:</span>
                      <span className="font-extrabold">
                        {eadResultado.freqGeral}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Enfermagem:</span>
                      <span className="font-bold">{eadResultado.freqEnf}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Médico:</span>
                      <span className="font-bold">{eadResultado.freqMed}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
