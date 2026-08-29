import React from 'react';
import { BarChart3, Plus, Users } from 'lucide-react';
import logo from '../../../assets/logo.jpeg';
import { Paciente } from '../types/triagens';

interface SidebarProps {
  pacientes: Paciente[];
  setPacientes: React.Dispatch<React.SetStateAction<Paciente[]>>;
  selectedPacienteId: string;
  setSelectedPacienteId: React.Dispatch<React.SetStateAction<string>>;
  setShowGuidelines: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SidebarProps {
  pacientes: Paciente[];
  setPacientes: React.Dispatch<React.SetStateAction<Paciente[]>>;
  selectedPacienteId: string;
  setSelectedPacienteId: React.Dispatch<React.SetStateAction<string>>;
  setShowGuidelines: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pacientes,
  setPacientes,
  setSelectedPacienteId,
  selectedPacienteId,
  setShowGuidelines,
}) => {
  const handleAddPatient = () => {
    const nome = prompt('Nome do novo paciente:');

    if (nome) {
      const newPac: Paciente = {
        id: `PAC-${Math.floor(1000 + Math.random() * 9000)}`,
        nome,
        prontuario: `PRON-${Math.floor(100 + Math.random() * 900)}`,
        dataCriacao: new Date().toISOString().split('T')[0],
        statusProtocolo: 'Inicio',
        historicoACS: [],
        historicoEAD: [],
        historicoTriagem: [],
      };

      setPacientes([newPac, ...pacientes]);
      setSelectedPacienteId(newPac.id);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-[#ffeef4] flex flex-col shrink-0">
      <div className="p-6 border-b border-[#ffeef4] flex items-center gap-3">
        <img
          src={logo.src}
          alt="Logo"
          className="w-8 h-8 rounded-lg"
        />

        <div>
          <h1 className="text-lg font-black tracking-tight text-[#2d1822]">
            Domus
            <span className="text-[#ff75a0] font-normal">.ai</span>
          </h1>

          <p className="text-[9px] uppercase tracking-wider font-extrabold text-[#be80ff]">
            Triagem Clínica
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#fff0f6] text-[#ff75a0] font-bold text-sm transition-all"
          onClick={() => setShowGuidelines(true)}
        >
          <BarChart3 size={18} />
          Dashboard
        </button>

        <button
          onClick={handleAddPatient}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#fffbfc] text-gray-500 hover:text-[#ff75a0] font-bold text-sm transition-all"
        >
          <Plus size={18} />
          Cadastrar Paciente
        </button>

        <button
          onClick={() =>
            document
              .getElementById('pacientes-section')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#fffbfc] text-gray-500 hover:text-[#ff75a0] font-bold text-sm transition-all"
        >
          <Users size={18} />
          Acessar Fichas
        </button>
      </nav>
    </aside>
  );
};