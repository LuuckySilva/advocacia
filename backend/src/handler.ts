import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { validarContato } from './validator'
import { rotearAdvogado } from './router'
import { ContatoBody, ApiResponse } from './types'

// ── CLIENTE SES ───────────────────────────────────────────────
const ses = new SESClient({ region: process.env.AWS_REGION ?? 'us-east-1' })

// ── HEADERS CORS ──────────────────────────────────────────────
const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

// ── HELPER: RESPOSTA ─────────────────────────────────────────
function resposta(statusCode: number, body: ApiResponse): APIGatewayProxyResult {
  return {
    statusCode,
    headers: HEADERS,
    body: JSON.stringify(body)
  }
}

// ── TEMPLATE E-MAIL PARA O ADVOGADO ──────────────────────────
function emailAdvogado(data: ContatoBody, advNome: string): string {
  return `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #111; border-bottom: 2px solid #d4af6a; padding-bottom: 8px;">
        Novo caso recebido — ${data.area.charAt(0).toUpperCase() + data.area.slice(1)}
      </h2>
      <p>Olá, <strong>${advNome}</strong>. Um novo caso foi encaminhado para você.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr style="background: #faf9f6;">
          <td style="padding: 10px; font-weight: bold; width: 180px;">Nome</td>
          <td style="padding: 10px;">${data.nome}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">CPF</td>
          <td style="padding: 10px;">${data.cpf}</td>
        </tr>
        <tr style="background: #faf9f6;">
          <td style="padding: 10px; font-weight: bold;">Telefone / WhatsApp</td>
          <td style="padding: 10px;">${data.telefone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">E-mail</td>
          <td style="padding: 10px;">${data.email ?? 'Não informado'}</td>
        </tr>
        <tr style="background: #faf9f6;">
          <td style="padding: 10px; font-weight: bold;">Nº do processo</td>
          <td style="padding: 10px;">${data.numeroProcesso ?? 'Não informado'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Canal preferido</td>
          <td style="padding: 10px;">${data.canal}</td>
        </tr>
      </table>
      <h3 style="margin-top: 24px; color: #111;">Descrição do caso</h3>
      <p style="background: #faf9f6; padding: 16px; border-left: 3px solid #d4af6a; border-radius: 4px; line-height: 1.6;">
        ${data.descricao}
      </p>
      <p style="font-size: 12px; color: #9a9080; margin-top: 32px;">
        Retorno solicitado em até 24 horas — Escritório de Advocacia
      </p>
    </body>
    </html>
  `
}

// ── TEMPLATE E-MAIL DE CONFIRMAÇÃO PARA O CLIENTE ────────────
function emailCliente(data: ContatoBody, advNome: string, advArea: string): string {
  return `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #111; border-bottom: 2px solid #d4af6a; padding-bottom: 8px;">
        Solicitação recebida com sucesso
      </h2>
      <p>Olá, <strong>${data.nome}</strong>.</p>
      <p>Sua solicitação foi recebida e encaminhada para o responsável pela área de <strong>${advArea}</strong>.</p>
      <div style="background: #faf8f3; border: 1px solid #d4af6a; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; font-weight: bold; color: #d4af6a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">
          Advogado responsável
        </p>
        <p style="margin: 8px 0 0; font-size: 18px; font-weight: bold; color: #111;">${advNome}</p>
        <p style="margin: 4px 0 0; color: #6b6458;">${advArea}</p>
      </div>
      <p style="color: #3a3830;">
        Você receberá um retorno em até <strong>24 horas</strong> pelo canal informado: <strong>${data.canal}</strong>.
      </p>
      <p style="font-size: 12px; color: #9a9080; margin-top: 32px;">
        Escritório de Advocacia — Este é um e-mail automático, não responda.
      </p>
    </body>
    </html>
  `
}

// ── HANDLER PRINCIPAL ─────────────────────────────────────────
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  // Trata preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: HEADERS, body: '' }
  }

  // Parse do body
  let body: unknown
  try {
    body = JSON.parse(event.body ?? '{}')
  } catch {
    return resposta(400, { success: false, message: 'Body inválido — JSON malformado' })
  }

  // Validação
  const { valido, erros } = validarContato(body)
  if (!valido) {
    return resposta(400, { success: false, message: erros.join(' | ') })
  }

  const data = body as ContatoBody
  const advogado = rotearAdvogado(data.area)
  const fromEmail = process.env.SES_FROM_EMAIL ?? ''

  try {
    // E-mail 1 — para o advogado responsável
    await ses.send(new SendEmailCommand({
      Source: fromEmail,
      Destination: { ToAddresses: [advogado.emailDestino] },
      Message: {
        Subject: { Data: `[Novo caso] ${data.area} — ${data.nome}`, Charset: 'UTF-8' },
        Body: { Html: { Data: emailAdvogado(data, advogado.nome), Charset: 'UTF-8' } }
      }
    }))

    // E-mail 2 — confirmação para o cliente (só se informou e-mail)
    if (data.email) {
      await ses.send(new SendEmailCommand({
        Source: fromEmail,
        Destination: { ToAddresses: [data.email] },
        Message: {
          Subject: { Data: 'Sua solicitação foi recebida — Escritório de Advocacia', Charset: 'UTF-8' },
          Body: { Html: { Data: emailCliente(data, advogado.nome, advogado.area), Charset: 'UTF-8' } }
        }
      }))
    }

    return resposta(200, {
      success: true,
      message: `Caso encaminhado com sucesso para ${advogado.nome}`,
      advogado: { nome: advogado.nome, area: advogado.area }
    })

  } catch (err) {
    console.error('Erro ao enviar e-mail via SES:', err)
    return resposta(500, { success: false, message: 'Erro interno ao processar solicitação' })
  }
}