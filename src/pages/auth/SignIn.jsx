import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiEye,
  HiEyeOff,
  HiKey,
  HiShieldCheck,
  HiUserGroup,
  HiAcademicCap,
} from 'react-icons/hi'
import { useParentAuth } from '../../context/ParentAuthContext'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext'
import { portalConfig } from '../../data/parentPortal'
const ROLE_META = {
  parent: {
    icon: HiUserGroup,
    title: 'Parent',
    description: 'Share concerns, schedule video sessions, and track your child\'s progress.',
    features: ['Submit concerns', 'Book Google Meet sessions', 'View educator feedback'],
  },
  admin: {
    icon: HiAcademicCap,
    title: 'Educator Admin',
    description: 'Review family requests, respond to concerns, and manage session schedules.',
    features: ['Approve parent access', 'Review concerns', 'Confirm meetings'],
  },
  superadmin: {
    icon: HiShieldCheck,
    title: 'Super Admin',
    description: 'Full system oversight — users, access codes, activity, and platform health.',
    features: ['Manage all families', 'Control access codes', 'System activity log'],
  },
}

export default function SignIn() {
  const navigate = useNavigate()
  const parentAuth = useParentAuth()
  const adminAuth = useAdminAuth()
  const superAuth = useSuperAdminAuth()

  const [selectedRole, setSelectedRole] = useState('parent')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const roleConfig = portalConfig.roles[selectedRole]
  const meta = ROLE_META[selectedRole]
  const RoleIcon = meta.icon

  useEffect(() => {
    if (parentAuth.isAuthenticated) navigate('/portal/parent', { replace: true })
    else if (adminAuth.isAuthenticated) navigate('/portal/admin', { replace: true })
    else if (superAuth.isAuthenticated) navigate('/portal/superadmin', { replace: true })
  }, [parentAuth.isAuthenticated, adminAuth.isAuthenticated, superAuth.isAuthenticated, navigate])

  function selectRole(role) {
    setSelectedRole(role)
    setEmail('')
    setPassword('')
    setError('')
  }

  function fillDemo() {
    const creds = portalConfig.roles[selectedRole]
    setEmail(creds.email)
    setPassword(creds.password)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (selectedRole === 'parent') {
        await parentAuth.login(email, password)
        navigate('/portal/parent')
      } else if (selectedRole === 'admin') {
        await adminAuth.login(email, password)
        navigate('/portal/admin')
      } else {
        await superAuth.login(email, password)
        navigate('/portal/superadmin')
      }
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signin-page">
      <section className="signin-hero">
        <div className="container signin-hero__inner">
          <span className="signin-hero__badge">Secure Portal Access</span>
          <h1>Sign In to Your Portal</h1>
          <p>
            Choose your role below to access the VoiceForUnheard platform. Each portal is tailored
            to your responsibilities as a parent, educator, or system administrator.
          </p>
        </div>
      </section>

      <section className="section section--compact">
        <div className="container">
          <div className="signin-roles" role="tablist" aria-label="Sign in role">
            {Object.entries(ROLE_META).map(([role, info]) => {
              const Icon = info.icon
              const active = selectedRole === role
              return (
                <button
                  key={role}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`signin-role-card interactive-card ${active ? 'signin-role-card--active' : ''}`}
                  style={{ '--role-color': portalConfig.roles[role].color }}
                  onClick={() => selectRole(role)}
                >
                  <span className="signin-role-card__icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <strong>{info.title}</strong>
                  <span className="signin-role-card__hint">{info.description.slice(0, 48)}…</span>
                </button>
              )
            })}
          </div>

          <div
            className={`signin-panel ${shake ? 'signin-panel--shake' : ''}`}
            style={{ '--role-color': roleConfig.color }}
          >
            <div className="signin-panel__intro">
              <div className="signin-panel__icon">
                <RoleIcon aria-hidden="true" />
              </div>
              <div>
                <h2>{meta.title} Sign In</h2>
                <p>{meta.description}</p>
                <ul className="signin-panel__features">
                  {meta.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {error && (
              <div className="signin-panel__error" role="alert">
                {error}
              </div>
            )}

            <form className="signin-form" onSubmit={handleSubmit}>
              <label>
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={roleConfig.email}
                  required
                  autoComplete="username"
                />
              </label>
              <label>
                Password
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                  </button>
                </span>
              </label>

              <div className="signin-form__actions">
                <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                  {loading ? 'Signing in…' : `Sign in as ${meta.title}`}
                </button>
                <button type="button" className="btn btn--outline btn--block" onClick={fillDemo}>
                  <HiKey aria-hidden="true" /> Use demo credentials
                </button>
              </div>
            </form>

            <div className="signin-demo-creds">
              <p>
                <strong>Demo:</strong> {roleConfig.email} / {roleConfig.password}
              </p>
            </div>

            {selectedRole === 'parent' && (
              <p className="signin-register-link">
                New family?{' '}
                <Link to="/signin/register">Request portal access</Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
