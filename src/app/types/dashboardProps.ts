

import { Paciente } from "./triagens";

export interface DashboardProps {
  pacientes: Paciente[];
  selectedPacienteId: string;
  setSelectedPacienteId: (id: string) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  handleAcsClear: () => void;
  handleTriagemStart: () => void;
  handleEadClear: () => void;
  activePaciente?: Paciente;
  setEadForm: React.Dispatch<React.SetStateAction<any>>;
  setAcsForm: React.Dispatch<React.SetStateAction<any>>;
  setShowGuidelines: React.Dispatch<React.SetStateAction<boolean>>;
}
