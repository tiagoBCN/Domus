import React, { useEffect, useState } from 'react';
import { getPacientes } from '../../services/api';
import { FileText, Loader2, AlertCircle, Eye, Printer, X } from 'lucide-react';

interface Ficha {
  id: string;
  dataColeta: string;
  acsNome: string;
  mobilidade: string;
  abvd: string;
  intercorrencias: { naoTeve: boolean; upaVezes: number; hospVezes: number };
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

interface PacienteData {
  id: string;
  nome: string;
  prontuario: string | null;
  fichasACS: Ficha[];
}

interface FichasListProps {
  refreshTrigger?: number;
}

export const FichasList: React.FC<FichasListProps> = ({ refreshTrigger = 0 }) => {
  const [pacientes, setPacientes] = useState<PacienteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFicha, setSelectedFicha] = useState<{pacienteNome: string; ficha: Ficha} | null>(null);

  useEffect(() => {
    async function loadPacientes() {
      try {
        const data = await getPacientes();
        setPacientes(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar fichas');
      } finally {
        setLoading(false);
      }
    }
    loadPacientes();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-zinc-500">
        <Loader2 className="animate-spin mb-2" size={24} />
        <p className="text-sm font-medium">Carregando fichas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-500">
        <AlertCircle className="mb-2" size={24} />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (pacientes.length === 0) {
    return (
      <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-300 space-y-2">
        <FileText size={32} className="mx-auto text-zinc-400" />
        <h4 className="text-sm font-extrabold text-zinc-800">
          Nenhuma ficha encontrada
        </h4>
        <p className="text-xs text-zinc-500 max-w-lg mx-auto leading-relaxed">
          Nenhum paciente ou ficha ACS foi registrado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pacientes.map((paciente) => (
        <div key={paciente.id} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h4 className="font-bold text-zinc-900">{paciente.nome}</h4>
              <p className="text-xs text-zinc-500">Prontuário: {paciente.prontuario || 'N/A'}</p>
            </div>
            <span className="text-[10px] font-bold text-white bg-zinc-800 px-2.5 py-1 rounded-md uppercase">
              {paciente.fichasACS.length} Fichas
            </span>
          </div>

          {paciente.fichasACS.length > 0 ? (
            <div className="grid gap-2">
              {paciente.fichasACS.map((ficha) => (
                <div key={ficha.id} className="bg-white border border-zinc-100 rounded-xl p-3 flex justify-between  text-xs">
                <div>
                  <div>
                    <p className="font-semibold text-zinc-800 text-[11px] uppercase tracking-wide">ACS: {ficha.acsNome || 'Não informado'}</p>
                    <p className="text-zinc-500">Data: {new Date(ficha.dataColeta).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="flex gap-2">
                    
                      <p className="text-zinc-600">Mobilidade: {ficha.mobilidade || 'N/A'}</p>
                      {ficha.alertaFinal === 'Sim' && (
                        <span className="text-red-500 font-bold inline-flex items-center gap-1 mt-1">
                          <AlertCircle size={10} /> Alerta Urgência
                        </span>
                      )}
                    </div>
                    </div>
                    <div className='flex items-center'>
                    <button
                      onClick={() => setSelectedFicha({ pacienteNome: paciente.nome, ficha })}
                      className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer print:hidden"
                    >
                      <Eye size={14} />
                      Ver Ficha
                    </button>
                  </div>
                  
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 italic">Sem fichas ACS cadastradas.</p>
          )}
        </div>
      ))}

      {/* MODAL VER FICHA */}
      {selectedFicha && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:bg-white print:p-0 print:absolute print:inset-0 print:block">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-zinc-200 shadow-2xl print:shadow-none print:border-none print:w-full print:max-h-none print:rounded-none">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center shrink-0 print:hidden">
              <div>
                <h3 className="text-md font-black text-zinc-900">
                  Detalhes da Ficha ACS
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Paciente: {selectedFicha.pacienteNome}
                </p>
              </div>
              <button
                onClick={() => setSelectedFicha(null)}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Conteúdo Modal - Impresso */}
            <div className="p-8 overflow-y-auto flex-1 text-sm text-zinc-800 space-y-6 bg-white print:p-4">
              <div className="border-b-2 border-zinc-900 pb-4 mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight">Ficha de Avaliação ACS</h2>
                <div className="grid grid-cols-2 mt-4 gap-2 text-sm">
                  <p><strong>Paciente:</strong> {selectedFicha.pacienteNome}</p>
                  <p><strong>Data da Coleta:</strong> {new Date(selectedFicha.ficha.dataColeta).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Nome do ACS:</strong> {selectedFicha.ficha.acsNome}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 print:border-zinc-300">
                    <p className="text-[10px] uppercase font-bold text-zinc-500">Mobilidade</p>
                    <p className="font-semibold">{selectedFicha.ficha.mobilidade || 'N/A'}</p>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 print:border-zinc-300">
                    <p className="text-[10px] uppercase font-bold text-zinc-500">ABVD</p>
                    <p className="font-semibold">{selectedFicha.ficha.abvd || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 print:border-zinc-300">
                  <p className="text-[10px] uppercase font-bold text-zinc-500">Sintomas</p>
                  <p className="font-semibold">{selectedFicha.ficha.sintomas || 'Nenhum'}</p>
                  {selectedFicha.ficha.sintomasFreq && <p className="text-xs text-zinc-600 mt-1">Frequência: {selectedFicha.ficha.sintomasFreq}</p>}
                </div>

                <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 print:border-zinc-300">
                  <p className="text-[10px] uppercase font-bold text-zinc-500">Cuidados</p>
                  <p className="font-semibold">{selectedFicha.ficha.cuidados?.length ? selectedFicha.ficha.cuidados.join(', ') : 'Nenhum'}</p>
                  {selectedFicha.ficha.cuidadosOutro && <p className="text-xs text-zinc-600 mt-1">Outro: {selectedFicha.ficha.cuidadosOutro}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 print:border-zinc-300">
                    <p className="text-[10px] uppercase font-bold text-zinc-500">Dispositivos</p>
                    <p className="font-semibold">{selectedFicha.ficha.dispositivos || 'Nenhum'}</p>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 print:border-zinc-300">
                    <p className="text-[10px] uppercase font-bold text-zinc-500">Intercorrências</p>
                    <p className="font-semibold">{selectedFicha.ficha.intercorrencias?.naoTeve ? 'Não teve' : `UPA: ${selectedFicha.ficha.intercorrencias?.upaVezes}x, Hosp: ${selectedFicha.ficha.intercorrencias?.hospVezes}x`}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 print:border-zinc-300">
                    <p className="text-[10px] uppercase font-bold text-zinc-500">Medicamento Alterado?</p>
                    <p className="font-semibold">{selectedFicha.ficha.medAlterado || 'N/A'}</p>
                    {selectedFicha.ficha.medQual && <p className="text-xs text-zinc-600 mt-1">Qual: {selectedFicha.ficha.medQual}</p>}
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 print:border-zinc-300">
                    <p className="text-[10px] uppercase font-bold text-zinc-500">Piora Recente</p>
                    <p className="font-semibold">{selectedFicha.ficha.pioraRecente || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 print:border-zinc-300">
                  <p className="text-[10px] uppercase font-bold text-zinc-500">Cuidador</p>
                  <p className="font-semibold">{selectedFicha.ficha.cuidadorNome || 'N/A'}</p>
                  <p className="text-xs text-zinc-600 mt-1">Status: {selectedFicha.ficha.cuidadorStatus || 'N/A'}</p>
                </div>

                <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 print:border-zinc-300">
                  <p className="text-[10px] uppercase font-bold text-zinc-500">Necessidade Identificada pelo ACS</p>
                  <p className="font-semibold">{selectedFicha.ficha.necessidade || 'N/A'}</p>
                </div>

                <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 print:border-zinc-300">
                  <p className="text-[10px] uppercase font-bold text-zinc-500">Observações Adicionais</p>
                  <p className="font-semibold">{selectedFicha.ficha.observacoes?.length ? selectedFicha.ficha.observacoes.join(', ') : 'Nenhuma'}</p>
                </div>

                {selectedFicha.ficha.alertaFinal === 'Sim' && (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-200 print:border-red-300 mt-6">
                    <p className="text-xs uppercase font-bold text-red-700 flex items-center gap-1 mb-1">
                      <AlertCircle size={14} /> Alerta de Urgência
                    </p>
                    <p className="font-bold text-red-950">{selectedFicha.ficha.alertaQual || 'Urgência sinalizada sem detalhes adicionais.'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-3 shrink-0 print:hidden">
              <button
                onClick={() => setSelectedFicha(null)}
                className="px-4 py-2 text-zinc-700 font-bold hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white font-bold hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                <Printer size={16} />
                Imprimir Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
