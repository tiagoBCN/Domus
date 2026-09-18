import { createClient } from '../lib/supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Utilitário para chamadas à API do backend com autenticação JWT do Supabase.
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  return headers;
}

export async function apiGet<T = any>(endpoint: string): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Erro ${res.status} ao buscar ${endpoint}`);
  }

  return res.json();
}

export async function apiPost<T = any>(endpoint: string, body: any): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Erro ${res.status} ao salvar em ${endpoint}`);
  }

  return res.json();
}

// ─── Funções de conveniência ─────────────────────────────────────────

// Pacientes
export const getPacientes = () => apiGet('/api/pacientes');
export const getPaciente = (id: string) => apiGet(`/api/pacientes/${id}`);
export const criarPaciente = (data: { nome: string; prontuario?: string; idade?: number; statusProtocolo?: string }) =>
  apiPost('/api/pacientes', data);

// Ficha ACS
export const getFichasACS = (pacienteId: string) => apiGet(`/api/acs/${pacienteId}`);
export const salvarFichaACS = (data: any) => apiPost('/api/acs', data);

// Triagem
export const getTriagens = (pacienteId: string) => apiGet(`/api/triagem/${pacienteId}`);
export const salvarTriagem = (data: any) => apiPost('/api/triagem', data);

// Score EAD
export const getScoresEAD = (pacienteId: string) => apiGet(`/api/ead/${pacienteId}`);
export const salvarScoreEAD = (data: any) => apiPost('/api/ead', data);
