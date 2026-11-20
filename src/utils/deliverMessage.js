import { CONTACT_EMAIL } from '../config/site'

// Messages go to /api/contact, which forwards them to the educator by
// WhatsApp and email from the server. Her WhatsApp number is a server
// setting only and never appears in the website's code.

export async function sendMessage({ kind, fields, consent, website, startedAt }) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 25000)
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, fields, consent, website, elapsedMs: Date.now() - startedAt }),
      signal: controller.signal,
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || !data.ok) throw new Error(data.error || `HTTP ${response.status}`)
    return data
  } finally {
    clearTimeout(timer)
  }
}

export function buildMessageText(heading, rows) {
  const lines = rows
    .filter(([, value]) => value && String(value).trim())
    .map(([label, value]) => `${label}: ${String(value).trim()}`)
  return [heading, '', ...lines].join('\n')
}

// Fallback if the server cannot deliver: open the visitor's email app.
export function mailtoUrl(subject, body) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
