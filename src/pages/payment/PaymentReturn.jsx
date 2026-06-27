import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import { useParentAuth } from '../../context/ParentAuthContext'
import { usePortalConfig } from '../../i18n/usePortalConfig'
import {
  addMeeting,
  clearPendingPayment,
  findMeetingByOrderId,
  getPendingPayment,
} from '../../services/parentStorage'
import { verifyJazzCashPayment, verifyStripeSession } from '../../services/payments'
import './PaymentReturn.css'

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function decodeJazzCashPayload(dataParam) {
  if (!dataParam) return null
  try {
    const json = atob(dataParam.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export default function PaymentReturn() {
  const { t } = useLanguage()
  const portalConfig = usePortalConfig()
  const { parent } = useParentAuth()
  const [params] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function completePayment() {
      const provider = params.get('provider')
      const errorParam = params.get('error')

      if (errorParam) {
        setStatus('error')
        setMessage(t('payments.returnFailed'))
        return
      }

      try {
        if (provider === 'stripe') {
          const sessionId = params.get('session_id')
          if (!sessionId) {
            throw new Error(t('payments.missingSession'))
          }

          const existing = findMeetingByOrderId(params.get('order_id') || '')
          if (existing) {
            setStatus('success')
            setMessage(t('payments.alreadyBooked'))
            clearPendingPayment()
            return
          }

          const result = await verifyStripeSession(sessionId)
          if (cancelled) return

          addMeeting({
            id: createId('meeting'),
            parentId: result.booking.parentId,
            parentName: result.booking.parentName,
            childName: result.booking.childName,
            email: result.booking.email,
            date: result.booking.date,
            time: result.booking.time,
            agenda: result.booking.agenda || '',
            meetLink: portalConfig.googleMeetLink,
            status: 'scheduled',
            createdAt: new Date().toISOString(),
            payment: {
              provider: 'stripe',
              orderId: result.orderId,
              providerPaymentId: result.providerPaymentId,
              currency: result.currency,
              amount: result.amount,
              paidAt: new Date().toISOString(),
            },
          })

          clearPendingPayment()
          setStatus('success')
          setMessage(t('payments.bookingConfirmed'))
          return
        }

        if (provider === 'jazzcash') {
          const payload = decodeJazzCashPayload(params.get('data'))
          const pending = getPendingPayment()

          if (!payload || !pending) {
            throw new Error(t('payments.missingPaymentData'))
          }

          const existing = findMeetingByOrderId(pending.orderId)
          if (existing) {
            setStatus('success')
            setMessage(t('payments.alreadyBooked'))
            clearPendingPayment()
            return
          }

          const result = await verifyJazzCashPayment(payload, pending)
          if (cancelled) return

          addMeeting({
            id: createId('meeting'),
            parentId: result.parent.id,
            parentName: result.parent.name,
            childName: result.parent.childName,
            email: result.parent.email,
            date: result.booking.date,
            time: result.booking.time,
            agenda: result.booking.agenda || '',
            meetLink: portalConfig.googleMeetLink,
            status: 'scheduled',
            createdAt: new Date().toISOString(),
            payment: {
              provider: 'jazzcash',
              orderId: result.orderId,
              providerPaymentId: result.providerPaymentId,
              currency: result.currency,
              amount: result.amount,
              paidAt: new Date().toISOString(),
            },
          })

          clearPendingPayment()
          setStatus('success')
          setMessage(t('payments.bookingConfirmed'))
          return
        }

        throw new Error(t('payments.unknownProvider'))
      } catch (err) {
        if (cancelled) return
        setStatus('error')
        setMessage(err.message || t('payments.verificationFailed'))
      }
    }

    completePayment()
    return () => {
      cancelled = true
    }
  }, [params, portalConfig.googleMeetLink, t])

  return (
    <div className="payment-return">
      <div className="payment-return__card">
        {status === 'loading' && (
          <>
            <div className="payment-return__spinner" aria-hidden />
            <h1>{t('payments.verifying')}</h1>
            <p>{t('payments.verifyingHint')}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="payment-return__icon payment-return__icon--success">✓</div>
            <h1>{t('payments.successTitle')}</h1>
            <p>{message}</p>
            <Link to="/portal/parent?tab=meetings" className="btn btn--primary">
              {t('payments.viewSessions')}
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="payment-return__icon payment-return__icon--error">!</div>
            <h1>{t('payments.errorTitle')}</h1>
            <p>{message}</p>
            {!parent && (
              <p className="payment-return__signin-hint">{t('payments.signInHint')}</p>
            )}
            <Link to="/portal/parent?tab=meetings" className="btn btn--outline">
              {t('payments.tryAgain')}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
