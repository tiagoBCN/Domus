import React from 'react';
import { DashboardProps } from '../types/dashboardProps';
import { HistoricoEAD, HistoricoACS } from '../types';
import { ClipboardList, Search, BarChart3 } from 'lucide-react';

export const Dashboard: React.FC<DashboardProps> = ({
  pacientes,
  selectedPacienteId,
  setSelectedPacienteId,
  activeModal,
  setActiveModal,
  handleAcsClear,
  handleTriagemStart,
  handleEadClear,
  activePaciente,
  setEadForm,
  setAcsForm,
  setShowGuidelines,
}) => {
  return (
    <>
      {/* Quick Cards dos 3 Formulários (Open in Modal) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => { handleAcsClear(); setActiveModal('acs'); }}
          className="bg-white border border-[#ffe3ec] p-6 rounded-2xl text-left hover:border-[#ff75a0] transition-all flex flex-col justify-between h-36 relative group cursor-pointer"
        >
          <div className="flex justify-between items-start w-full">
            <div className="w-10 h-10 rounded-xl bg-[#fff0f5] flex items-center justify-center text-[#ff75a0]">
              <ClipboardList size={20} />
            </div>
            <span className="text-[10px] font-extrabold text-[#be80ff] uppercase tracking-wider">Módulo 1</span>
          </div>
          <div>
            <h3 className="text-md font-black text-[#2d1822]">Coleta Territorial ACS</h3>
            <p className="text-[11px] text-gray-400 mt-1">Checklist de 10 perguntas de campo.</p>
          </div>
        </button>

        <button
          onClick={() => { handleTriagemStart(); setActiveModal('triagem'); }}
          className="bg-white border border-[#ffe3ec] p-6 rounded-2xl text-left hover:border-[#ff75a0] transition-all flex flex-col justify-between h-36 relative group cursor-pointer"
        >
          <div className="flex justify-between items-start w-full">
            <div className="w-10 h-10 rounded-xl bg-[#fff0f5] flex items-center justify-center text-[#ff75a0]">
              <Search size={20} />
            </div>
            <span className="text-[10px] font-extrabold text-[#be80ff] uppercase tracking-wider">Módulo 2</span>
          </div>
          <div>
            <h3 className="text-md font-black text-[#2d1822]">Triagem de Entrada</h3>
            <p className="text-[11px] text-gray-400 mt-1">Elegibilidade básica e IAEC-AD.</p>
          </div>
        </button>

        <button
          onClick={() => { handleEadClear(); setActiveModal('ead'); }}
          className="bg-white border border-[#ffe3ec] p-6 rounded-2xl text-left hover:border-[#ff75a0] transition-all flex flex-col justify-between h-36 relative group cursor-pointer"
        >
          <div className="flex justify-between items-start w-full">
            <div className="w-10 h-10 rounded-xl bg-[#fff0f5] flex items-center justify-center text-[#ff75a0]">
              <BarChart3 size={20} />
            </div>
            <span className="text-[10px] font-extrabold text-[#be80ff] uppercase tracking-wider">Módulo 3</span>
          </div>
          <div>
            <h3 className="text-md font-black text-[#2d1822]">Escore EAD</h3>
            <p className="text-[11px] text-gray-400 mt-1">Pontuação de 7 domínios e Red Flags.</p>
          </div>
        </button>
      </div>

      {/* List & Patient History Container (Subtle & minimalist design) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="pacientes-section">
        {/* Pacientes cadastrados */}
        <div className="bg-white border border-[#ffeef4] rounded-2xl p-4 space-y-4 flex flex-col max-h-[600px]">
          <div className="flex justify-between items-center pb-2 border-b border-[#fff0f5] shrink-0">
            <h3 className="text-xs font-black uppercase text-[#ff75a0] tracking-wider">Fichas de Pacientes</h3>
          </div>
          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
            {pacientes.map(p => {
              const active = p.id === selectedPacienteId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPacienteId(p.id)}
                  className={`p-3 rounded-xl cursor-pointer text-xs transition-all ${
                    active ? "bg-[#fff0f6] font-bold text-[#ff75a0]" : "hover:bg-[#fffbfc]"
                  }`}
                >
                  <div className="flex justify-between">
                    <span>{p.nome}</span>
                    <span className="text-[10px] text-gray-400 font-normal">{p.id}</span>
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
                  <h2 className="text-lg font-black">{activePaciente.nome}</h2>
                  <p className="text-[11px] text-gray-400">Prontuário: {activePaciente.prontuario} | Cadastro: {activePaciente.dataCriacao}</p>
                </div>
                <span className="text-[10px] font-black uppercase text-[#ff75a0] bg-[#fff0f5] px-2.5 py-1 rounded-md">
                  {activePaciente.statusProtocolo}
                </span>
              </div>

              {/* Escore EAD */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-[#be80ff] uppercase tracking-wider">Histórico Escore EAD</h4>
                {activePaciente.historicoEAD.length > 0 ? (
                  activePaciente.historicoEAD.map((ead: HistoricoEAD, idx: number) => (
                    <div key={idx} className="p-3 bg-[#fffbfc] border border-[#fff5f8] rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-[#ff75a0]">{ead.classificacao}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Visitas: {ead.freqGeral}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm">{ead.scoreTotal}/21</span>
                        <span className="text-[9px] text-gray-400 block">{ead.dataAvaliacao}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">Nenhum score EAD registrado.</p>
                )}
              </div>

              {/* Coletas ACS */}
              <div className="space-y-3 pt-4 border-t border-[#fff5f8]">
                <h4 className="text-[10px] font-black text-[#be80ff] uppercase tracking-wider">Checklists ACS</h4>
                {activePaciente.historicoACS.length > 0 ? (
                  activePaciente.historicoACS.map((acs: HistoricoACS, idx: number) => (
                    <div key={idx} className="p-3 bg-[#fffbfc] border border-[#fff5f8] rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>Coletor: {acs.acsNome || 'ACS'}</span>
                        <span className="text-[10px] text-gray-400">{acs.dataColeta}</span>
                      </div>
                      <p className="text-gray-500 text-[11px]">{acs.abvd || 'ABVD estável'}</p>
                      {acs.alertaFinal === 'Sim' && (
                        <p className="text-[10px] font-bold text-red-500">🚨 Alerta: {acs.alertaQual}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">Nenhuma coleta do ACS registrada.</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-400 italic text-center py-12">Selecione um paciente para ver o histórico.</p>
          )}
        </div>
      </div>
    </>
  );
};
