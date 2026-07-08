import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { HiCheckCircle, HiExclamation, HiInformationCircle, HiX } from 'react-icons/hi'
import { useLanguage } from '../i18n/LanguageContext'
import '../components/ui/Toast.css'

const ToastContext = createContext(null)

const ICONS = {
  success: HiCheckCircle,
  error: HiExclamation,
  info: HiInformationCircle,
  warning: HiExclamation,
}

function ToastItem({ toast, onDismiss }) {
  const Icon = ICONS[toast.type] || HiInformationCircle

  return (
    <div className={`app-toast app-toast--${toast.type}`} role="status" aria-live="polite">
      <span className="app-toast__icon" aria-hidden="true">
        <Icon />
      </span>
      <div className="app-toast__body">
        <strong className="app-toast__title">{toast.title}</strong>
        {toast.message && <p className="app-toast__message">{toast.message}</p>}
      </div>
      <button
        type="button"
        className="app-toast__close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
      >
        <HiX />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const { t } = useLanguage()
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((items) => items.filter((item) => item.id !== id))
  }, [])

  const show = useCallback(
    ({ type = 'success', title, message = '', duration = 4500 }) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      setToasts((items) => [...items.slice(-4), { id, type, title, message }])
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss],
  )

  const showT = useCallback(
    (type, titleKey, messageKey, vars = {}) => {
      const title = t(titleKey, vars)
      const message = messageKey ? t(messageKey, vars) : ''
      return show({ type, title, message })
    },
    [show, t],
  )

  const api = useMemo(
    () => ({
      show,
      dismiss,
      success: (title, message) => show({ type: 'success', title, message }),
      error: (title, message) => show({ type: 'error', title, message }),
      info: (title, message) => show({ type: 'info', title, message }),
      warning: (title, message) => show({ type: 'warning', title, message }),
      successT: (titleKey, messageKey, vars) => showT('success', titleKey, messageKey, vars),
      errorT: (titleKey, messageKey, vars) => showT('error', titleKey, messageKey, vars),
      infoT: (titleKey, messageKey, vars) => showT('info', titleKey, messageKey, vars),
      warningT: (titleKey, messageKey, vars) => showT('warning', titleKey, messageKey, vars),
    }),
    [show, showT],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="app-toast-stack" aria-label={t('toasts.notifications')}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}
