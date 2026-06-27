import { handleStripeCreateSession } from '../../_lib/paymentHandlers.js'

export default async function handler(req, res) {
  await handleStripeCreateSession(req, res)
}
