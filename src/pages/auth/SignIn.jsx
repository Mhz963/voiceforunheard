import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiEye,
  HiEyeOff,
  HiShieldCheck,
  HiUserGroup,
  HiAcademicCap,
  HiX,
} from 'react-icons/hi'
import { useParentAuth } from '../../context/ParentAuthContext'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext'
import { usePortalConfig } from '../../i18n/usePortalConfig'
import { useLanguage } from '../../i18n/LanguageContext'
import { useToast } from '../../context/ToastContext'
import BrandLogo from '../../components/ui/BrandLogo'
import AuthTabs from '../../components/auth/AuthTabs'
import SpeakAloud from '../../components/voice/SpeakAloud'

const ROLE_ICONS = {
  parent: HiUserGroup,
  admin: HiAcademicCap,
  superadmin: HiShieldCheck,
}

// Staff portals are not listed publicly.
const ROLE_KEYS = ['parent']

export default function SignIn() {
  const { t } = useLanguage()
  const toast = useToast()
  const portalConfig = usePortalConfig()
  const navigate = useNavigate()
  const parentAuth = useParentAuth()
  const adminAuth = useAdminAuth()
  const superAuth = useSuperAdminAuth()

  const [selectedRole, setSelectedRole] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const roleConfig = selectedRole ? portalConfig.roles[selectedRole] : null
  const roleInfo = selectedRole ? t(`signIn.roles.${selectedRole}`) : null
  const RoleIcon = selectedRole ? ROLE_ICONS[selectedRole] : null

  useEffect(() => {
    if (parentAuth.isAuthenticated) navigate('/portal/parent', { replace: true })
    else if (adminAuth.isAuthenticated) navigate('/portal/admin', { replace: true })
    else if (superAuth.isAuthenticated) navigate('/portal/superadmin', { replace: true })
  }, [parentAuth.isAuthenticated, adminAuth.isAuthenticated, superAuth.isAuthenticated, navigate])

  useEffect(() => {
    if (!modalOpen) return undefined

    document.body.classList.add('signin-modal-open')

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeModal()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('signin-modal-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [modalOpen])

  function openModal(role) {
    setSelectedRole(role)
    setEmail('')
    setPassword('')
    setShowPassword(false)
    setError('')
    setShake(false)
    setModalOpen(true)
  }

  function closeModal() {
    if (loading) return
    setModalOpen(false)
    setError('')
    setShake(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedRole) return

    setError('')
    setLoading(true)

    try {
      if (selectedRole === 'parent') {
        await parentAuth.login(email, password)
        toast.successT('toasts.signedInTitle', 'toasts.signedInMessage')
        navigate('/portal/parent')
      } else if (selectedRole === 'admin') {
        await adminAuth.login(email, password)
        toast.successT('toasts.signedInTitle', 'toasts.signedInMessage')
        navigate('/portal/admin')
      } else {
        await superAuth.login(email, password)
        toast.successT('toasts.signedInTitle', 'toasts.signedInMessage')
        navigate('/portal/superadmin')
      }
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.')
      toast.errorT('toasts.errorTitle', 'toasts.errorMessage')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signin-page">
      <section className="signin-hero" data-brand-surface="dark">
        <div className="container signin-hero__inner">
          <BrandLogo className="signin-hero__logo" />
          <span className="signin-hero__badge">{t('signIn.badge')}</span>
          <h1>{t('signIn.title')}</h1>
          <p>{t('signIn.subtitle')}</p>
          <AuthTabs />
        </div>
      </section>

      <section className="section section--compact signin-roles-section">
        <div className="container">
          <div className="signin-roles" role="list" aria-label="Sign in roles">
            {ROLE_KEYS.map((role) => {
              const info = t(`signIn.roles.${role}`)
              const Icon = ROLE_ICONS[role]
              return (
                <button
                  key={role}
                  type="button"
                  className="signin-role-card interactive-card"
                  style={{ '--role-color': portalConfig.roles[role].color }}
                  onClick={() => openModal(role)}
                >
                  <span className="signin-role-card__icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <strong>{info.title}</strong>
                  <span className="signin-role-card__hint">{info.description}</span>
                  <span className="signin-role-card__action">{t('signIn.signInAction')}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {modalOpen && selectedRole && roleConfig && roleInfo && RoleIcon && (
        <div
          className="signin-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signin-modal-title"
        >
          <button
            type="button"
            className="signin-modal__backdrop"
            onClick={closeModal}
            aria-label={t('signIn.closeDialog')}
          />

          <div className={`signin-modal__dialog ${shake ? 'signin-modal__dialog--shake' : ''}`}>
            <button
              type="button"
              className="signin-modal__close"
              onClick={closeModal}
              aria-label={t('common.close')}
              disabled={loading}
            >
              <HiX aria-hidden="true" />
            </button>

            <div className="signin-panel" style={{ '--role-color': roleConfig.color }}>
              <div className="signin-panel__intro">
                <div className="signin-panel__icon">
                  <RoleIcon aria-hidden="true" />
                </div>
                <div>
                  <div className="signin-modal__title-row">
                    <h2 id="signin-modal-title">{t('signIn.signInAs', { role: roleInfo.title })}</h2>
                    <SpeakAloud
                      text={[t('signIn.signInAs', { role: roleInfo.title }), roleInfo.description].join('. ')}
                    />
                  </div>
                  <p>{roleInfo.description}</p>
                </div>
              </div>

              {error && (
                <div className="signin-panel__error" role="alert">
                  {error}
                </div>
              )}

              <form className="signin-form" onSubmit={handleSubmit}>
                <label>
                  {t('signIn.email')}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    autoFocus
                  />
                </label>
                <label>
                  {t('signIn.password')}
                  <span className="signin-form__password-wrap">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="signin-form__toggle-pw"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? t('signIn.hidePassword') : t('signIn.showPassword')}
                    >
                      {showPassword ? <HiEyeOff /> : <HiEye />}
                    </button>
                  </span>
                </label>

                <div className="signin-form__actions">
                  <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                    {loading
                      ? t('signIn.signingIn')
                      : t('signIn.signInAs', { role: roleInfo.title })}
                  </button>
                </div>
              </form>

              {selectedRole === 'parent' && (
                <p className="signin-panel__switch">
                  {t('signIn.noAccount')}{' '}
                  <Link to="/signup" onClick={closeModal}>
                    {t('nav.signUp')}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
