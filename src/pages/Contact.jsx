import { useState } from 'react'
import { HiMail, HiPhone, HiLocationMarker, HiCheckCircle } from 'react-icons/hi'
import SectionHeader from '../components/ui/SectionHeader'
import Reveal from '../components/ui/Reveal'
import { siteInfo } from '../data/content'
import './Contact.css'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

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
                <div className="form-row">
                  <label>
                    First Name
                    <input type="text" name="firstName" required placeholder="Your first name" />
                  </label>
                  <label>
                    Last Name
                    <input type="text" name="lastName" required placeholder="Your last name" />
                  </label>
                </div>
                <label>
                  Email Address
                  <input type="email" name="email" required placeholder="you@example.com" />
                </label>
                <label>
                  I am a
                  <select name="role" required defaultValue="">
                    <option value="" disabled>Select your role</option>
                    <option value="parent">Parent or Guardian</option>
                    <option value="educator">Educator or Teacher</option>
                    <option value="slp">Speech Language Pathologist</option>
                    <option value="audiologist">Audiologist</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label>
                  Message
                  <textarea
                    name="message"
                    rows={5}
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
