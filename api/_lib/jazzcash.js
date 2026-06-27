import crypto from 'node:crypto'

const SANDBOX_URL =
  'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/'
const PRODUCTION_URL =
  'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/'

export function getJazzCashConfig() {
  const env = process.env.JAZZCASH_ENV === 'production' ? 'production' : 'sandbox'
  return {
    env,
    merchantId: process.env.JAZZCASH_MERCHANT_ID || '',
    password: process.env.JAZZCASH_PASSWORD || '',
    integritySalt: process.env.JAZZCASH_INTEGRITY_SALT || '',
    returnUrl: process.env.JAZZCASH_RETURN_URL || '',
    actionUrl: env === 'production' ? PRODUCTION_URL : SANDBOX_URL,
  }
}

export function isJazzCashConfigured() {
  const cfg = getJazzCashConfig()
  return !!(cfg.merchantId && cfg.password && cfg.integritySalt && cfg.returnUrl)
}

function jazzCashDateTime() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return (
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  )
}

export function buildJazzCashSecureHash(fields, integritySalt) {
  const sortedKeys = Object.keys(fields)
    .filter(
      (key) =>
        key.startsWith('pp_') &&
        key !== 'pp_SecureHash' &&
        fields[key] !== '' &&
        fields[key] != null,
    )
    .sort()

  const values = sortedKeys.map((key) => String(fields[key])).join('&')
  const message = `${integritySalt}&${values}`

  return crypto.createHmac('sha256', integritySalt).update(message).digest('hex')
}

export function verifyJazzCashResponse(payload, integritySalt) {
  const received = payload.pp_SecureHash || payload.pp_securehash
  if (!received) return false

  const expected = buildJazzCashSecureHash(payload, integritySalt)
  return expected.toLowerCase() === String(received).toLowerCase()
}

export function createJazzCashPaymentFields({ orderId, amountPkr, description, returnUrl }) {
  const cfg = getJazzCashConfig()
  if (!isJazzCashConfigured()) {
    throw new Error('JazzCash is not configured')
  }

  const fields = {
    pp_Version: '1.1',
    pp_TxnType: '',
    pp_Language: 'EN',
    pp_MerchantID: cfg.merchantId,
    pp_SubMerchantID: '',
    pp_Password: cfg.password,
    pp_BankID: 'TBANK',
    pp_ProductID: 'RETL',
    pp_TxnRefNo: orderId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20),
    pp_Amount: String(Math.round(Number(amountPkr) * 100)),
    pp_TxnCurrency: 'PKR',
    pp_TxnDateTime: jazzCashDateTime(),
    pp_BillReference: orderId.slice(0, 20),
    pp_Description: description.slice(0, 200),
    pp_TPP: 'VoiceForUnheard',
    pp_MobileNumber: '',
    pp_CNIC: '',
    pp_ReturnURL: returnUrl || cfg.returnUrl,
  }

  fields.pp_SecureHash = buildJazzCashSecureHash(fields, cfg.integritySalt)
  return { actionUrl: cfg.actionUrl, fields }
}

export function isJazzCashPaymentSuccessful(payload) {
  const code = String(payload.pp_ResponseCode || payload.pp_responsecode || '')
  return code === '000' || code === '121' || code === '200'
}
