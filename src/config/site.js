// Central site + feature configuration.
//
// Feature flags are read at build time from Vite env vars, so a disabled
// feature is removed from the shipped JavaScript bundle entirely.

// The parent / educator / super-admin portals keep their data in the
// visitor's browser (localStorage) and check sign-in in the browser. That is
// only safe as a single-device demo, so the portals stay OFF in production
// until a real backend (server-side auth + database) is in place.
export const PORTAL_ENABLED = import.meta.env.VITE_PORTAL_ENABLED === 'true'

// Payments depend on bookings that currently live only in the payer's browser.
// Keep them OFF until bookings are stored server-side. The API enforces this
// separately with PAYMENTS_ENABLED.
export const PAYMENTS_ENABLED = import.meta.env.VITE_PAYMENTS_ENABLED === 'true'

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://voiceforunheard.vercel.app').replace(/\/$/, '')

// Where consultation requests and contact messages are delivered.
// TODO: move to a platform address on a custom domain (e.g. contact@voiceforunheard.org).
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'binteanayat@gmail.com'

// The educator's WhatsApp number is NOT configured here: it is a server-only
// setting (WHATSAPP_TO) used by api/contact.js, so it never reaches visitors.

export const EDUCATOR_PORTFOLIO_URL = 'https://maria-speech-therapist.vercel.app/'
