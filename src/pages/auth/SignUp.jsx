import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useParentAuth } from '../../context/ParentAuthContext'
import { useLanguage } from '../../i18n/LanguageContext'
import BrandLogo from '../../components/ui/BrandLogo'
import AuthTabs from '../../components/auth/AuthTabs'
import { VoiceHelpBanner, VoiceLabel } from '../../components/voice/VoiceInput'
import { appendSpeechText } from '../../hooks/useSpeechRecognition'

export default function SignUp() {
  const { t } = useLanguage()
  const { register, isAuthenticated } = useParentAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    childName: '',
    childAge: '',
    childGrade: 1,
    relationship: 'parent',
    accessCode: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/portal/parent', { replace: true })
  }, [isAuthenticated, navigate])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError(t('signUp.passwordMismatch'))
      return
    }
    if (form.password.length < 6) {
      setError(t('signUp.passwordTooShort'))
      return
    }

    setLoading(true)
    try {
      register(form)
      navigate('/portal/parent')
    } catch (err) {
      if (err.message.includes('Registration saved') || err.message.includes('review')) {
        setSuccess(err.message)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signin-page">
      <section className="signin-hero" data-brand-surface="dark">
        <div className="container signin-hero__inner">
          <BrandLogo className="signin-hero__logo" />
          <span className="signin-hero__badge">{t('signUp.badge')}</span>
          <h1>{t('signUp.title')}</h1>
          <p>{t('signUp.subtitle')}</p>
          <AuthTabs />
        </div>
      </section>

      <section className="section section--compact signin-roles-section">
        <div className="container signup-form-wrap">
          <div className="parent-portal__auth-card parent-portal__auth-card--wide signup-form-card">
            <p className="parent-portal__auth-sub">
              {t('signUp.alreadyHaveAccount')}{' '}
              <Link to="/signin">{t('signUp.signInLink')}</Link>
            </p>

            {error && <div className="parent-portal__alert parent-portal__alert--error">{error}</div>}
            {success && <div className="parent-portal__alert parent-portal__alert--success">{success}</div>}

            <VoiceHelpBanner />

            <form className="parent-portal__form" onSubmit={handleSubmit}>
              <div className="parent-portal__form-row">
                <label>
                  <VoiceLabel onTranscript={(text) => update('name', appendSpeechText(form.name, text))}>
                    {t('signUp.yourName')}
                  </VoiceLabel>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    required
                    placeholder={t('signUp.namePlaceholder')}
                  />
                </label>
                <label>
                  {t('signUp.relationship')}
                  <select
                    value={form.relationship}
                    onChange={(e) => update('relationship', e.target.value)}
                    required
                  >
                    <option value="parent">{t('signUp.relationshipParent')}</option>
                    <option value="guardian">{t('signUp.relationshipGuardian')}</option>
                    <option value="grandparent">{t('signUp.relationshipGrandparent')}</option>
                    <option value="other">{t('signUp.relationshipOther')}</option>
                  </select>
                </label>
              </div>

              <div className="parent-portal__form-row">
                <label>
                  {t('signIn.email')}
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>
                <label>
                  {t('signUp.accessCode')}{' '}
                  <span className="parent-portal__optional">{t('signUp.accessCodeHint')}</span>
                  <input
                    type="text"
                    value={form.accessCode}
                    onChange={(e) => update('accessCode', e.target.value)}
                    placeholder="VFU-FAMILY-2026"
                  />
                </label>
              </div>

              <div className="parent-portal__form-row">
                <label>
                  <VoiceLabel onTranscript={(text) => update('childName', appendSpeechText(form.childName, text))}>
                    {t('signUp.childName')}
                  </VoiceLabel>
                  <input
                    type="text"
                    value={form.childName}
                    onChange={(e) => update('childName', e.target.value)}
                    required
                    placeholder={t('signUp.childNamePlaceholder')}
                  />
                </label>
                <label>
                  <VoiceLabel onTranscript={(text) => update('childAge', appendSpeechText(form.childAge, text))}>
                    {t('signUp.childAge')}
                  </VoiceLabel>
                  <input
                    type="text"
                    value={form.childAge}
                    onChange={(e) => update('childAge', e.target.value)}
                    required
                    placeholder={t('signUp.childAgePlaceholder')}
                  />
                </label>
              </div>

              <label>
                {t('signUp.childGrade')}
                <select
                  value={form.childGrade}
                  onChange={(e) => update('childGrade', Number(e.target.value))}
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {t('signUp.gradeOption', { grade: i + 1 })}
                    </option>
                  ))}
                </select>
              </label>

              <div className="parent-portal__form-row">
                <label>
                  {t('signUp.createPassword')}
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder={t('signUp.passwordPlaceholder')}
                  />
                </label>
                <label>
                  {t('signUp.confirmPassword')}
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => update('confirmPassword', e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder={t('signUp.confirmPasswordPlaceholder')}
                  />
                </label>
              </div>

              <p className="parent-portal__hint">{t('signUp.approvalHint')}</p>

              <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                {loading ? t('signUp.submitting') : t('signUp.submit')}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
