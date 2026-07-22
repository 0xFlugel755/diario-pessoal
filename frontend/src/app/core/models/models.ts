export interface Foto {
  id?: string;
  urlFoto: string;
  publicId?: string;
}

export interface Diario {
  id?: string;
  data: string; // formato 'YYYY-MM-DD'
  conteudoTexto: string;
  emojiHumor?: string;
  fotos?: Foto[];
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface LoginRequest {
  username: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  username: string;
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  nome: string;
  expiraEmSegundos: number;
}

export interface LogAcesso {
  id: number;
  usuarioId: string | null;
  username: string;
  nome: string | null;
  ipOrigem: string;
  userAgent: string | null;
  status: 'SUCESSO' | 'FALHA';
  timestampLog: string;
}

export interface MoodOption {
  emoji: string;
  label: string;
}
