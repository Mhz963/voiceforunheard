import { loadEnv } from 'vite'
import {
  handleJazzCashInitiate,
  handleJazzCashReturn,
  handleJazzCashVerify,
  handlePaymentConfig,
  handleRefund,
  handleStripeCreateSession,
  handleStripeVerify,
  handleStripeWebhook,
} from '../api/_lib/paymentHandlers.js'

const routes = [
  { method: 'GET', path: '/api/payments/config', handler: handlePaymentConfig },
  { method: 'POST', path: '/api/payments/stripe/create-session', handler: handleStripeCreateSession },
  { method: 'POST', path: '/api/payments/stripe/verify', handler: handleStripeVerify },
  { method: 'POST', path: '/api/payments/stripe/webhook', handler: handleStripeWebhook },
  { method: 'POST', path: '/api/payments/jazzcash/initiate', handler: handleJazzCashInitiate },
  { method: 'POST', path: '/api/payments/jazzcash/verify', handler: handleJazzCashVerify },
  { method: 'GET', path: '/api/payments/jazzcash/return', handler: handleJazzCashReturn },
  { method: 'POST', path: '/api/payments/jazzcash/return', handler: handleJazzCashReturn },
  { method: 'POST', path: '/api/payments/refund', handler: handleRefund },
]

function matchRoute(url, method) {
  const pathname = url.split('?')[0]
  return routes.find((route) => route.path === pathname && route.method === method)
}

function attachPaymentsMiddleware(server) {
  server.middlewares.use(async (req, res, next) => {
    const route = matchRoute(req.url || '', req.method || 'GET')
    if (!route) {
      next()
      return
    }
    try {
      await route.handler(req, res)
    } catch (error) {
      console.error('Payments dev error:', error)
      res.statusCode = 500
      res.end('Payment handler failed')
    }
  })
}

export default function paymentsPlugin() {
  return {
    name: 'payments-api',
    config(_, { mode }) {
      Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
    },
    configureServer: attachPaymentsMiddleware,
    configurePreviewServer: attachPaymentsMiddleware,
  }
}
