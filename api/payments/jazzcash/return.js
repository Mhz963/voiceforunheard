import { handleJazzCashReturn } from '../../_lib/paymentHandlers.js'

export default async function handler(req, res) {
  await handleJazzCashReturn(req, res)
}
