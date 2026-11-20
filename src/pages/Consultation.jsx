import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiCheckCircle, HiExclamationCircle, HiMail, HiPaperAirplane, HiShieldCheck } from 'react-icons/hi'
import SectionHeader from '../components/ui/SectionHeader'
import Reveal from '../components/ui/Reveal'
import { VoiceHelpBanner, VoiceLabel } from '../components/voice/VoiceInput'
import { appendSpeechText } from '../hooks/useSpeechRecognition'
import { useLanguage } from '../i18n/LanguageContext'
import { SpeakHeading } from '../components/voice/SpeakAloud'
import { buildMessageText, mailtoUrl, sendMessage } from '../utils/deliverMessage'

const AGE_BANDS = ['0-1', '1-3', '3-5', '6-12', '13-18', '18+']
const CONCERNS = ['hearing', 'listening', 'speech', 'language', 'sign', 'school', 'other']

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  city: '',
  age: '',
  concern: '',
  contactBy: 'whatsapp',
  message: '',
  consent: false,
}

export default function Consultation() {
  const { t } = useLanguage()
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed
  const [website, setWebsite] = useState('') // honeypot: left empty by people
  const startedAt = useRef(0)
  useEffect(() => {
    startedAt.current = Date.now()
  }, [])
  const how = t('consult.how')

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function buildText() {
    const L = (key) => t(`consult.labels.${key}`)
    return buildMessageText(t('consult.messageHeading'), [
      [L('name'), form.name],
      [L('phone'), form.phone],
      [L('email'), form.email],
      [L('city'), form.city],
      [L('age'), form.age && t(`consult.ageBands.${form.age}`)],
      [L('concern'), form.concern && t(`consult.concerns.${form.concern}`)],
      [L('contactBy'), t(`consult.contact${form.contactBy === 'whatsapp' ? 'WhatsApp' : form.contactBy === 'email' ? 'Email' : 'Call'}`)],
      [L('message'), form.message],
    ])
  }

  function validate() {
    if (form.contactBy === 'email' && !form.email.trim()) return t('consult.emailRequired')
    if (form.contactBy !== 'email' && !form.phone.trim()) return t('consult.phoneRequired')
    return ''
  }

  function contactByLabel() {
    return t(`consult.contact${form.contactBy === 'whatsapp' ? 'WhatsApp' : form.contactBy === 'email' ? 'Email' : 'Call'}`)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const problem = validate()
    setError(problem)
    if (problem) return
    setStatus('sending')
    try {
      // Field values are sent in English labels' order; the server formats the message.
      await sendMessage({
        kind: 'consultation',
        consent: form.consent,
        website,
        startedAt: startedAt.current,
        fields: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          city: form.city,
          age: form.age && t(`consult.ageBands.${form.age}`),
          concern: form.concern && t(`consult.concerns.${form.concern}`),
          contactBy: contactByLabel(),
          message: form.message,
        },
      })
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  function reset() {
    setForm(EMPTY)
    setStatus('idle')
    startedAt.current = Date.now()
  }

  return (
    <div className="page consult-page">
      <section className="page-hero page-hero--contact">
        <div className="container">
          <SectionHeader badge={t('consult.badge')} title={t('consult.title')} subtitle={t('consult.subtitle')} light />
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <Reveal className="contact-info" variant="left">
            <SpeakHeading as="h2" extra={how}>{t('consult.howTitle')}</SpeakHeading>
            <ol className="help-steps">
              {how.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="consult-note">
              <HiShieldCheck aria-hidden="true" /> {t('consult.privacyNote')}
            </p>
          </Reveal>

          <Reveal className="contact-form-wrap" variant="right" delay={100}>
            {status === 'sent' ? (
              <div className="contact-success" role="status">
                <HiCheckCircle aria-hidden="true" />
                <SpeakHeading as="h3" body={t('consult.doneText')}>{t('consult.doneTitle')}</SpeakHeading>
                <p>{t('consult.doneText')}</p>
                <button type="button" className="btn btn--outline" onClick={reset}>
                  {t('consult.again')}
                </button>
              </div>
            ) : status === 'failed' ? (
              <div className="contact-success contact-success--failed" role="alert">
                <HiExclamationCircle aria-hidden="true" />
                <h3>{t('consult.failTitle')}</h3>
                <p>{t('consult.failText')}</p>
                <a className="btn btn--primary" href={mailtoUrl(t('consult.messageHeading'), buildText())}>
                  <HiMail aria-hidden="true" /> {t('consult.sendEmail')}
                </a>
                <button type="button" className="btn btn--outline" onClick={() => setStatus('idle')}>
                  {t('consult.tryAgain')}
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <VoiceHelpBanner />
                <label>
                  <VoiceLabel onTranscript={(text) => update('name', appendSpeechText(form.name, text))}>
                    {t('consult.yourName')}
                  </VoiceLabel>
                  <input type="text" name="name" autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                </label>
                <div className="form-row">
                  <label>
                    {t('consult.phone')}
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
                    {t('consult.email')}
                    <input type="email" name="email" autoComplete="email" dir="ltr" value={form.email} onChange={(e) => update('email', e.target.value)} />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    {t('consult.childAge')}
                    <select name="age" value={form.age} onChange={(e) => update('age', e.target.value)} required>
                      <option value="" disabled>{t('consult.selectAge')}</option>
                      {AGE_BANDS.map((band) => (
                        <option key={band} value={band}>{t(`consult.ageBands.${band}`)}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {t('consult.city')}
                    <input type="text" name="city" autoComplete="address-level2" value={form.city} onChange={(e) => update('city', e.target.value)} />
                  </label>
                </div>
                <label>
                  {t('consult.concern')}
                  <select name="concern" value={form.concern} onChange={(e) => update('concern', e.target.value)} required>
                    <option value="" disabled>{t('consult.selectConcern')}</option>
                    {CONCERNS.map((c) => (
                      <option key={c} value={c}>{t(`consult.concerns.${c}`)}</option>
                    ))}
                  </select>
                </label>
                <fieldset className="contact-form__fieldset">
                  <legend>{t('consult.contactBy')}</legend>
                  <div className="contact-form__radios">
                    {[
                      ['whatsapp', 'consult.contactWhatsApp'],
                      ['call', 'consult.contactCall'],
                      ['email', 'consult.contactEmail'],
                    ]
                      .map(([value, key]) => (
                        <label key={value} className="contact-form__radio">
                          <input
                            type="radio"
                            name="contactBy"
                            value={value}
                            checked={form.contactBy === value}
                            onChange={() => update('contactBy', value)}
                          />
                          {t(key)}
                        </label>
                      ))}
                  </div>
                </fieldset>
                <label>
                  <VoiceLabel onTranscript={(text) => update('message', appendSpeechText(form.message, text))}>
                    {t('consult.message')}
                  </VoiceLabel>
                  <textarea name="message" rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} />
                </label>
                <label className="contact-form__consent">
                  <input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} required />
                  <span>
                    {t('pages.contact.consent')} <Link to="/privacy">{t('pages.contact.privacyLink')}</Link>
                  </span>
                </label>
                {error && (
                  <p className="contact-form__error" role="alert">
                    {error}
                  </p>
                )}
                <p className="contact-form__note">{t('pages.contact.deliveryNote')}</p>
                <label className="contact-form__hp" aria-hidden="true">
                  Website
                  <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </label>
                <div className="contact-form__actions">
                  <button type="submit" className="btn btn--primary btn--block" disabled={status === 'sending'}>
                    <HiPaperAirplane aria-hidden="true" /> {status === 'sending' ? t('consult.sending') : t('consult.send')}
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
