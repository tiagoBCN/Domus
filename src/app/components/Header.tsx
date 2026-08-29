import React from "react";
import { BarChart3 } from "lucide-react";

import type {
  Paciente,
  EADData,
  ACSData,
} from "../types/triagens";

interface HeaderProps {
  showGuidelines: boolean;
  setShowGuidelines: React.Dispatch<React.SetStateAction<boolean>>;

  pacientes: Paciente[];

  selectedPacienteId: string;
  setSelectedPacienteId: React.Dispatch<React.SetStateAction<string>>;

  setEadForm: React.Dispatch<React.SetStateAction<EADData>>;
  setAcsForm: React.Dispatch<React.SetStateAction<ACSData>>;
}

export const Header: React.FC<HeaderProps> = ({
  showGuidelines,
  setShowGuidelines,
  pacientes,
  selectedPacienteId,
  setSelectedPacienteId,
  setEadForm,
  setAcsForm,
}) => {
  return (
    <header className="px-8 py-4 bg-white border-b border-[#ffeef4] flex items-center justify-end shrink-0">
      <div className="flex items-center gap-4">

        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#ff75a0] hover:bg-[#fff0f6] transition-all"
        >
          <BarChart3 size={15} />

          {showGuidelines
            ? "Ver Painel"
            : "Diretrizes SUS"}
        </button>

        {/* Seletor Rápido de Paciente */}
        <div className="flex items-center gap-2 bg-[#fff5f8] px-3 py-1.5 rounded-lg border border-[#ffe3ec]">

          <span className="text-[10px] font-black text-[#ff75a0] uppercase">
            Paciente:
          </span>

          <select
            value={selectedPacienteId}
            onChange={(e) => {
              const pacienteId = e.target.value;

              const pacienteSelecionado = pacientes.find(
                p => p.id === pacienteId
              );

              setSelectedPacienteId(pacienteId);

              if (pacienteSelecionado) {
                setEadForm(prev => ({
                  ...prev,
                  codigoPaciente: pacienteSelecionado.id,
                }));

                setAcsForm(prev => ({
                  ...prev,
                  paciente: pacienteSelecionado.nome,
                }));
              }
            }}
            className="bg-transparent text-xs font-extrabold text-[#2d1822] focus:outline-none cursor-pointer"
          >
            {pacientes.map(p => (
              <option
                key={p.id}
                value={p.id}
              >
                {p.nome}
              </option>
            ))}
          </select>

        </div>
      </div>
    </header>
  );
};