import { handleStripeWebhook } from '../../_lib/paymentHandlers.js'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  await handleStripeWebhook(req, res)
}
