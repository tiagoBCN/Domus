import React from 'react';
import { LayoutDashboard, Play, FileText, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import logo from '../../../public/assets/logo.jpeg';

interface SidebarProps {
  showGuidelines: boolean;
  setShowGuidelines: (show: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onStartViaUnica: () => void;
  onAccessFichas: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  showGuidelines,
  setShowGuidelines,
  isCollapsed,
  setIsCollapsed,
  onStartViaUnica,
  onAccessFichas,
}) => {
  return (
    <aside
      className={`bg-white border-r border-zinc-200 flex flex-col shrink-0 transition-all duration-300 relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header com Logo e Botão de Retração */}
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between gap-3 h-20">
        {isCollapsed ? (
          <button
            onClick={() => setIsCollapsed(false)}
            title="Expandir Menu"
            className="w-full flex items-center justify-center cursor-pointer group"
          >
            <img
              src={logo.src}
              alt="Logo Domus"
              className="w-10 h-10 rounded-xl object-cover border border-zinc-200 group-hover:scale-105 transition-transform"
            />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={logo.src}
                alt="Logo Domus"
                className="w-9 h-9 rounded-xl object-cover shrink-0 border border-zinc-200"
              />
              <div className="truncate">
                <h1 className="text-lg font-black tracking-tight text-zinc-900 leading-tight">
                  Domus
                  <span className="text-zinc-500 font-normal">.ai</span>
                </h1>
                <p className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-500 truncate">
                  Triagem Clínica
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCollapsed(true)}
              title="Recolher Menu"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors shrink-0 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
          </>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-3 space-y-2">
        {/* Botão de Destaque: Nova Triagem */}
        <button
          onClick={onStartViaUnica}
          title="Nova Triagem (Via Única)"
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all shadow-sm ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Play size={18} className="fill-white shrink-0" />
          {!isCollapsed && <span>Nova Triagem</span>}
        </button>

        {/* Botão Dashboard */}
        <button
          onClick={() => setShowGuidelines(false)}
          title="Dashboard Principal"
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-bold text-sm ${
            !showGuidelines
              ? 'bg-zinc-100 text-zinc-900'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          } ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LayoutDashboard size={18} className="shrink-0" />
          {!isCollapsed && <span>Dashboard</span>}
        </button>

        {/* Botão Acessar Fichas (Integração Backend) */}
        <button
          onClick={onAccessFichas}
          title="Acessar Fichas de Pacientes (Integração Backend)"
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 font-bold text-sm transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <FileText size={18} className="shrink-0" />
          {!isCollapsed && <span>Acessar Fichas</span>}
        </button>

        {/* Botão Diretrizes SUS */}
        <button
          onClick={() => setShowGuidelines(true)}
          title="Diretrizes de Elegibilidade SUS"
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-bold text-sm ${
            showGuidelines
              ? 'bg-zinc-100 text-zinc-900'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          } ${isCollapsed ? 'justify-center' : ''}`}
        >
          <BookOpen size={18} className="shrink-0" />
          {!isCollapsed && <span>Diretrizes SUS</span>}
        </button>
      </nav>
    </aside>
  );
};