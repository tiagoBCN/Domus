import React from 'react';
import { ClipboardList, Search, BarChart3, Play, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { EADData, HistoricoACS, TriagemData } from '../types/triagens';
import { FichasList } from './FichasList';

interface DashboardProps {
  onStartViaUnica: () => void;
  onOpenModule: (module: 'acs' | 'triagem' | 'ead') => void;
  lastSessionData?: {
    pacienteNome: string;
    prontuario: string;
    acsData?: HistoricoACS;
    triagemData?: TriagemData;
    eadData?: EADData;
  } | null;
  refreshTrigger?: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartViaUnica,
  onOpenModule,
  lastSessionData,
  refreshTrigger,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Banner: Iniciar Atendimento Via Única */}
      <div className="bg-zinc-900 text-white rounded-3xl p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl z-10">
          <h2 className="text-2xl font-black tracking-tight text-white">
          Triagem Clínica
          </h2>
        </div>

        <button
          onClick={onStartViaUnica}
          className="z-10 px-6 py-4 bg-white text-zinc-900 rounded-2xl font-black text-sm hover:bg-zinc-100 transition-all flex items-center gap-3 shrink-0 shadow-lg group cursor-pointer"
        >
          <Play size={18} className="fill-zinc-900 group-hover:scale-110 transition-transform" />
          <span>Iniciar Nova Triagem</span>
        </button>
      </div>

      {/* Grid de Acesso Direto aos 3 Módulos */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
            Módulos de Avaliação
          </h3>
          <span className="text-xs text-zinc-500 font-medium">3 etapas encadeadas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Módulo 1 */}
          <button
            onClick={() => onOpenModule('acs')}
            className="bg-white border border-zinc-200 p-6 rounded-2xl text-left hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between h-40 relative group cursor-pointer"
          >
            <div className="flex justify-between items-start w-full">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <ClipboardList size={20} />
              </div>
              <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider">Módulo 1</span>
            </div>
            <div>
              <h4 className="text-md font-black text-zinc-900">Coleta Territorial ACS</h4>
              <p className="text-[11px] text-zinc-500 mt-1">10 perguntas de campo sobre mobilidade, intercorrências e cuidador.</p>
            </div>
          </button>

          {/* Módulo 2 */}
          <button
            onClick={() => onOpenModule('triagem')}
            className="bg-white border border-zinc-200 p-6 rounded-2xl text-left hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between h-40 relative group cursor-pointer"
          >
            <div className="flex justify-between items-start w-full">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <Search size={20} />
              </div>
              <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider">Módulo 2</span>
            </div>
            <div>
              <h4 className="text-md font-black text-zinc-900">Triagem de Entrada</h4>
              <p className="text-[11px] text-zinc-500 mt-1">Elegibilidade preliminar, procedimentos especiais e pontuação IAEC-AD.</p>
            </div>
          </button>

          {/* Módulo 3 */}
          <button
            onClick={() => onOpenModule('ead')}
            className="bg-white border border-zinc-200 p-6 rounded-2xl text-left hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between h-40 relative group cursor-pointer"
          >
            <div className="flex justify-between items-start w-full">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <BarChart3 size={20} />
              </div>
              <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider">Módulo 3</span>
            </div>
            <div>
              <h4 className="text-md font-black text-zinc-900">Escore EAD</h4>
              <p className="text-[11px] text-zinc-500 mt-1">Estratificação clínica em 7 domínios e detecção de Red Flags.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Resumo da Última Sessão Realizada (Se houver) */}
      {lastSessionData && (
        <div className="bg-white border border-zinc-900 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-zinc-900" />
              <h3 className="text-sm font-black text-zinc-900 uppercase">
                Última Avaliação Concluída
              </h3>
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase bg-zinc-100 px-2.5 py-1 rounded-md">
              Sessão Atual
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block">Paciente</span>
              <span className="font-black text-zinc-900 text-sm">{lastSessionData.pacienteNome}</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Prontuário: {lastSessionData.prontuario || '—'}</span>
            </div>

            {lastSessionData.triagemData && (
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">Resultado Triagem</span>
                <span className="font-extrabold text-zinc-900">{lastSessionData.triagemData.classificacaoFinal} — {lastSessionData.triagemData.servicoResponsavel}</span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">{lastSessionData.triagemData.frequenciaRecomendada}</span>
              </div>
            )}

            {lastSessionData.eadData && (
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">Escore EAD</span>
                <span className="font-extrabold text-zinc-900">{lastSessionData.eadData.scoreTotal}/21 pts</span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">{lastSessionData.eadData.classificacao}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-4" id="pacientes-section">
        <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-zinc-900" />
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
              Acesso a Fichas Clínicas
            </h3>
          </div>
        </div>

        <FichasList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};
