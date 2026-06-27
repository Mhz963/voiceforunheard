import { handleJazzCashVerify } from '../../_lib/paymentHandlers.js'

export default async function handler(req, res) {
  await handleJazzCashVerify(req, res)
}
