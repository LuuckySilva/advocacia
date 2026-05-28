import { validarCPF, validarEmail, validarTelefone, validarContato } from './validator'
import { rotearAdvogado } from './router'

// ══════════════════════════════════════════════
// TESTES: validarCPF
// ══════════════════════════════════════════════
describe('validarCPF', () => {

  it('aceita CPF valido formatado', () => {
    expect(validarCPF('529.982.247-25')).toBe(true)
  })

  it('aceita CPF valido sem formatacao', () => {
    expect(validarCPF('52998224725')).toBe(true)
  })

  it('rejeita CPF com todos os digitos iguais', () => {
    expect(validarCPF('111.111.111-11')).toBe(false)
  })

  it('rejeita CPF com digito verificador errado', () => {
    expect(validarCPF('529.982.247-26')).toBe(false)
  })

  it('rejeita CPF com menos de 11 digitos', () => {
    expect(validarCPF('123.456.789')).toBe(false)
  })

  it('rejeita string vazia', () => {
    expect(validarCPF('')).toBe(false)
  })
})

// ══════════════════════════════════════════════
// TESTES: validarEmail
// ══════════════════════════════════════════════
describe('validarEmail', () => {

  it('aceita email valido', () => {
    expect(validarEmail('lucas@gmail.com')).toBe(true)
  })

  it('aceita email com subdominio', () => {
    expect(validarEmail('lucas@mail.escritorio.com')).toBe(true)
  })

  it('rejeita email sem @', () => {
    expect(validarEmail('lucasgmail.com')).toBe(false)
  })

  it('rejeita email sem dominio', () => {
    expect(validarEmail('lucas@')).toBe(false)
  })

  it('rejeita string vazia', () => {
    expect(validarEmail('')).toBe(false)
  })
})

// ══════════════════════════════════════════════
// TESTES: validarTelefone
// ══════════════════════════════════════════════
describe('validarTelefone', () => {

  it('aceita celular com 11 digitos', () => {
    expect(validarTelefone('35984128081')).toBe(true)
  })

  it('aceita fixo com 10 digitos', () => {
    expect(validarTelefone('3533001234')).toBe(true)
  })

  it('aceita telefone formatado', () => {
    expect(validarTelefone('(35) 98412-8081')).toBe(true)
  })

  it('rejeita telefone com menos de 10 digitos', () => {
    expect(validarTelefone('35984')).toBe(false)
  })

  it('rejeita string vazia', () => {
    expect(validarTelefone('')).toBe(false)
  })
})

// ══════════════════════════════════════════════
// TESTES: validarContato
// ══════════════════════════════════════════════
describe('validarContato', () => {

  const bodyValido = {
    nome: 'Lucas Silva',
    cpf: '529.982.247-25',
    telefone: '35984128081',
    area: 'trabalhista',
    descricao: 'Fui demitido sem justa causa e nao recebi o FGTS corretamente.',
    canal: 'whatsapp'
  }

  it('valida body completo e correto', () => {
    const resultado = validarContato(bodyValido)
    expect(resultado.valido).toBe(true)
    expect(resultado.erros).toHaveLength(0)
  })

  it('rejeita body sem nome', () => {
    const { nome: _nome, ...semNome } = bodyValido
    const resultado = validarContato(semNome)
    expect(resultado.valido).toBe(false)
    expect(resultado.erros.some((e: string) => e.includes('Nome'))).toBe(true)
  })

  it('rejeita CPF invalido', () => {
    const resultado = validarContato({ ...bodyValido, cpf: '111.111.111-11' })
    expect(resultado.valido).toBe(false)
    expect(resultado.erros.some((e: string) => e.includes('CPF'))).toBe(true)
  })

  it('rejeita area invalida', () => {
    const resultado = validarContato({ ...bodyValido, area: 'invalida' })
    expect(resultado.valido).toBe(false)
    expect(resultado.erros.some((e: string) => e.includes('rea'))).toBe(true)
  })

  it('rejeita descricao curta', () => {
    const resultado = validarContato({ ...bodyValido, descricao: 'curto' })
    expect(resultado.valido).toBe(false)
    expect(resultado.erros.some((e: string) => e.includes('escri'))).toBe(true)
  })

  it('rejeita canal email sem email informado', () => {
    const resultado = validarContato({ ...bodyValido, canal: 'email' })
    expect(resultado.valido).toBe(false)
    expect(resultado.erros.some((e: string) => e.includes('e-mail'))).toBe(true)
  })

  it('aceita canal email com email informado', () => {
    const resultado = validarContato({ ...bodyValido, canal: 'email', email: 'lucas@gmail.com' })
    expect(resultado.valido).toBe(true)
  })

  it('rejeita body nulo', () => {
    const resultado = validarContato(null)
    expect(resultado.valido).toBe(false)
  })
})

// ══════════════════════════════════════════════
// TESTES: rotearAdvogado
// ══════════════════════════════════════════════
describe('rotearAdvogado', () => {

  it('retorna advogado correto para trabalhista', () => {
    const adv = rotearAdvogado('trabalhista')
    expect(adv.nome).toBe('Dr. Rafael Souza')
    expect(adv.area).toBe('Direito trabalhista')
    expect(adv.emailDestino).toBeTruthy()
  })

  it('retorna advogado correto para familia', () => {
    const adv = rotearAdvogado('familia')
    expect(adv.nome).toBe('Dra. Ana Carvalho')
    expect(adv.area).toBe('Direito de familia')
  })

  it('retorna advogado correto para empresarial', () => {
    const adv = rotearAdvogado('empresarial')
    expect(adv.nome).toBe('Dr. Marcos Lima')
  })

  it('todo advogado tem iniciais definidas', () => {
    const areas = ['trabalhista', 'civel', 'familia', 'empresarial', 'criminal', 'previdenciario'] as const
    areas.forEach(area => {
      const adv = rotearAdvogado(area)
      expect(adv.iniciais).toBeTruthy()
      expect(adv.iniciais.length).toBe(2)
    })
  })
})