import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { HiShieldCheck } from 'react-icons/hi'
import SectionHeader from '../../components/ui/SectionHeader'
import Reveal from '../../components/ui/Reveal'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { parentPortalConfig } from '../../data/parentPortal'
import '../parents/ParentPortal.css'
import './AdminPortal.css'

export default function AdminPortal() {
  const { login, isAuthenticated } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  function fillDemo() {
    setEmail(parentPortalConfig.demoAdmin.email)
    setPassword(parentPortalConfig.demoAdmin.password)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      login(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page admin-portal">
      <section className="page-hero page-hero--admin">
        <div className="container">
          <SectionHeader
            badge="Educator Admin"
            title="Admin Portal"
            subtitle="Review parent access requests, concerns, and scheduled video sessions."
            light
          />
        </div>
      </section>

      <section className="section section--compact">
        <div className="container admin-portal__wrap">
          <Reveal className="parent-portal__auth-card">
            <div className="admin-portal__title-row">
              <HiShieldCheck className="admin-portal__shield" />
              <h2>Educator Sign In</h2>
            </div>
            <p className="parent-portal__auth-sub">
              <Link to="/parents">← Back to Parental Portal</Link>
            </p>

            <div className="portal-demo-box portal-demo-box--admin">
              <strong>Demo admin credentials</strong>
              <p>
                Email: <code>{parentPortalConfig.demoAdmin.email}</code>
                <br />
                Password: <code>{parentPortalConfig.demoAdmin.password}</code>
              </p>
              <button type="button" className="btn btn--outline btn--sm" onClick={fillDemo}>
                Use demo credentials
              </button>
            </div>

            {error && <div className="parent-portal__alert parent-portal__alert--error">{error}</div>}

            <form className="parent-portal__form" onSubmit={handleSubmit}>
              <label>
                Admin Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@voiceforunheard.org"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Admin password"
                />
              </label>
              <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In to Admin Portal'}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
