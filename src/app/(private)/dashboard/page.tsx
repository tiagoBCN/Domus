"use client";

import { useState } from "react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Dashboard } from "../../components/Dashboard";
import {
  ChevronRight,
  X,
} from "lucide-react";
import { ACSData, EADData, Paciente, TriagemData } from "../../types/triagens";


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
  const [showGuidelines, setShowGuidelines] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // --- VIA ÚNICA: DADOS DA SESSÃO ATUAL ---
  const [showViaUnicaModal, setShowViaUnicaModal] = useState<boolean>(false);
  const [viaUnicaStep, setViaUnicaStep] = useState<number>(0);
  const [pacienteNome, setPacienteNome] = useState<string>("");
  const [pacienteProntuario, setPacienteProntuario] = useState<string>("");

  const [lastSessionData, setLastSessionData] = useState<{
    pacienteNome: string;
    prontuario: string;
    acsData?: ACSData;
    triagemData?: TriagemData;
    eadData?: EADData;
  } | null>(null);

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

  // --- HANDLERS DA VIA ÚNICA ---
  const handleStartViaUnica = () => {
    setViaUnicaStep(0);
    setShowViaUnicaModal(true);
  };

  const handleOpenModule = (module: 'acs' | 'triagem' | 'ead') => {
    if (module === 'acs') setViaUnicaStep(1);
    else if (module === 'triagem') setViaUnicaStep(2);
    else if (module === 'ead') setViaUnicaStep(3);
    setShowViaUnicaModal(true);
  };

  const handleAccessFichas = () => {
    setShowGuidelines(false);
    setTimeout(() => {
      document.getElementById('pacientes-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // --- SUBMISSIONS E LÓGICA DE TRIAGEM ---
  const handleAcsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nome = pacienteNome || acsForm.paciente;
    if (!nome) return;

    const obsText =
      acsForm.observacoes.length > 0
        ? acsForm.observacoes.join(", ")
        : "Nenhuma";
    const cuidadosText =
      acsForm.cuidados.length > 0 ? acsForm.cuidados.join(", ") : "Nenhum";

    const resumo = `Paciente: ${nome} | Data: ${acsForm.dataColeta} | ACS: ${acsForm.acsNome}
Mobilidade: ${acsForm.mobilidade}
Intercorrências: ${acsForm.intercorrencias.naoTeve ? "Não" : `UPA: ${acsForm.intercorrencias.upaVezes}x, Hosp: ${acsForm.intercorrencias.hospVezes}x`}
Sintomas: ${acsForm.sintomas || "Nenhum"} (${acsForm.sintomasFreq || "—"})
Cuidados: ${cuidadosText} ${acsForm.cuidadosOutro ? `(${acsForm.cuidadosOutro})` : ""}
Dispositivos: ${acsForm.dispositivos || "Nenhum"}
Medicamento Alterado: ${acsForm.medAlterado} ${acsForm.medQual ? `(${acsForm.medQual})` : ""}
Cuidador: ${acsForm.cuidadorNome} (${acsForm.cuidadorStatus})
Alerta Urgência: ${acsForm.alertaFinal} ${acsForm.alertaQual ? `(${acsForm.alertaQual})` : ""}`;

    setAcsResumo(resumo);
    setViaUnicaStep(2); // Avança para Módulo 2
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
        ? "Visita prioritária em até 7 dias para plano de cuidados"
        : band.enf,
      freqMed: hasRedFlag
        ? "Avaliação médica prioritária para estabilização clínica"
        : band.med,
    };

    setEadResultado(resultado);
    setViaUnicaStep(4); // Avança para o Resumo Consolidado

    // Salva na sessão atual
    setLastSessionData({
      pacienteNome: pacienteNome || "Paciente em Atendimento",
      prontuario: pacienteProntuario || "—",
      acsData: acsForm,
      triagemData: triagemForm,
      eadData: resultado,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#09090b] flex font-sans">
      <Sidebar
        showGuidelines={showGuidelines}
        setShowGuidelines={setShowGuidelines}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onStartViaUnica={handleStartViaUnica}
        onAccessFichas={handleAccessFichas}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          showGuidelines={showGuidelines}
          setShowGuidelines={setShowGuidelines}
          onStartViaUnica={handleStartViaUnica}
          activePacienteNome={pacienteNome || undefined}
        />

        {/* --- CONTEÚDO PRINCIPAL --- */}
        <main className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8 overflow-y-auto">
          {showGuidelines ? (
            /* --- DIRETRIZES SCREEN --- */
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-black text-zinc-900">
                  Diretrizes de Elegibilidade e Protocolo SUS
                </h2>
                <p className="text-xs text-zinc-500">
                  Documento de suporte clínico rápido da Atenção Domiciliar.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                <div className="space-y-2 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <h3 className="font-extrabold text-zinc-900 uppercase">
                    ACS (Agente Comunitário de Saúde)
                  </h3>
                  <p className="text-zinc-600">
                    O ACS faz o levantamento de campo. Coleta as informações
                    estruturadas no Módulo 1 e repassa à equipe ESF para cálculo
                    e estratificação do Escore EAD.
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <h3 className="font-extrabold text-zinc-900 uppercase">
                    Fluxo de Encaminhamento ao SAD
                  </h3>
                  <p className="text-zinc-600">
                    Caso o paciente pontue na triagem direta por média ou alta
                    complexidade assistencial, gera-se o parecer de transferência
                    de modalidade para AD2/AD3 no SAD (Melhor em Casa).
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* --- DASHBOARD PRINCIPAL --- */
            <Dashboard
              onStartViaUnica={handleStartViaUnica}
              onOpenModule={handleOpenModule}
              lastSessionData={lastSessionData}
            />
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* --- WIZARD UNIFICADO: VIA ÚNICA DE TRIAGEM --- */}
      {/* ========================================================================= */}
      {showViaUnicaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-zinc-200 shadow-2xl">
            {/* Header do Modal com Abas do Wizard */}
            <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex flex-col gap-3 shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-black text-zinc-900">
                    Via Única de Triagem Domus.ai
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Atendimento Clínico Integrado (Passo {viaUnicaStep + 1} de 5)
                  </p>
                </div>
                <button
                  onClick={() => setShowViaUnicaModal(false)}
                  className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Steps Navigator Bar */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[
                  { step: 0, label: "Identificação" },
                  { step: 1, label: "Módulo 1: ACS" },
                  { step: 2, label: "Módulo 2: Entrada" },
                  { step: 3, label: "Módulo 3: EAD" },
                  { step: 4, label: "Resumo Consolidado" },
                ].map((s) => {
                  const active = viaUnicaStep === s.step;
                  const completed = viaUnicaStep > s.step;
                  return (
                    <button
                      key={s.step}
                      onClick={() => setViaUnicaStep(s.step)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-extrabold truncate transition-all text-center ${
                        active
                          ? "bg-zinc-900 text-white shadow-sm"
                          : completed
                          ? "bg-zinc-200 text-zinc-800"
                          : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conteúdo das Etapas do Wizard */}
            <div className="p-6 overflow-y-auto flex-1 text-xs text-zinc-800 space-y-4">
              {/* ETAPA 0: DADOS DO PACIENTE */}
              {viaUnicaStep === 0 && (
                <div className="space-y-6 max-w-lg mx-auto py-4">
                  <div className="text-center space-y-1">
                    <h4 className="text-base font-black text-zinc-900">
                      Identificação do Paciente
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Insira o nome e dados do atendimento para iniciar os 3 módulos.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-extrabold uppercase text-zinc-700 block mb-1">
                        Nome do Paciente *
                      </label>
                      <input
                        type="text"
                        required
                        value={pacienteNome}
                        onChange={(e) => {
                          setPacienteNome(e.target.value);
                          setAcsForm((prev) => ({ ...prev, paciente: e.target.value }));
                        }}
                        placeholder="Ex: Maria das Dores da Silva"
                        className="w-full p-3 border border-zinc-300 rounded-xl text-sm font-semibold focus:border-zinc-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold uppercase text-zinc-700 block mb-1">
                        Prontuário / Documento
                      </label>
                      <input
                        type="text"
                        value={pacienteProntuario}
                        onChange={(e) => setPacienteProntuario(e.target.value)}
                        placeholder="Ex: PRON-84920 / CPF"
                        className="w-full p-3 border border-zinc-300 rounded-xl text-sm focus:border-zinc-900 focus:outline-none"
                      />
                    </div>

                    <button
                      disabled={!pacienteNome.trim()}
                      onClick={() => setViaUnicaStep(1)}
                      className="w-full p-4 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-sm mt-4 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Avançar para Módulo 1 (ACS)</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ETAPA 1: MÓDULO 1 (ACS COLETA) */}
              {viaUnicaStep === 1 && (
                <form onSubmit={handleAcsSubmit} className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                    <h4 className="font-extrabold text-zinc-900 text-sm">
                      Coleta Territorial — Agente Comunitário (ACS)
                    </h4>
                    <span className="text-[11px] font-bold text-zinc-500">
                      Paciente: {pacienteNome || "Não identificado"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-zinc-900 block mb-1">
                        ACS Responsável
                      </label>
                      <input
                        type="text"
                        value={acsForm.acsNome}
                        onChange={(e) =>
                          setAcsForm({ ...acsForm, acsNome: e.target.value })
                        }
                        placeholder="Nome do Agente"
                        className="w-full p-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-zinc-900 block mb-1">
                        1. Mobilidade
                      </label>
                      <select
                        value={acsForm.mobilidade}
                        onChange={(e) =>
                          setAcsForm({ ...acsForm, mobilidade: e.target.value })
                        }
                        className="w-full p-2 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:border-zinc-900"
                      >
                        <option value="">Selecione...</option>
                        <option value="Sim">Sim (Independente)</option>
                        <option value="Não">Não (Acamado)</option>
                        <option value="Só com ajuda">Só com ajuda</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-900 block">2. Ajuda em ABVD</label>
                    <input
                      type="text"
                      value={acsForm.abvd}
                      onChange={(e) =>
                        setAcsForm({ ...acsForm, abvd: e.target.value })
                      }
                      placeholder="Atividades básicas que precisa de apoio..."
                      className="w-full p-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-zinc-900 block mb-1">3. Sintoma Atual</label>
                      <input
                        type="text"
                        value={acsForm.sintomas}
                        onChange={(e) =>
                          setAcsForm({ ...acsForm, sintomas: e.target.value })
                        }
                        placeholder="Ex: Dor, Dispneia"
                        className="w-full p-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-zinc-900 block mb-1">Frequência</label>
                      <input
                        type="text"
                        value={acsForm.sintomasFreq}
                        onChange={(e) =>
                          setAcsForm({ ...acsForm, sintomasFreq: e.target.value })
                        }
                        placeholder="Ex: Diário"
                        className="w-full p-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-red-50 text-red-950 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-red-700">
                        🚨 Urgência sinalizada?
                      </span>
                      <div className="flex gap-3 font-semibold">
                        {["Sim", "Não"].map((opt) => (
                          <label key={opt} className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name="alertaFinal"
                              checked={acsForm.alertaFinal === opt}
                              onChange={() => setAcsForm({ ...acsForm, alertaFinal: opt })}
                              className="accent-red-600"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                    {acsForm.alertaFinal === "Sim" && (
                      <input
                        type="text"
                        placeholder="Motivo da urgência..."
                        value={acsForm.alertaQual}
                        onChange={(e) => setAcsForm({ ...acsForm, alertaQual: e.target.value })}
                        className="w-full p-2 border border-red-200 rounded bg-white text-red-700 font-semibold"
                      />
                    )}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setViaUnicaStep(0)}
                      className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 rounded-xl font-bold text-zinc-700 cursor-pointer"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 cursor-pointer"
                    >
                      Salvar e Avançar para Módulo 2 (Triagem)
                    </button>
                  </div>
                </form>
              )}

              {/* ETAPA 2: MÓDULO 2 (TRIAGEM ELEGIBILIDADE) */}
              {viaUnicaStep === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                    <h4 className="font-extrabold text-zinc-900 text-sm">
                      Módulo 2: Triagem de Elegibilidade e IAEC-AD
                    </h4>
                    <span className="text-[11px] font-bold text-zinc-500">
                      Paciente: {pacienteNome || "Não identificado"}
                    </span>
                  </div>

                  {triagemStep === 0 && (
                    <div className="space-y-4 text-center py-4">
                      <p className="text-zinc-600 max-w-md mx-auto">
                        Inicie os questionamentos regulatórios do SUS para definir a elegibilidade (AD1, AD2 ou AD3).
                      </p>
                      <button
                        onClick={handleTriagemStart}
                        className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 shadow-sm cursor-pointer"
                      >
                        Iniciar Perguntas da Triagem
                      </button>
                    </div>
                  )}

                  {triagemStep >= 1 && triagemStep <= 5 && (
                    <div className="space-y-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                      <span className="text-[10px] uppercase font-bold text-zinc-500">
                        Filtro ({triagemFilterIdx + 1}/5)
                      </span>
                      <h5 className="text-sm font-extrabold text-zinc-900">
                        {Q1[triagemFilterIdx].label}
                      </h5>
                      <p className="text-zinc-500 text-[11px]">
                        {Q1[triagemFilterIdx].help}
                      </p>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleFilterClick(true)}
                          className="flex-1 p-3 bg-emerald-50 text-emerald-800 rounded-xl font-bold border border-emerald-100 hover:bg-emerald-100 cursor-pointer"
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => handleFilterClick(false)}
                          className="flex-1 p-3 bg-rose-50 text-rose-800 rounded-xl font-bold border border-rose-100 hover:bg-rose-100 cursor-pointer"
                        >
                          Não
                        </button>
                      </div>
                    </div>
                  )}

                  {triagemStep === -1 && (
                    <div className="space-y-4 text-center p-4 bg-red-50 text-red-900 rounded-2xl border border-red-200">
                      <div className="font-extrabold">🚨 Inelegível para AD</div>
                      <p>{Q1[triagemFilterIdx]?.stop}</p>
                      <button
                        onClick={handleTriagemStart}
                        className="px-4 py-2 bg-zinc-900 text-white rounded-lg font-bold cursor-pointer"
                      >
                        Reiniciar Triagem
                      </button>
                    </div>
                  )}

                  {triagemStep === 6 && (
                    <div className="space-y-4">
                      <h5 className="font-extrabold text-zinc-900">Procedimentos de Alta Complexidade Domiciliar?</h5>
                      <div className="space-y-1.5">
                        {ALTA_ITEMS.map((item) => (
                          <label key={item.key} className="flex items-center gap-2 p-2 bg-zinc-50 rounded-xl border border-zinc-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={triagemForm.alta[item.key] || false}
                              onChange={(e) => setTriagemForm({ ...triagemForm, alta: { ...triagemForm.alta, [item.key]: e.target.checked } })}
                              className="accent-zinc-900"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                      <button onClick={handleAltaSubmit} className="w-full p-3 bg-zinc-900 text-white rounded-xl font-bold cursor-pointer">
                        Confirmar e Avançar
                      </button>
                    </div>
                  )}

                  {triagemStep === 7 && (
                    <div className="space-y-4">
                      <h5 className="font-extrabold text-zinc-900">Cuidados de Média Complexidade?</h5>
                      <div className="space-y-1.5">
                        {MEDIA_ITEMS.map((item) => (
                          <label key={item.key} className="flex items-center gap-2 p-2 bg-zinc-50 rounded-xl border border-zinc-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={triagemForm.media[item.key] || false}
                              onChange={(e) => setTriagemForm({ ...triagemForm, media: { ...triagemForm.media, [item.key]: e.target.checked } })}
                              className="accent-zinc-900"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                      <button onClick={handleMediaSubmit} className="w-full p-3 bg-zinc-900 text-white rounded-xl font-bold cursor-pointer">
                        Confirmar e Avançar
                      </button>
                    </div>
                  )}

                  {triagemStep === 8 && (
                    <div className="space-y-4">
                      {(() => {
                        const seq: IAECItem[] = getIAECSequence();
                        const item = seq[triagemIAECIdx];
                        if (!item) return null;
                        return (
                          <>
                            <span className="text-[10px] uppercase font-bold text-zinc-500">IAEC-AD ({triagemIAECIdx + 1}/{seq.length})</span>
                            <h5 className="font-extrabold text-zinc-900">{item.title}</h5>
                            <div className="space-y-1.5">
                              {item.opts.map((opt) => (
                                <button
                                  key={opt.v.toString()}
                                  type="button"
                                  onClick={() => handleIAECClick(opt.v)}
                                  className="w-full flex justify-between p-3 border border-zinc-200 bg-white hover:bg-zinc-100 rounded-xl font-bold cursor-pointer"
                                >
                                  <span>{opt.l}</span>
                                  {typeof opt.v === "number" && <span>{opt.v} pts</span>}
                                </button>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {triagemStep === 9 && (
                    <div className="space-y-4 text-center p-4 bg-zinc-100 border border-zinc-900 rounded-2xl">
                      <span className="text-[10px] font-black uppercase text-zinc-500 block">Classificação de Elegibilidade</span>
                      <span className="text-3xl font-black text-zinc-900 block">{triagemForm.classificacaoFinal}</span>
                      <p className="text-xs font-bold text-zinc-700">{triagemForm.servicoResponsavel} — {triagemForm.frequenciaRecomendada}</p>
                      
                      <button
                        onClick={() => setViaUnicaStep(3)}
                        className="w-full p-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 shadow-sm cursor-pointer"
                      >
                        Avançar para Módulo 3 (Escore EAD)
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setViaUnicaStep(1)}
                      className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-xl font-bold cursor-pointer"
                    >
                      Voltar ao Módulo 1
                    </button>
                  </div>
                </div>
              )}

              {/* ETAPA 3: MÓDULO 3 (ESCORE EAD) */}
              {viaUnicaStep === 3 && (
                <form onSubmit={handleEadSubmit} className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                    <h4 className="font-extrabold text-zinc-900 text-sm">
                      Módulo 3: Estratificação EAD (7 Domínios)
                    </h4>
                    <span className="text-[11px] font-bold text-zinc-500">
                      Paciente: {pacienteNome || "Não identificado"}
                    </span>
                  </div>

                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                    {EAD_DOMAINS.map((dom) => (
                      <div key={dom.id} className="space-y-2 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl">
                        <h5 className="font-extrabold text-zinc-900 flex items-center gap-1.5">
                          <span>{dom.icon}</span>
                          {dom.title}
                        </h5>
                        <p className="text-[10px] text-zinc-500">{dom.note}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {dom.options.map((opt) => (
                            <label
                              key={opt.v}
                              className={`flex items-start gap-2 p-2 border rounded-xl cursor-pointer ${
                                eadForm.valores[dom.id as keyof typeof eadForm.valores] === opt.v
                                  ? "border-zinc-900 bg-zinc-100 font-bold text-zinc-900"
                                  : "border-zinc-200 hover:bg-white text-zinc-700"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`ead_${dom.id}`}
                                checked={eadForm.valores[dom.id as keyof typeof eadForm.valores] === opt.v}
                                onChange={() =>
                                  setEadForm({
                                    ...eadForm,
                                    valores: { ...eadForm.valores, [dom.id]: opt.v },
                                  })
                                }
                                className="accent-zinc-900 mt-0.5"
                              />
                              <span className="text-[11px] leading-tight">
                                <strong className="text-zinc-900 mr-1">({opt.v} pt)</strong>
                                {opt.t}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setViaUnicaStep(2)}
                      className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 rounded-xl font-bold text-zinc-700 cursor-pointer"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 shadow-sm cursor-pointer"
                    >
                      Calcular e Ver Resumo Consolidado
                    </button>
                  </div>
                </form>
              )}

              {/* ETAPA 4: RESUMO CONSOLIDADO FINAL DA VIA ÚNICA */}
              {viaUnicaStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <h4 className="text-lg font-black text-zinc-900">
                      Relatório Consolidado da Avaliação Domiciliar
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Resumo da triagem para prontuário e-SUS
                    </p>
                  </div>

                  {/* Ficha Resumo */}
                  <div className="p-6 bg-zinc-50 border border-zinc-900 rounded-3xl space-y-4 font-mono text-[11px]">
                    <div className="flex justify-between items-start border-b border-zinc-200 pb-3">
                      <div>
                        <span className="font-bold text-zinc-900 text-sm block">{pacienteNome || "Paciente"}</span>
                        <span className="text-zinc-500">Prontuário/CPF: {pacienteProntuario || "—"}</span>
                      </div>
                      <span className="px-3 py-1 bg-zinc-900 text-white font-extrabold text-[10px] rounded-full uppercase">
                        Concluído
                      </span>
                    </div>

                    {/* Módulo 2 Result */}
                    {triagemForm.classificacaoFinal && (
                      <div className="space-y-1 border-b border-zinc-200 pb-3">
                        <span className="font-extrabold text-zinc-900 block">MÓDULO 2 (ELEGIBILIDADE):</span>
                        <p>Classificação: <strong>{triagemForm.classificacaoFinal}</strong> ({triagemForm.servicoResponsavel})</p>
                        <p>Frequência Recomendada: {triagemForm.frequenciaRecomendada}</p>
                      </div>
                    )}

                    {/* Módulo 3 Result */}
                    {eadResultado && (
                      <div className="space-y-1 border-b border-zinc-200 pb-3">
                        <span className="font-extrabold text-zinc-900 block">MÓDULO 3 (ESCORE EAD):</span>
                        <p>Pontuação Total: <strong>{eadResultado.scoreTotal}/21 pts</strong> ({eadResultado.classificacao})</p>
                        <p>Periodicidade Médica: {eadResultado.freqMed}</p>
                        <p>Periodicidade Enfermagem: {eadResultado.freqEnf}</p>
                      </div>
                    )}

                    {/* Módulo 1 Result */}
                    {acsResumo && (
                      <div className="space-y-1">
                        <span className="font-extrabold text-zinc-900 block">MÓDULO 1 (DADOS ACS):</span>
                        <p className="whitespace-pre-wrap text-[10px] text-zinc-700">{acsResumo}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => {
                        const content = `AVALIAÇÃO DOMUS.AI VIA ÚNICA
Paciente: ${pacienteNome} (Prontuário: ${pacienteProntuario})
Triagem: ${triagemForm.classificacaoFinal} (${triagemForm.servicoResponsavel})
Escore EAD: ${eadResultado?.scoreTotal}/21 pts - ${eadResultado?.classificacao}
ACS: ${acsResumo}`;
                        navigator.clipboard.writeText(content);
                        alert("Resumo formatado copiado para a área de transferência!");
                      }}
                      className="flex-1 p-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 font-bold text-zinc-900 rounded-xl cursor-pointer"
                    >
                      Copiar Resumo e-SUS
                    </button>

                    <button
                      onClick={() => {
                        setShowViaUnicaModal(false);
                        setPacienteNome("");
                        setPacienteProntuario("");
                      }}
                      className="flex-1 p-3 bg-zinc-900 hover:bg-zinc-800 font-bold text-white rounded-xl shadow-sm cursor-pointer"
                    >
                      Concluir Atendimento
                    </button>
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
