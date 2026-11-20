import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '../config/site'

// Messages are delivered through the visitor's own WhatsApp or email app, so
// nothing a family types is stored on the website. Once a backend exists,
// this can POST to an API instead.

export function buildMessageText(heading, rows) {
  const lines = rows
    .filter(([, value]) => value && String(value).trim())
    .map(([label, value]) => `${label}: ${String(value).trim()}`)
  return [heading, '', ...lines].join('\n')
}

export function whatsappUrl(text) {
  if (!WHATSAPP_NUMBER) return null
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

export function mailtoUrl(subject, body) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function openDeliveryLink(url) {
  if (!url) return
  if (url.startsWith('mailto:')) {
    window.location.href = url
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

export const hasWhatsApp = Boolean(WHATSAPP_NUMBER)
