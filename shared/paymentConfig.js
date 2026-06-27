export const DEFAULT_SESSION_PRICE_PKR = 5000
export const DEFAULT_SESSION_PRICE_USD = 50
export const REFUND_POLICY_DAYS = 7

export function getSessionPricesFromEnv(env = {}) {
  const pkr = Number(env.SESSION_PRICE_PKR || env.VITE_SESSION_PRICE_PKR || DEFAULT_SESSION_PRICE_PKR)
  const usd = Number(env.SESSION_PRICE_USD || env.VITE_SESSION_PRICE_USD || DEFAULT_SESSION_PRICE_USD)
  return { pkr, usd }
}

export function getSessionPrice(currency, prices) {
  if (currency === 'PKR') {
    return {
      amount: prices.pkr,
      currency: 'PKR',
      display: `Rs ${prices.pkr.toLocaleString()}`,
    }
  }
  return {
    amount: prices.usd,
    currency: 'USD',
    display: `$${prices.usd}`,
  }
}

export function pkrToPaisa(pkr) {
  return Math.round(Number(pkr) * 100)
}

export function usdToCents(usd) {
  return Math.round(Number(usd) * 100)
}
