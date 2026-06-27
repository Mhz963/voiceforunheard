import { handleStripeVerify } from '../../../_lib/paymentHandlers.js'

export default async function handler(req, res) {
  await handleStripeVerify(req, res)
}
