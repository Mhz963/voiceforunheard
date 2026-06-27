import { useEffect, useState } from 'react'
import { HiCreditCard, HiCurrencyDollar } from 'react-icons/hi'
import { useLanguage } from '../../i18n/LanguageContext'
import {
  fetchPaymentConfig,
  startJazzCashCheckout,
  startStripeCheckout,
  submitJazzCashForm,
} from '../../services/payments'
import { savePendingPayment } from '../../services/parentStorage'
import './SessionCheckout.css'

function formatPrice(currency, config) {
  if (currency === 'PKR') {
    return `Rs ${Number(config.sessionPricePkr).toLocaleString()}`
  }
  return `$${Number(config.sessionPriceUsd)}`
}

export default function SessionCheckout({ booking, parent, disabled, onError }) {
  const { t } = useLanguage()
  const [currency, setCurrency] = useState('PKR')
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(false)
  const [configError, setConfigError] = useState('')

  useEffect(() => {
    fetchPaymentConfig()
      .then(setConfig)
      .catch(() => setConfigError(t('payments.configError')))
  }, [t])

  if (configError) {
    return <div className="parent-portal__alert parent-portal__alert--error">{configError}</div>
  }

  if (!config) {
    return <p className="parent-portal__auth-sub">{t('common.loading')}</p>
  }

  const provider = currency === 'PKR' ? 'jazzcash' : 'stripe'
  const providerEnabled = currency === 'PKR' ? config.jazzcashEnabled : config.stripeEnabled

  async function handlePay(e) {
    e.preventDefault()
    if (disabled || loading || !providerEnabled) return

    setLoading(true)
    onError?.('')

    const pendingBase = {
      booking,
      parent: {
        id: parent.id,
        name: parent.name,
        email: parent.email,
        childName: parent.childName,
      },
      currency,
      provider,
    }

    try {
      if (provider === 'stripe') {
        const { url, orderId } = await startStripeCheckout({ booking, parent })
        savePendingPayment({
          ...pendingBase,
          orderId,
          amountUsd: config.sessionPriceUsd,
        })
        window.location.href = url
        return
      }

      const { actionUrl, fields, orderId } = await startJazzCashCheckout({ booking, parent })
      savePendingPayment({
        ...pendingBase,
        orderId,
        amountPkr: config.sessionPricePkr,
      })
      submitJazzCashForm(actionUrl, fields)
    } catch (err) {
      onError?.(err.message || t('payments.checkoutError'))
      setLoading(false)
    }
  }

  return (
    <div className={`session-checkout ${loading ? 'session-checkout__paying' : ''}`}>
      <fieldset className="session-checkout__currency">
        <legend className="visually-hidden">{t('payments.selectCurrency')}</legend>
        <label>
          <input
            type="radio"
            name="currency"
            value="PKR"
            checked={currency === 'PKR'}
            onChange={() => setCurrency('PKR')}
          />
          <span>{t('payments.pkr')}</span>
        </label>
        <label>
          <input
            type="radio"
            name="currency"
            value="USD"
            checked={currency === 'USD'}
            onChange={() => setCurrency('USD')}
          />
          <span>{t('payments.usd')}</span>
        </label>
      </fieldset>

      <p className="session-checkout__price">{formatPrice(currency, config)}</p>
      <p className="session-checkout__provider">
        {currency === 'PKR' ? t('payments.payWithJazzCash') : t('payments.payWithStripe')}
        {!providerEnabled && ` — ${t('payments.providerUnavailable')}`}
      </p>

      <button
        type="button"
        className="btn btn--primary btn--block"
        disabled={disabled || loading || !providerEnabled}
        onClick={handlePay}
      >
        {currency === 'PKR' ? <HiCreditCard /> : <HiCurrencyDollar />}
        {loading ? t('payments.redirecting') : t('payments.payAndBook')}
      </button>

      <p className="session-checkout__refund-note">
        {t('payments.refundPolicy', { days: config.refundPolicyDays })}
      </p>
    </div>
  )
}
