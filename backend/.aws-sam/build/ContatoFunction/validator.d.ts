export declare function validarCPF(cpf: string): boolean;
export declare function validarTelefone(telefone: string): boolean;
export declare function validarEmail(email: string): boolean;
export interface ValidationResult {
    valido: boolean;
    erros: string[];
}
export declare function validarContato(body: unknown): ValidationResult;
//# sourceMappingURL=validator.d.ts.map