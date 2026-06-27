import { handlePaymentConfig } from '../_lib/paymentHandlers.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).end('Method not allowed')
    return
  }
  await handlePaymentConfig(req, res)
}
