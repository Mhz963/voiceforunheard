const API = '/api/payments'

async function parseJsonResponse(res) {
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('Payment server returned an invalid response. Please refresh and try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Payment request failed')
  }
  return data
}

export async function fetchPaymentConfig() {
  const res = await fetch(`${API}/config`)
  return parseJsonResponse(res)
}

export async function startStripeCheckout({ booking, parent }) {
  const res = await fetch(`${API}/stripe/create-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ booking, parent }),
  })
  return parseJsonResponse(res)
}

export async function startJazzCashCheckout({ booking, parent }) {
  const res = await fetch(`${API}/jazzcash/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ booking, parent }),
  })
  return parseJsonResponse(res)
}

export function submitJazzCashForm(actionUrl, fields) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = actionUrl
  form.style.display = 'none'

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = String(value)
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
}

export async function verifyStripeSession(sessionId) {
  const res = await fetch(`${API}/stripe/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  })
  return parseJsonResponse(res)
}

export async function verifyJazzCashPayment(payload, pendingBooking) {
  const res = await fetch(`${API}/jazzcash/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload, pendingBooking }),
  })
  return parseJsonResponse(res)
}

export async function requestRefund(provider, providerPaymentId, reason = 'Not satisfied') {
  const res = await fetch(`${API}/refund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, providerPaymentId, reason }),
  })
  return parseJsonResponse(res)
}
