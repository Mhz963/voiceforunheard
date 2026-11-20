import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiMail, HiLocationMarker, HiCheckCircle, HiExclamationCircle, HiExternalLink, HiPaperAirplane } from 'react-icons/hi'
import SectionHeader from '../components/ui/SectionHeader'
import Reveal from '../components/ui/Reveal'
import { VoiceHelpBanner, VoiceLabel } from '../components/voice/VoiceInput'
import { appendSpeechText } from '../hooks/useSpeechRecognition'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { SpeakHeading } from '../components/voice/SpeakAloud'
import { EDUCATOR_PORTFOLIO_URL } from '../config/site'
import { buildMessageText, mailtoUrl, sendMessage } from '../utils/deliverMessage'

export default function Contact() {
  const { t } = useLanguage()
  const { siteInfo } = useLocalizedContent()
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed
  const [website, setWebsite] = useState('') // honeypot: left empty by people
  const startedAt = useRef(0)
  useEffect(() => {
    startedAt.current = Date.now()
  }, [])
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    message: '',
    consent: false,
  })

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function roleLabel() {
    return form.role ? t(`pages.contact.role${form.role === 'slp' ? 'Slp' : form.role.charAt(0).toUpperCase() + form.role.slice(1)}`) : ''
  }

  function messageText() {
    return buildMessageText(`${siteInfo.name} — ${t('pages.contact.badge')}`, [
      [t('pages.contact.firstName'), `${form.firstName} ${form.lastName}`],
      [t('pages.contact.emailAddress'), form.email],
      [t('pages.contact.phone'), form.phone],
      [t('pages.contact.role'), roleLabel()],
      [t('pages.contact.message'), form.message],
    ])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendMessage({
        kind: 'contact',
        consent: form.consent,
        website,
        startedAt: startedAt.current,
        fields: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          role: roleLabel(),
          message: form.message,
        },
      })
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
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
            {status === 'sent' ? (
              <div className="contact-success" role="status">
                <HiCheckCircle aria-hidden="true" />
                <SpeakHeading as="h3" body={t('pages.contact.sentText')}>
                  {t('pages.contact.sentTitle')}
                </SpeakHeading>
                <p>{t('pages.contact.sentText')}</p>
              </div>
            ) : status === 'failed' ? (
              <div className="contact-success contact-success--failed" role="alert">
                <HiExclamationCircle aria-hidden="true" />
                <h3>{t('consult.failTitle')}</h3>
                <p>{t('consult.failText')}</p>
                <a className="btn btn--primary" href={mailtoUrl(`${siteInfo.name} — ${t('pages.contact.badge')}`, messageText())}>
                  <HiMail aria-hidden="true" /> {t('consult.sendEmail')}
                </a>
                <button type="button" className="btn btn--outline" onClick={() => setStatus('idle')}>
                  {t('consult.tryAgain')}
                </button>
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
                    dir="ltr"
                  />
                </label>
                <label>
                  {t('pages.contact.phone')}
                  <input
                    type="tel"
                    name="phone"
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    placeholder={t('consult.phonePlaceholder')}
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
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
                <label className="contact-form__consent">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => update('consent', e.target.checked)}
                    required
                  />
                  <span>
                    {t('pages.contact.consent')} <Link to="/privacy">{t('pages.contact.privacyLink')}</Link>
                  </span>
                </label>
                <p className="contact-form__note">{t('pages.contact.deliveryNote')}</p>
                <label className="contact-form__hp" aria-hidden="true">
                  Website
                  <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </label>
                <div className="contact-form__actions">
                  <button type="submit" className="btn btn--primary btn--block" disabled={status === 'sending'}>
                    <HiPaperAirplane aria-hidden="true" /> {status === 'sending' ? t('consult.sending') : t('common.sendMessage')}
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
