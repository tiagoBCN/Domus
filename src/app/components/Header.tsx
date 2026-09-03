import React from "react";
import { BookOpen } from "lucide-react";

interface HeaderProps {
  showGuidelines: boolean;
  setShowGuidelines: (show: boolean) => void;
  onStartViaUnica?: () => void;
  activePacienteNome?: string;
}

export const Header: React.FC<HeaderProps> = ({
  showGuidelines,
  setShowGuidelines,
}) => {
  return (
    <header className="px-6 py-4 bg-white border-b border-zinc-200 flex items-center justify-end shrink-0 h-20">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-all cursor-pointer"
        >
          <BookOpen size={14} />
          <span>{showGuidelines ? "Ver Painel" : "Diretrizes SUS"}</span>
        </button>
      </div>
    </header>
  );
};