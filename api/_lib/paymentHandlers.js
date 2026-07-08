import { getSessionPricesFromEnv, usdToCents } from '../../shared/paymentConfig.js'
import { getStripe, isStripeConfigured } from '../_lib/stripe.js'
import { isJazzCashConfigured } from '../_lib/jazzcash.js'

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') {
      resolve(req.body)
      return
    }
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? JSON.parse(raw) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function getOrigin(req) {
  if (req.headers.origin) return req.headers.origin
  if (req.headers.referer) {
    try {
      return new URL(req.headers.referer).origin
    } catch {
      /* ignore */
    }
  }
  const host = req.headers.host || 'localhost:5173'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

function createOrderId() {
  return `vfu_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function getJazzCashManualConfig() {
  const merchantAccount = (process.env.JAZZCASH_MERCHANT_ACCOUNT || '').trim()
  const enabled =
    process.env.JAZZCASH_MANUAL_ENABLED === 'true' ||
    process.env.JAZZCASH_MANUAL_ENABLED === '1' ||
    Boolean(merchantAccount)

  return {
    enabled,
    merchantAccount,
  }
}

export async function handlePaymentConfig(_req, res) {
  const prices = getSessionPricesFromEnv(process.env)
  const jazzcashHosted = isJazzCashConfigured()
  const jazzcashManual = getJazzCashManualConfig()
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(
    JSON.stringify({
      sessionPricePkr: prices.pkr,
      sessionPriceUsd: prices.usd,
      refundPolicyDays: 7,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      stripeEnabled: isStripeConfigured(),
      jazzcashEnabled: jazzcashHosted || jazzcashManual.enabled,
      jazzcashHostedEnabled: jazzcashHosted,
      jazzcashManualEnabled: jazzcashManual.enabled && !jazzcashHosted,
      jazzcashManual: jazzcashManual.enabled
        ? {
            merchantAccount: jazzcashManual.merchantAccount,
          }
        : null,
    }),
  )
}

export async function handleStripeCreateSession(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end('Method not allowed')
    return
  }

  try {
    const stripe = getStripe()
    if (!stripe) {
      res.statusCode = 503
      res.end(JSON.stringify({ error: 'Stripe is not configured' }))
      return
    }

    const body = await readJsonBody(req)
    const { booking, parent } = body
    if (!booking?.date || !booking?.time || !parent?.id || !parent?.email) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: 'Missing booking or parent details' }))
      return
    }

    const prices = getSessionPricesFromEnv(process.env)
    const orderId = createOrderId()
    const origin = getOrigin(req)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: parent.email,
      payment_method_types: ['card'],
      wallet_options: {
        link: { display: 'never' },
      },
      billing_address_collection: 'auto',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: usdToCents(prices.usd),
            product_data: {
              name: 'VoiceForUnheard — Video Therapy Session',
              description: `Session on ${booking.date} at ${booking.time} for ${parent.childName || 'learner'}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/payment/return?provider=stripe&order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/portal/parent?tab=meetings&payment=cancelled`,
      metadata: {
        orderId,
        product: 'session',
        parentId: parent.id,
        parentName: parent.name || '',
        childName: parent.childName || '',
        email: parent.email,
        date: booking.date,
        time: booking.time,
        agenda: (booking.agenda || '').slice(0, 500),
      },
    })

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ url: session.url, orderId, sessionId: session.id }))
  } catch (error) {
    console.error('Stripe session error:', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Could not start Stripe checkout' }))
  }
}

export async function handleStripeVerify(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end('Method not allowed')
    return
  }

  try {
    const stripe = getStripe()
    if (!stripe) {
      res.statusCode = 503
      res.end(JSON.stringify({ error: 'Stripe is not configured' }))
      return
    }

    const body = await readJsonBody(req)
    const sessionId = body.sessionId
    if (!sessionId) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: 'Missing sessionId' }))
      return
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    })

    if (session.payment_status !== 'paid') {
      res.statusCode = 402
      res.end(JSON.stringify({ error: 'Payment not completed', status: session.payment_status }))
      return
    }

    const paymentIntent =
      typeof session.payment_intent === 'object' ? session.payment_intent : null

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        paid: true,
        provider: 'stripe',
        orderId: session.metadata?.orderId,
        providerPaymentId: paymentIntent?.id || session.payment_intent,
        currency: 'USD',
        amount: session.amount_total ? session.amount_total / 100 : null,
        booking: {
          parentId: session.metadata?.parentId,
          parentName: session.metadata?.parentName,
          childName: session.metadata?.childName,
          email: session.metadata?.email,
          date: session.metadata?.date,
          time: session.metadata?.time,
          agenda: session.metadata?.agenda,
        },
      }),
    )
  } catch (error) {
    console.error('Stripe verify error:', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Verification failed' }))
  }
}

export async function handleStripeWebhook(req, res) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !webhookSecret) {
    res.statusCode = 503
    res.end('Webhook not configured')
    return
  }

  try {
    const rawBody = await readRawBody(req)
    const signature = req.headers['stripe-signature']
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)

    if (event.type === 'checkout.session.completed') {
      console.log('Stripe payment completed:', event.data.object.id)
    }

    res.statusCode = 200
    res.end(JSON.stringify({ received: true }))
  } catch (error) {
    console.error('Stripe webhook error:', error)
    res.statusCode = 400
    res.end(`Webhook Error: ${error.message}`)
  }
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export async function handleJazzCashInitiate(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end('Method not allowed')
    return
  }

  try {
    const { createJazzCashPaymentFields, isJazzCashConfigured } = await import('../_lib/jazzcash.js')
    if (!isJazzCashConfigured()) {
      res.statusCode = 503
      res.end(JSON.stringify({ error: 'JazzCash is not configured' }))
      return
    }

    const body = await readJsonBody(req)
    const { booking, parent } = body
    if (!booking?.date || !booking?.time || !parent?.id) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: 'Missing booking or parent details' }))
      return
    }

    const prices = getSessionPricesFromEnv(process.env)
    const orderId = createOrderId()
    const origin = getOrigin(req)
    const returnUrl = `${origin}/api/payments/jazzcash/return`

    const { actionUrl, fields } = createJazzCashPaymentFields({
      orderId,
      amountPkr: prices.pkr,
      description: `VFU session ${booking.date} ${booking.time}`,
      returnUrl,
    })

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ actionUrl, fields, orderId }))
  } catch (error) {
    console.error('JazzCash initiate error:', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Could not start JazzCash payment' }))
  }
}

export async function handleJazzCashVerify(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end('Method not allowed')
    return
  }

  try {
    const {
      verifyJazzCashResponse,
      isJazzCashPaymentSuccessful,
      getJazzCashConfig,
    } = await import('../_lib/jazzcash.js')

    const body = await readJsonBody(req)
    const { payload, pendingBooking } = body

    if (!payload || !pendingBooking) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: 'Missing payment payload' }))
      return
    }

    const cfg = getJazzCashConfig()
    if (!verifyJazzCashResponse(payload, cfg.integritySalt)) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: 'Invalid JazzCash signature' }))
      return
    }

    if (!isJazzCashPaymentSuccessful(payload)) {
      res.statusCode = 402
      res.end(
        JSON.stringify({
          error: 'Payment failed',
          responseCode: payload.pp_ResponseCode,
          message: payload.pp_ResponseMessage,
        }),
      )
      return
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        paid: true,
        provider: 'jazzcash',
        orderId: pendingBooking.orderId,
        providerPaymentId: payload.pp_TxnRefNo || payload.pp_RetreivalReferenceNo,
        currency: 'PKR',
        amount: pendingBooking.amountPkr,
        booking: pendingBooking.booking,
        parent: pendingBooking.parent,
      }),
    )
  } catch (error) {
    console.error('JazzCash verify error:', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Verification failed' }))
  }
}

export async function handleJazzCashReturn(req, res) {
  try {
    const origin = getOrigin(req)

    let payload = {}
    if (req.method === 'POST') {
      payload = await readFormBody(req)
    } else {
      payload = Object.fromEntries(new URL(req.url, `${origin}/`).searchParams)
    }

    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
    res.statusCode = 302
    res.setHeader('Location', `${origin}/payment/return?provider=jazzcash&data=${encoded}`)
    res.end()
  } catch (error) {
    console.error('JazzCash return error:', error)
    const origin = getOrigin(req)
    res.statusCode = 302
    res.setHeader('Location', `${origin}/payment/return?provider=jazzcash&error=return_failed`)
    res.end()
  }
}

function readFormBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      const params = new URLSearchParams(raw)
      const payload = {}
      params.forEach((value, key) => {
        payload[key] = value
      })
      resolve(payload)
    })
    req.on('error', reject)
  })
}

export async function handleRefund(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end('Method not allowed')
    return
  }

  try {
    const body = await readJsonBody(req)
    const { provider, providerPaymentId, reason } = body

    if (!provider || !providerPaymentId) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: 'Missing payment details' }))
      return
    }

    if (provider === 'stripe') {
      const stripe = getStripe()
      if (!stripe) {
        res.statusCode = 503
        res.end(JSON.stringify({ error: 'Stripe is not configured' }))
        return
      }

      const refund = await stripe.refunds.create({
        payment_intent: providerPaymentId,
        reason: 'requested_by_customer',
        metadata: { reason: reason || 'Not satisfied' },
      })

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ refunded: true, provider: 'stripe', refundId: refund.id }))
      return
    }

    if (provider === 'jazzcash') {
      res.statusCode = 501
      res.end(
        JSON.stringify({
          error:
            'JazzCash refunds are processed through the merchant portal. Contact support with your transaction ID.',
          providerPaymentId,
        }),
      )
      return
    }

    res.statusCode = 400
    res.end(JSON.stringify({ error: 'Unknown provider' }))
  } catch (error) {
    console.error('Refund error:', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: error.message || 'Refund failed' }))
  }
}
