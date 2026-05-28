# Escritório de Advocacia — Site Institucional

Site institucional completo para escritório de advocacia com formulário inteligente de roteamento de casos, backend serverless na AWS e envio de e-mail automatizado.

---

## Tecnologias

**Frontend**
- HTML5, CSS3, JavaScript (ES2020)
- Design responsivo sem frameworks — mobile-first

**Backend**
- Node.js + TypeScript
- AWS Lambda (serverless)
- AWS API Gateway (HTTP REST)
- AWS SES (envio de e-mail)
- AWS SAM (deploy e infraestrutura como código)

**Testes**
- Jest + ts-jest
- 28 testes cobrindo validação, roteamento e regras de negócio

---

## Funcionalidades

- Hero com imagem de fundo e paleta dourada/off-white
- 6 áreas de atuação com curiosidades jurídicas baseadas em lei vigente
- Seção de depoimentos por área
- Prévia de orçamento interativa com tabs por área (baseada na Tabela OAB)
- Formulário inteligente de contato com:
  - Validação de CPF com dígito verificador
  - Máscara automática de CPF e telefone
  - Roteamento automático por área de atuação
  - Exibição do advogado responsável em tempo real
  - Escolha do canal de confirmação (WhatsApp, e-mail ou ligação)
  - Envio de e-mail ao advogado com dados do caso via AWS SES
  - Confirmação automática ao cliente por e-mail
  - Tela de sucesso com nome e área do advogado responsável

---

## Estrutura do projeto

```
advocacia/
├── index.html          # Página home
├── contato.html        # Página de contato com formulário
├── style.css           # Estilos globais
├── contato.css         # Estilos da página de contato
├── script.js           # Scripts da home (tabs de orçamento, animações)
├── contato.js          # Lógica do formulário + integração com API
└── backend/
    ├── src/
    │   ├── handler.ts          # Lambda handler principal
    │   ├── validator.ts        # Validação dos campos do formulário
    │   ├── router.ts           # Roteamento por área de atuação
    │   ├── types.ts            # Interfaces e tipos TypeScript
    │   └── handler.test.ts     # Testes Jest (28 testes)
    ├── template.yaml           # Infraestrutura AWS SAM
    ├── tsconfig.json           # Configuração TypeScript
    ├── jest.config.js          # Configuração Jest
    ├── package.json
    └── .env.example            # Variáveis de ambiente necessárias
```

---

## Como rodar localmente

**Pré-requisitos**
- Node.js 18+
- AWS CLI configurado (`aws configure`)
- AWS SAM CLI instalado

**Frontend**
```bash
# Abra index.html ou contato.html com Live Server (VS Code)
# ou qualquer servidor HTTP estático
```

**Backend**
```bash
cd backend
npm install
npm test          # roda os 28 testes Jest
npm run build     # compila TypeScript para dist/
```

**Deploy AWS**
```bash
cd backend
npm run build
sam build
sam deploy --guided
```

---

## Variáveis de ambiente

Crie um arquivo `.env` em `backend/` baseado no `.env.example`:

```env
AWS_REGION=us-east-1
SES_FROM_EMAIL=seuemail@gmail.com
EMAIL_TRABALHISTA=trabalhista@escritorio.com
EMAIL_CIVEL=civel@escritorio.com
EMAIL_FAMILIA=familia@escritorio.com
EMAIL_EMPRESARIAL=empresarial@escritorio.com
EMAIL_CRIMINAL=criminal@escritorio.com
EMAIL_PREVIDENCIARIO=previdenciario@escritorio.com
```

> O e-mail remetente precisa estar verificado no AWS SES antes do deploy.

---

## Fluxo do formulário

```
Cliente preenche formulário
        ↓
POST /contato (API Gateway)
        ↓
Lambda valida os dados (TypeScript)
        ↓
Roteamento por área de atuação
        ↓
AWS SES dispara dois e-mails:
  → Advogado responsável (dados completos do caso)
  → Cliente (confirmação com nome do advogado e prazo de 24h)
```

---

## Testes

```bash
cd backend
npm test
```

```
PASS  src/handler.test.ts
  validarCPF         6 testes
  validarEmail       5 testes
  validarTelefone    5 testes
  validarContato     8 testes
  rotearAdvogado     4 testes

Tests: 28 passed, 28 total
```

---

## Autor

**Lucas Silva**
- GitHub: [github.com/LuuckySilva](https://github.com/LuuckySilva)
- LinkedIn: [linkedin.com/in/olucas-silvaa](https://linkedin.com/in/olucas-silvaa)