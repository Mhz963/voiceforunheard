import { handleRefund } from '../../_lib/paymentHandlers.js'

export default async function handler(req, res) {
  await handleRefund(req, res)
}
