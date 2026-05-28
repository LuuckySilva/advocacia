export type AreaAtuacao = 'trabalhista' | 'civel' | 'familia' | 'empresarial' | 'criminal' | 'previdenciario';
export type CanalConfirmacao = 'whatsapp' | 'email' | 'ligacao';
export interface ContatoBody {
    nome: string;
    cpf: string;
    telefone: string;
    email?: string;
    numeroProcesso?: string;
    area: AreaAtuacao;
    descricao: string;
    canal: CanalConfirmacao;
}
export interface Advogado {
    nome: string;
    iniciais: string;
    area: string;
    emailDestino: string;
}
export interface ApiResponse {
    success: boolean;
    message: string;
    advogado?: Pick<Advogado, 'nome' | 'area'>;
}
//# sourceMappingURL=types.d.ts.map