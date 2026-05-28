"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarContato = exports.validarEmail = exports.validarTelefone = exports.validarCPF = void 0;
// ── ÁREAS VÁLIDAS ─────────────────────────────────────────────
const AREAS_VALIDAS = [
    'trabalhista',
    'civel',
    'familia',
    'empresarial',
    'criminal',
    'previdenciario'
];
// ── CANAIS VÁLIDOS ────────────────────────────────────────────
const CANAIS_VALIDOS = ['whatsapp', 'email', 'ligacao'];
// ── VALIDAÇÃO DE CPF (dígito verificador) ─────────────────────
function validarCPF(cpf) {
    const nums = cpf.replace(/\D/g, '');
    if (nums.length !== 11)
        return false;
    // Rejeita CPFs com todos os dígitos iguais (ex: 111.111.111-11)
    if (/^(\d)\1+$/.test(nums))
        return false;
    // Primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(nums[i]) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11)
        resto = 0;
    if (resto !== parseInt(nums[9]))
        return false;
    // Segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(nums[i]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11)
        resto = 0;
    return resto === parseInt(nums[10]);
}
exports.validarCPF = validarCPF;
// ── VALIDAÇÃO DO TELEFONE ─────────────────────────────────────
function validarTelefone(telefone) {
    const nums = telefone.replace(/\D/g, '');
    return nums.length >= 10 && nums.length <= 11;
}
exports.validarTelefone = validarTelefone;
// ── VALIDAÇÃO DO E-MAIL ───────────────────────────────────────
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
exports.validarEmail = validarEmail;
// ── VALIDAÇÃO PRINCIPAL ───────────────────────────────────────
function validarContato(body) {
    const erros = [];
    // Verifica se body é um objeto
    if (!body || typeof body !== 'object') {
        return { valido: false, erros: ['Body inválido'] };
    }
    const data = body;
    // Nome
    if (!data.nome || typeof data.nome !== 'string' || data.nome.trim().length < 3) {
        erros.push('Nome completo é obrigatório (mínimo 3 caracteres)');
    }
    // CPF
    if (!data.cpf || typeof data.cpf !== 'string' || !validarCPF(data.cpf)) {
        erros.push('CPF inválido');
    }
    // Telefone
    if (!data.telefone || typeof data.telefone !== 'string' || !validarTelefone(data.telefone)) {
        erros.push('Telefone inválido — informe DDD + número');
    }
    // E-mail (opcional, mas se informado precisa ser válido)
    if (data.email && typeof data.email === 'string' && data.email.trim() !== '') {
        if (!validarEmail(data.email)) {
            erros.push('E-mail inválido');
        }
    }
    // Área
    if (!data.area || !AREAS_VALIDAS.includes(data.area)) {
        erros.push(`Área inválida. Valores aceitos: ${AREAS_VALIDAS.join(', ')}`);
    }
    // Descrição
    if (!data.descricao || typeof data.descricao !== 'string' || data.descricao.trim().length < 20) {
        erros.push('Descrição do caso é obrigatória (mínimo 20 caracteres)');
    }
    // Canal
    if (!data.canal || !CANAIS_VALIDOS.includes(data.canal)) {
        erros.push(`Canal inválido. Valores aceitos: ${CANAIS_VALIDOS.join(', ')}`);
    }
    // Canal e-mail exige e-mail preenchido
    if (data.canal === 'email' && (!data.email || typeof data.email !== 'string' || data.email.trim() === '')) {
        erros.push('Canal e-mail selecionado mas e-mail não informado');
    }
    return {
        valido: erros.length === 0,
        erros
    };
}
exports.validarContato = validarContato;
//# sourceMappingURL=validator.js.map