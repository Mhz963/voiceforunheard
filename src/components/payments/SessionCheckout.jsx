import { useEffect, useState } from 'react'
import { HiCash, HiCurrencyDollar, HiDuplicate, HiMail } from 'react-icons/hi'
import { useLanguage } from '../../i18n/LanguageContext'
import { usePortalConfig } from '../../i18n/usePortalConfig'
import {
  fetchPaymentConfig,
  startStripeCheckout,
} from '../../services/payments'
import { addMeeting, savePendingPayment } from '../../services/parentStorage'
import './SessionCheckout.css'

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function createOrderId() {
  return `vfu_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function formatPrice(currency, config) {
  if (currency === 'PKR') {
    return `Rs ${Number(config.sessionPricePkr).toLocaleString()}`
  }
  return `$${Number(config.sessionPriceUsd)}`
}

function pickDefaultCurrency(config) {
  if (config.jazzcashEnabled) return 'PKR'
  if (config.stripeEnabled) return 'USD'
  return 'USD'
}

function copyText(value) {
  if (!value) return Promise.reject(new Error('Nothing to copy'))
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value)
  }
  return Promise.reject(new Error('Clipboard unavailable'))
}

export default function SessionCheckout({ booking, parent, disabled, onError, onBooked }) {
  const { t } = useLanguage()
  const portalConfig = usePortalConfig()
  const [config, setConfig] = useState(null)
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(false)
  const [configError, setConfigError] = useState('')
  const [manualPhase, setManualPhase] = useState(null)
  const [txnRef, setTxnRef] = useState('')
  const [copyMsg, setCopyMsg] = useState('')

  useEffect(() => {
    fetchPaymentConfig()
      .then((nextConfig) => {
        setConfig(nextConfig)
        setCurrency(pickDefaultCurrency(nextConfig))
      })
      .catch(() => setConfigError(t('payments.configError')))
  }, [t])

  if (configError) {
    return <div className="parent-portal__alert parent-portal__alert--error">{configError}</div>
  }

  if (!config) {
    return <p className="parent-portal__auth-sub">{t('common.loading')}</p>
  }

  const useManualPkr = currency === 'PKR' && config.jazzcashManualEnabled && config.jazzcashManual
  const providerEnabled = currency === 'PKR' ? config.jazzcashEnabled : config.stripeEnabled
  const checkoutBlocked = disabled || loading || !providerEnabled

  async function handleCopy(value) {
    try {
      await copyText(value)
      setCopyMsg(t('payments.copied'))
      window.setTimeout(() => setCopyMsg(''), 2000)
    } catch {
      setCopyMsg('')
    }
  }

  function handleStartManual() {
    if (checkoutBlocked) return
    onError?.('')
    setManualPhase('pay')
    setTxnRef('')
  }

  function handleConfirmPaid() {
    if (checkoutBlocked || manualPhase !== 'pay') return

    setLoading(true)
    onError?.('')

    try {
      const orderId = createOrderId()
      addMeeting({
        id: createId('meeting'),
        parentId: parent.id,
        parentName: parent.name,
        childName: parent.childName,
        email: parent.email,
        date: booking.date,
        time: booking.time,
        agenda: booking.agenda || '',
        meetLink: portalConfig.googleMeetLink,
        status: 'pending_payment',
        createdAt: new Date().toISOString(),
        payment: {
          provider: 'jazzcash_manual',
          orderId,
          currency: 'PKR',
          amount: config.sessionPricePkr,
          paidAt: null,
          parentTxnRef: txnRef.trim() || '',
          awaitingAdminConfirm: true,
        },
      })
      setManualPhase('submitted')
      onBooked?.()
    } catch (err) {
      onError?.(err.message || t('payments.checkoutError'))
    } finally {
      setLoading(false)
    }
  }

  async function handleStripePay() {
    if (checkoutBlocked) return

    setLoading(true)
    onError?.('')

    try {
      const { url, orderId } = await startStripeCheckout({ booking, parent })
      if (!url || !url.startsWith('https://')) {
        throw new Error(t('payments.checkoutError'))
      }

      savePendingPayment({
        booking,
        parent: {
          id: parent.id,
          name: parent.name,
          email: parent.email,
          childName: parent.childName,
        },
        currency,
        provider: 'stripe',
        orderId,
        amountUsd: config.sessionPriceUsd,
      })

      window.location.assign(url)
    } catch (err) {
      onError?.(err.message || t('payments.checkoutError'))
      setLoading(false)
    }
  }

  if (manualPhase === 'submitted') {
    return (
      <div className="session-checkout session-checkout--manual-done">
        <div className="parent-portal__alert parent-portal__alert--success">
          {t('payments.manualSubmitted')}
        </div>
        <p className="session-checkout__provider">{t('payments.manualSubmittedHint')}</p>
      </div>
    )
  }

  if (manualPhase === 'pay' && useManualPkr) {
    const manual = config.jazzcashManual
    return (
      <div className={`session-checkout session-checkout--manual ${loading ? 'session-checkout__paying' : ''}`}>
        <p className="session-checkout__price">{formatPrice('PKR', config)}</p>
        <p className="session-checkout__provider">{t('payments.manualInstructions')}</p>

        <div className="session-checkout__account-box">
          <p className="session-checkout__pay-at">{t('payments.manualPayAt')}</p>
          <div className="session-checkout__copy-row">
            <a href={`mailto:${manual.contactEmail}`} className="session-checkout__contact-email">
              <HiMail aria-hidden="true" />
              {manual.contactEmail}
            </a>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => handleCopy(manual.contactEmail)}
            >
              <HiDuplicate /> {t('payments.copy')}
            </button>
          </div>
          {copyMsg && <p className="session-checkout__copy-msg">{copyMsg}</p>}
        </div>

        <label className="session-checkout__txn">
          {t('payments.manualTxnOptional')}
          <input
            type="text"
            value={txnRef}
            onChange={(e) => setTxnRef(e.target.value)}
            placeholder={t('payments.manualTxnPlaceholder')}
            autoComplete="off"
          />
        </label>

        <button
          type="button"
          className="btn btn--primary btn--block"
          disabled={loading}
          onClick={handleConfirmPaid}
        >
          <HiCash />
          {loading ? t('payments.saving') : t('payments.manualIPaid')}
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--block"
          disabled={loading}
          onClick={() => setManualPhase(null)}
        >
          {t('common.cancel')}
        </button>
        <p className="session-checkout__refund-note">{t('payments.manualAdminNote')}</p>
      </div>
    )
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
            onChange={() => {
              setCurrency('PKR')
              setManualPhase(null)
            }}
            disabled={!config.jazzcashEnabled}
          />
          <span>{t('payments.pkr')}</span>
        </label>
        <label>
          <input
            type="radio"
            name="currency"
            value="USD"
            checked={currency === 'USD'}
            onChange={() => {
              setCurrency('USD')
              setManualPhase(null)
            }}
            disabled={!config.stripeEnabled}
          />
          <span>{t('payments.usd')}</span>
        </label>
      </fieldset>

      <p className="session-checkout__price">{formatPrice(currency, config)}</p>
      <p className="session-checkout__provider">
        {currency === 'PKR' ? t('payments.payWithJazzCashManual') : t('payments.payWithStripe')}
      </p>

      {!providerEnabled && (
        <div className="parent-portal__alert parent-portal__alert--error">
          {currency === 'PKR' ? t('payments.jazzcashUnavailable') : t('payments.stripeUnavailable')}
        </div>
      )}

      {providerEnabled && currency === 'USD' && (
        <p className="session-checkout__redirect-note">{t('payments.stripeRedirectNote')}</p>
      )}

      {providerEnabled && useManualPkr && (
        <p className="session-checkout__redirect-note">{t('payments.manualIntro')}</p>
      )}

      <button
        type="button"
        className="btn btn--primary btn--block"
        disabled={checkoutBlocked}
        onClick={useManualPkr ? handleStartManual : handleStripePay}
      >
        {currency === 'PKR' ? <HiCash /> : <HiCurrencyDollar />}
        {loading
          ? t('payments.redirecting')
          : useManualPkr
            ? t('payments.payWithManual')
            : t('payments.payAndBook')}
      </button>

      <p className="session-checkout__refund-note">
        {t('payments.refundPolicy', { days: config.refundPolicyDays })}
      </p>
    </div>
  )
}
