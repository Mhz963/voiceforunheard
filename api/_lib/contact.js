/* global process */
// Delivers contact / consultation messages to the educator by WhatsApp and
// email from the server, so her phone number never appears on the website.
//
// Server environment variables (set in Vercel → Project → Settings → Environment Variables):
//   WHATSAPP_TO        Educator's WhatsApp number, international format (e.g. +92300...)
//   CALLMEBOT_APIKEY   Key from CallMeBot for that number (free WhatsApp notifications)
//   CONTACT_TO_EMAIL   Address that receives messages
//   RESEND_API_KEY     Key from resend.com for sending email
//   RESEND_FROM        Optional sender, default "VoiceForUnheard <onboarding@resend.dev>"
//
// Nothing is stored: the message is forwarded and then discarded.

const LIMITS = { name: 120, phone: 40, email: 160, city: 80, age: 60, concern: 120, contactBy: 40, role: 80, message: 3000 }
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const recent = new Map() // ip -> timestamps (per server instance; a light brake on spam)

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') {
      resolve(req.body)
      return
    }
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 20000) {
        reject(new Error('too large'))
        req.destroy()
      }
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  return (typeof fwd === 'string' ? fwd.split(',')[0] : '') || req.socket?.remoteAddress || 'unknown'
}

function rateLimited(ip) {
  const now = Date.now()
  const list = (recent.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  list.push(now)
  recent.set(ip, list)
  return list.length > RATE_MAX
}

function clean(value, max) {
  return String(value ?? '')
    // eslint-disable-next-line no-control-regex -- strip control characters
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
    .trim()
    .slice(0, max)
}

const LABELS = {
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  city: 'City',
  age: "Child's age",
  concern: 'Concern',
  contactBy: 'Contact by',
  role: 'Role',
  message: 'Message',
}

export function buildText(kind, fields) {
  const heading = kind === 'consultation' ? 'New consultation request' : 'New message from the Contact page'
  const lines = Object.keys(LABELS)
    .filter((k) => fields[k])
    .map((k) => `${LABELS[k]}: ${fields[k]}`)
  return [`VoiceForUnheard — ${heading}`, '', ...lines].join('\n')
}

async function withTimeout(promise, ms) {
  let timer
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('timeout')), ms)
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

async function sendWhatsApp(text) {
  const phone = (process.env.WHATSAPP_TO || '').replace(/[^\d+]/g, '')
  const apikey = process.env.CALLMEBOT_APIKEY || ''
  if (!phone || !apikey) return 'not_configured'
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`
  const response = await withTimeout(fetch(url), 12000)
  const body = await response.text()
  if (!response.ok || /error|invalid|not\s+allowed/i.test(body.slice(0, 500))) {
    throw new Error(`WhatsApp gateway responded ${response.status}`)
  }
  return 'sent'
}

async function sendEmail(kind, text, replyTo) {
  const key = process.env.RESEND_API_KEY || ''
  const to = process.env.CONTACT_TO_EMAIL || ''
  if (!key || !to) return 'not_configured'
  const payload = {
    from: process.env.RESEND_FROM || 'VoiceForUnheard <onboarding@resend.dev>',
    to: [to],
    subject: kind === 'consultation' ? 'New consultation request — VoiceForUnheard' : 'New message — VoiceForUnheard',
    text,
  }
  if (replyTo) payload.reply_to = replyTo
  const response = await withTimeout(
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    12000,
  )
  if (!response.ok) throw new Error(`Email service responded ${response.status}`)
  return 'sent'
}

export async function handleContact(req, res) {
  if (req.method !== 'POST') {
    send(res, 405, { error: 'method_not_allowed' })
    return
  }

  let body
  try {
    body = await readJsonBody(req)
  } catch {
    send(res, 400, { error: 'bad_request' })
    return
  }

  // Bots fill hidden fields and submit instantly; people do neither.
  if (body.website || Number(body.elapsedMs) < 2500) {
    send(res, 200, { ok: true, delivered: { whatsapp: false, email: false } })
    return
  }

  if (rateLimited(clientIp(req))) {
    send(res, 429, { error: 'too_many_requests' })
    return
  }

  const kind = body.kind === 'consultation' ? 'consultation' : 'contact'
  const fields = {}
  for (const [key, max] of Object.entries(LIMITS)) fields[key] = clean(body.fields?.[key], max)

  if (!fields.name || (!fields.phone && !fields.email) || body.consent !== true) {
    send(res, 400, { error: 'missing_fields' })
    return
  }
  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) ? fields.email : ''

  const text = buildText(kind, fields)
  const [whatsapp, email] = await Promise.allSettled([sendWhatsApp(text), sendEmail(kind, text, replyTo)])
  const status = (r) => (r.status === 'fulfilled' ? r.value : 'failed')
  const result = { whatsapp: status(whatsapp), email: status(email) }

  if (whatsapp.status === 'rejected') console.error('Contact WhatsApp failed:', whatsapp.reason?.message)
  if (email.status === 'rejected') console.error('Contact email failed:', email.reason?.message)

  if (result.whatsapp === 'sent' || result.email === 'sent') {
    send(res, 200, { ok: true, delivered: { whatsapp: result.whatsapp === 'sent', email: result.email === 'sent' } })
  } else if (result.whatsapp === 'not_configured' && result.email === 'not_configured') {
    send(res, 503, { error: 'not_configured' })
  } else {
    send(res, 502, { error: 'delivery_failed' })
  }
}
