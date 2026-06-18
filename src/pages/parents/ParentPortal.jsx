import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { HiLockClosed, HiUserGroup, HiVideoCamera } from 'react-icons/hi'
import SectionHeader from '../../components/ui/SectionHeader'
import Reveal from '../../components/ui/Reveal'
import { useParentAuth } from '../../context/ParentAuthContext'
import { parentPortalConfig } from '../../data/parentPortal'

export default function ParentPortal() {
  const { login, isAuthenticated } = useParentAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/parents/dashboard" replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      login(email, password)
      navigate('/parents/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page parent-portal">
      <section className="page-hero page-hero--parents">
        <div className="container">
          <SectionHeader
            badge="Parent Portal"
            title="Secure Access for Families"
            subtitle="Sign in to share concerns about your child, schedule video sessions, and connect directly with your speech education teacher."
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container parent-portal__intro-grid">
          <Reveal className="parent-portal__feature interactive-card card-shine">
            <HiLockClosed className="parent-portal__feature-icon" />
            <h3>Private Family Access</h3>
            <p>Only registered parents and guardians can view and submit information about their learner.</p>
          </Reveal>
          <Reveal className="parent-portal__feature interactive-card card-shine" delay={80}>
            <HiUserGroup className="parent-portal__feature-icon" />
            <h3>Share Concerns Safely</h3>
            <p>Describe speech, hearing, or classroom challenges so your educator can prepare tailored support.</p>
          </Reveal>
          <Reveal className="parent-portal__feature interactive-card card-shine" delay={160}>
            <HiVideoCamera className="parent-portal__feature-icon" />
            <h3>Video Meeting Sessions</h3>
            <p>Book a Google Meet session, receive a join link, and discuss progress face to face.</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt section--compact">
        <div className="container parent-portal__auth-wrap">
          <Reveal className="parent-portal__auth-card">
            <h2>Parent Sign In</h2>
            <p className="parent-portal__auth-sub">
              New family?{' '}
              <Link to="/signin">Sign in to the portal</Link>
              {' · '}
              <Link to="/admin">Educator admin</Link>
            </p>

            <div className="portal-demo-box">
              <strong>Demo parent credentials</strong>
              <p>
                Email: <code>{parentPortalConfig.demoParent.email}</code>
                <br />
                Password: <code>{parentPortalConfig.demoParent.password}</code>
              </p>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => {
                  setEmail(parentPortalConfig.demoParent.email)
                  setPassword(parentPortalConfig.demoParent.password)
                }}
              >
                Use demo credentials
              </button>
            </div>

            {error && <div className="parent-portal__alert parent-portal__alert--error">{error}</div>}

            <form className="parent-portal__form" onSubmit={handleSubmit}>
              <label>
                Email Address
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Your portal password"
                  autoComplete="current-password"
                />
              </label>
              <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In to Portal'}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
