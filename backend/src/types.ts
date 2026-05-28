// ── ÁREAS DE ATUAÇÃO ─────────────────────────────────────────
export type AreaAtuacao =
  | 'trabalhista'
  | 'civel'
  | 'familia'
  | 'empresarial'
  | 'criminal'
  | 'previdenciario'

// ── CANAL DE CONFIRMAÇÃO ──────────────────────────────────────
export type CanalConfirmacao = 'whatsapp' | 'email' | 'ligacao'

// ── BODY DO FORMULÁRIO ────────────────────────────────────────
export interface ContatoBody {
  nome: string
  cpf: string
  telefone: string
  email?: string
  numeroProcesso?: string
  area: AreaAtuacao
  descricao: string
  canal: CanalConfirmacao
}

// ── ADVOGADO RESPONSÁVEL ──────────────────────────────────────
export interface Advogado {
  nome: string
  iniciais: string
  area: string
  emailDestino: string
}

// ── RESPOSTA DA API ───────────────────────────────────────────
export interface ApiResponse {
  success: boolean
  message: string
  advogado?: Pick<Advogado, 'nome' | 'area'>
}