import { AreaAtuacao, Advogado } from './types'

const ROTEAMENTO: Record<AreaAtuacao, Advogado> = {
  trabalhista: {
    nome: 'Dr. Rafael Souza',
    iniciais: 'RS',
    area: 'Direito trabalhista',
    emailDestino: process.env.EMAIL_TRABALHISTA ?? 'trabalhista@escritorio.com'
  },
  civel: {
    nome: 'Dra. Ana Carvalho',
    iniciais: 'AC',
    area: 'Direito civel',
    emailDestino: process.env.EMAIL_CIVEL ?? 'civel@escritorio.com'
  },
  familia: {
    nome: 'Dra. Ana Carvalho',
    iniciais: 'AC',
    area: 'Direito de familia',
    emailDestino: process.env.EMAIL_FAMILIA ?? 'familia@escritorio.com'
  },
  empresarial: {
    nome: 'Dr. Marcos Lima',
    iniciais: 'ML',
    area: 'Direito empresarial',
    emailDestino: process.env.EMAIL_EMPRESARIAL ?? 'empresarial@escritorio.com'
  },
  criminal: {
    nome: 'Dr. Rafael Souza',
    iniciais: 'RS',
    area: 'Direito criminal',
    emailDestino: process.env.EMAIL_CRIMINAL ?? 'criminal@escritorio.com'
  },
  previdenciario: {
    nome: 'Dra. Ana Carvalho',
    iniciais: 'AC',
    area: 'Direito previdenciario',
    emailDestino: process.env.EMAIL_PREVIDENCIARIO ?? 'previdenciario@escritorio.com'
  }
}

export function rotearAdvogado(area: AreaAtuacao): Advogado {
  return ROTEAMENTO[area]
}