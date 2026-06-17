import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Reveal from '../../components/ui/Reveal'
import { useParentAuth } from '../../context/ParentAuthContext'
export default function ParentRegister() {
  const { register } = useParentAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    childName: '',
    childAge: '',
    relationship: 'parent',
    accessCode: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      register(form)
      navigate('/portal/parent')
    } catch (err) {
      if (err.message.includes('Registration saved')) {
        setSuccess(err.message)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page parent-portal">
      <section className="page-hero page-hero--parents">
        <div className="container">
          <SectionHeader
            badge="Request Access"
            title="Register as a Parent or Guardian"
            subtitle="Create your family account to share concerns and schedule video sessions with your speech education teacher."
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container parent-portal__auth-wrap">
          <Reveal className="parent-portal__auth-card parent-portal__auth-card--wide">
            <h2>Family Registration</h2>
            <p className="parent-portal__auth-sub">
              Already registered? <Link to="/signin">Sign in here</Link>
            </p>

            {error && <div className="parent-portal__alert parent-portal__alert--error">{error}</div>}
            {success && <div className="parent-portal__alert parent-portal__alert--success">{success}</div>}

            <form className="parent-portal__form" onSubmit={handleSubmit}>
              <div className="parent-portal__form-row">
                <label>
                  Your Full Name
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    required
                    placeholder="Parent or guardian name"
                  />
                </label>
                <label>
                  Relationship to Child
                  <select
                    value={form.relationship}
                    onChange={(e) => update('relationship', e.target.value)}
                    required
                  >
                    <option value="parent">Parent</option>
                    <option value="guardian">Guardian</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="other">Other Caregiver</option>
                  </select>
                </label>
              </div>

              <div className="parent-portal__form-row">
                <label>
                  Email Address
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Access Code <span className="parent-portal__optional">(from educator)</span>
                  <input
                    type="text"
                    value={form.accessCode}
                    onChange={(e) => update('accessCode', e.target.value)}
                    placeholder="e.g. VFU-FAMILY-2026"
                  />
                </label>
              </div>

              <div className="parent-portal__form-row">
                <label>
                  Child&apos;s Name
                  <input
                    type="text"
                    value={form.childName}
                    onChange={(e) => update('childName', e.target.value)}
                    required
                    placeholder="Learner's first name"
                  />
                </label>
                <label>
                  Child&apos;s Age
                  <input
                    type="text"
                    value={form.childAge}
                    onChange={(e) => update('childAge', e.target.value)}
                    required
                    placeholder="e.g. 7 years"
                  />
                </label>
              </div>

              <div className="parent-portal__form-row">
                <label>
                  Create Password
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                  />
                </label>
                <label>
                  Confirm Password
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => update('confirmPassword', e.target.value)}
                    required
                    placeholder="Re-enter password"
                  />
                </label>
              </div>

              <p className="parent-portal__hint">
                If you do not have an access code yet, submit this form and your educator will approve your account.
              </p>

              <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                {loading ? 'Creating account...' : 'Request Portal Access'}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
