import { useState } from 'react'
import { HiMail, HiLocationMarker, HiCheckCircle, HiExternalLink } from 'react-icons/hi'
import SectionHeader from '../components/ui/SectionHeader'
import Reveal from '../components/ui/Reveal'
import { VoiceHelpBanner, VoiceLabel } from '../components/voice/VoiceInput'
import { appendSpeechText } from '../hooks/useSpeechRecognition'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { SpeakHeading } from '../components/voice/SpeakAloud'

const EDUCATOR_PORTFOLIO_URL = 'https://maria-speech-therapist.vercel.app/'

export default function Contact() {
  const { t } = useLanguage()
  const { siteInfo } = useLocalizedContent()
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
            badge={t('pages.contact.badge')}
            title={t('pages.contact.title')}
            subtitle={t('pages.contact.subtitle')}
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <Reveal className="contact-info" variant="left">
            <SpeakHeading as="h2" body={t('pages.contact.infoText', { name: siteInfo.name })}>
              {t('pages.contact.infoTitle')}
            </SpeakHeading>
            <p>{t('pages.contact.infoText', { name: siteInfo.name })}</p>
            <ul className="contact-list">
              <li>
                <HiMail />
                <div>
                  <strong>{t('pages.contact.email')}</strong>
                  <a href={`mailto:${siteInfo.contactEmail}`} className="contact-list__link">
                    {siteInfo.contactEmail}
                  </a>
                </div>
              </li>
              <li>
                <HiLocationMarker />
                <div>
                  <strong>{t('pages.contact.office')}</strong>
                  <span>{t('pages.contact.officeValue')}</span>
                </div>
              </li>
              <li>
                <HiExternalLink />
                <div>
                  <strong>{t('pages.contact.portfolio')}</strong>
                  <a
                    href={EDUCATOR_PORTFOLIO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-list__link"
                  >
                    {t('pages.contact.portfolioLink')}
                  </a>
                  <span className="contact-list__hint">{t('pages.contact.portfolioHint')}</span>
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal className="contact-form-wrap" variant="right" delay={100}>
            {submitted ? (
              <div className="contact-success">
                <HiCheckCircle />
                <SpeakHeading as="h3" body={t('pages.contact.thankYouText')}>
                  {t('pages.contact.thankYou')}
                </SpeakHeading>
                <p>{t('pages.contact.thankYouText')}</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <VoiceHelpBanner />
                <div className="form-row">
                  <label>
                    <VoiceLabel onTranscript={(text) => update('firstName', appendSpeechText(form.firstName, text))}>
                      {t('pages.contact.firstName')}
                    </VoiceLabel>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={(e) => update('firstName', e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    <VoiceLabel onTranscript={(text) => update('lastName', appendSpeechText(form.lastName, text))}>
                      {t('pages.contact.lastName')}
                    </VoiceLabel>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={(e) => update('lastName', e.target.value)}
                      required
                    />
                  </label>
                </div>
                <label>
                  {t('pages.contact.emailAddress')}
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
                  {t('pages.contact.role')}
                  <select
                    name="role"
                    value={form.role}
                    onChange={(e) => update('role', e.target.value)}
                    required
                  >
                    <option value="" disabled>{t('pages.contact.selectRole')}</option>
                    <option value="parent">{t('pages.contact.roleParent')}</option>
                    <option value="educator">{t('pages.contact.roleEducator')}</option>
                    <option value="slp">{t('pages.contact.roleSlp')}</option>
                    <option value="audiologist">{t('pages.contact.roleAudiologist')}</option>
                    <option value="other">{t('pages.contact.roleOther')}</option>
                  </select>
                </label>
                <label>
                  <VoiceLabel onTranscript={(text) => update('message', appendSpeechText(form.message, text))}>
                    {t('pages.contact.message')}
                  </VoiceLabel>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    required
                  />
                </label>
                <button type="submit" className="btn btn--primary btn--block">
                  {t('common.sendMessage')}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
