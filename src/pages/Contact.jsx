import { useState } from 'react'
import { HiMail, HiPhone, HiLocationMarker, HiCheckCircle } from 'react-icons/hi'
import SectionHeader from '../components/ui/SectionHeader'
import Reveal from '../components/ui/Reveal'
import { VoiceHelpBanner, VoiceLabel } from '../components/voice/VoiceInput'
import { appendSpeechText } from '../hooks/useSpeechRecognition'
import { siteInfo } from '../data/content'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    message: '',
  })

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="page contact-page">
      <section className="page-hero page-hero--contact">
        <div className="container">
          <SectionHeader
            badge="Get in Touch"
            title="Start Your Speech Education Journey"
            subtitle="Whether you are a parent, educator, or clinician, we are here to help you find the right path for your learner."
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <Reveal className="contact-info" variant="left">
            <h2>Contact Information</h2>
            <p>
              Reach out to learn more about {siteInfo.name} programs, schedule a consultation,
              or discuss partnership opportunities for your school or clinic.
            </p>
            <ul className="contact-list">
              <li>
                <HiMail />
                <div>
                  <strong>Email</strong>
                  <span>hello@voiceforunheard.org</span>
                </div>
              </li>
              <li>
                <HiPhone />
                <div>
                  <strong>Phone</strong>
                  <span>+1 (800) 555 0199</span>
                </div>
              </li>
              <li>
                <HiLocationMarker />
                <div>
                  <strong>Office</strong>
                  <span>Available for virtual consultations worldwide</span>
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal className="contact-form-wrap" variant="right" delay={100}>
            {submitted ? (
              <div className="contact-success">
                <HiCheckCircle />
                <h3>Thank You!</h3>
                <p>We have received your message and will respond within 24 hours.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <VoiceHelpBanner />
                <div className="form-row">
                  <label>
                    <VoiceLabel onTranscript={(text) => update('firstName', appendSpeechText(form.firstName, text))}>
                      First Name
                    </VoiceLabel>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={(e) => update('firstName', e.target.value)}
                      required
                      placeholder="Your first name"
                    />
                  </label>
                  <label>
                    <VoiceLabel onTranscript={(text) => update('lastName', appendSpeechText(form.lastName, text))}>
                      Last Name
                    </VoiceLabel>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={(e) => update('lastName', e.target.value)}
                      required
                      placeholder="Your last name"
                    />
                  </label>
                </div>
                <label>
                  Email Address
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  I am a
                  <select
                    name="role"
                    value={form.role}
                    onChange={(e) => update('role', e.target.value)}
                    required
                  >
                    <option value="" disabled>Select your role</option>
                    <option value="parent">Parent or Guardian</option>
                    <option value="educator">Educator or Teacher</option>
                    <option value="slp">Speech Language Pathologist</option>
                    <option value="audiologist">Audiologist</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label>
                  <VoiceLabel onTranscript={(text) => update('message', appendSpeechText(form.message, text))}>
                    Message
                  </VoiceLabel>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    required
                    placeholder="Tell us about your learner and how we can help..."
                  />
                </label>
                <button type="submit" className="btn btn--primary btn--block">
                  Send Message
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
