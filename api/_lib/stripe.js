import Stripe from 'stripe'

let stripeClient = null

export function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) return null
  if (!stripeClient) {
    stripeClient = new Stripe(secret)
  }
  return stripeClient
}

export function isStripeConfigured() {
  return !!process.env.STRIPE_SECRET_KEY
}

export function getStripePublishableKey() {
  return process.env.STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
}
