import { handleJazzCashInitiate } from '../../_lib/paymentHandlers.js'

export default async function handler(req, res) {
  await handleJazzCashInitiate(req, res)
}
