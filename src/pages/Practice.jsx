import { useEffect, useMemo, useState } from 'react'
import { HiExternalLink, HiPrinter, HiExclamation } from 'react-icons/hi'
import SectionHeader from '../components/ui/SectionHeader'
import Reveal from '../components/ui/Reveal'
import { SpeakHeading } from '../components/voice/SpeakAloud'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'

const SOUND_KEYS = ['m', 'oo', 'ah', 'ee', 'sh', 's']
const RESULTS = ['repeated', 'heard', 'missed']
const LING_KEY = 'vfu_ling_checks'
const MILESTONE_KEY = 'vfu_milestones'

// Per-viewer convenience only: results never leave this device.
function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable: keep in memory only */
  }
}

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function LingCheck({ t, locale }) {
  const [checks, setChecks] = useState(() => readStore(LING_KEY, {}))
  const today = todayKey()
  const todayResults = checks[today] || {}

  useEffect(() => writeStore(LING_KEY, checks), [checks])

  function setResult(sound, result) {
    setChecks((prev) => {
      const day = { ...(prev[today] || {}) }
      if (day[sound] === result) delete day[sound]
      else day[sound] = result
      return { ...prev, [today]: day }
    })
  }

  function clearToday() {
    setChecks((prev) => {
      const next = { ...prev }
      delete next[today]
      return next
    })
  }

  const history = Object.entries(checks)
    .filter(([date, day]) => date !== today && Object.keys(day).length)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 7)

  const dateFmt = new Intl.DateTimeFormat(locale === 'ur' ? 'ur-PK-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'short' })
  const resultLabel = (r) => t(`practice.result${r.charAt(0).toUpperCase()}${r.slice(1)}`)
  const resultSymbol = { repeated: '✓✓', heard: '✓', missed: '✗' }

  return (
    <section className="section" aria-labelledby="ling-title">
      <div className="container">
        <Reveal>
          <SpeakHeading as="h2" id="ling-title" body={t('practice.lingIntro')} headingClassName="practice-title">
            {t('practice.lingTitle')}
          </SpeakHeading>
          <p className="practice-intro">{t('practice.lingIntro')}</p>
        </Reveal>

        <div className="practice-two-col">
          <Reveal className="practice-card">
            <SpeakHeading as="h3" extra={t('practice.lingSteps')}>{t('practice.lingStepsTitle')}</SpeakHeading>
            <ol className="help-steps">
              {t('practice.lingSteps').map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="practice-warning">
              <HiExclamation aria-hidden="true" /> {t('practice.lingWarning')}
            </p>
          </Reveal>

          <Reveal className="practice-card">
            <h3 className="practice-card__title">
              {t('practice.todayLabel')} · {dateFmt.format(new Date())}
            </h3>
            <ul className="ling-grid">
              {SOUND_KEYS.map((key) => {
                const sound = t(`practice.sounds.${key}`)
                return (
                  <li key={key} className="ling-sound">
                    <div className="ling-sound__head">
                      <span className="ling-sound__glyph" lang="en">/{sound.label}/</span>
                      <span className="ling-sound__urdu" lang="ur">{sound.urdu}</span>
                    </div>
                    <span className="ling-sound__example">{sound.example}</span>
                    <span className="ling-sound__pitch">{sound.pitch}</span>
                    <div className="ling-sound__results" role="group" aria-label={`/${sound.label}/`}>
                      {RESULTS.map((r) => (
                        <button
                          key={r}
                          type="button"
                          className={`ling-result ling-result--${r} ${todayResults[key] === r ? 'is-active' : ''}`}
                          aria-pressed={todayResults[key] === r}
                          onClick={() => setResult(key, r)}
                        >
                          {resultLabel(r)}
                        </button>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="practice-actions">
              <button type="button" className="btn btn--outline" onClick={() => window.print()}>
                <HiPrinter aria-hidden="true" /> {t('common.print')}
              </button>
              {Object.keys(todayResults).length > 0 && (
                <button type="button" className="btn btn--outline" onClick={clearToday}>
                  {t('practice.clearToday')}
                </button>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal className="practice-card practice-history">
          <h3 className="practice-card__title">{t('practice.historyTitle')}</h3>
          {history.length === 0 ? (
            <p>{t('practice.historyEmpty')}</p>
          ) : (
            <div className="practice-history__scroll">
              <table className="practice-history__table">
                <thead>
                  <tr>
                    <th scope="col">&nbsp;</th>
                    {SOUND_KEYS.map((key) => (
                      <th key={key} scope="col">/{t(`practice.sounds.${key}`).label}/</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map(([date, day]) => (
                    <tr key={date}>
                      <th scope="row">{dateFmt.format(new Date(`${date}T12:00:00`))}</th>
                      {SOUND_KEYS.map((key) => (
                        <td key={key} title={day[key] ? resultLabel(day[key]) : ''}>
                          {day[key] ? (
                            <>
                              <span aria-hidden="true">{resultSymbol[day[key]]}</span>
                              <span className="visually-hidden">{resultLabel(day[key])}</span>
                            </>
                          ) : '–'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function MilestoneChecklist({ t }) {
  const { ageGroups } = useLocalizedContent()
  const [groupId, setGroupId] = useState(ageGroups[1]?.id ?? ageGroups[0].id)
  const [ticked, setTicked] = useState(() => readStore(MILESTONE_KEY, {}))
  useEffect(() => writeStore(MILESTONE_KEY, ticked), [ticked])

  const group = useMemo(() => ageGroups.find((g) => g.id === groupId) ?? ageGroups[0], [ageGroups, groupId])
  const done = group.milestones.filter((_, i) => ticked[`${group.id}:${i}`]).length

  function toggle(i) {
    const key = `${group.id}:${i}`
    setTicked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <section className="section section--alt" id="milestones" aria-labelledby="milestones-title">
      <div className="container">
        <Reveal>
          <SpeakHeading as="h2" id="milestones-title" body={t('practice.milestonesIntro')} headingClassName="practice-title">
            {t('practice.milestonesTitle')}
          </SpeakHeading>
          <p className="practice-intro">{t('practice.milestonesIntro')}</p>
        </Reveal>
        <Reveal className="practice-card">
          <div className="age-tabs" role="tablist" aria-label={t('practice.selectAge')}>
            {ageGroups.map((g) => (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={g.id === group.id}
                className={`age-tab ${g.id === group.id ? 'is-active' : ''}`}
                onClick={() => setGroupId(g.id)}
              >
                <strong>{g.title}</strong>
                <span>{g.range}</span>
              </button>
            ))}
          </div>
          <div role="tabpanel">
            <p className="milestone-focus">{group.focus}</p>
            <ul className="milestone-list">
              {group.milestones.map((m, i) => (
                <li key={m}>
                  <label>
                    <input type="checkbox" checked={Boolean(ticked[`${group.id}:${i}`])} onChange={() => toggle(i)} />
                    <span>{m}</span>
                  </label>
                </li>
              ))}
            </ul>
            <p className="milestone-progress" aria-live="polite">
              {t('practice.milestoneProgress', { done, total: group.milestones.length })}
            </p>
            <button type="button" className="btn btn--outline" onClick={() => window.print()}>
              <HiPrinter aria-hidden="true" /> {t('common.print')}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function Practice() {
  const { t, locale } = useLanguage()

  useEffect(() => {
    if (window.location.hash === '#milestones') {
      document.getElementById('milestones')?.scrollIntoView()
    }
  }, [])

  return (
    <div className="page practice-page">
      <section className="page-hero page-hero--resources">
        <div className="container">
          <SectionHeader badge={t('practice.badge')} title={t('practice.title')} subtitle={t('practice.subtitle')} light />
        </div>
      </section>

      <LingCheck t={t} locale={locale} />
      <MilestoneChecklist t={t} />

      <section className="section section--compact">
        <div className="container">
          <Reveal className="practice-cta">
            <div>
              <SpeakHeading as="h2" body={t('practice.pslText')}>{t('practice.pslTitle')}</SpeakHeading>
              <p>{t('practice.pslText')}</p>
            </div>
            <a href="https://new.psl.org.pk/resources" target="_blank" rel="noopener noreferrer" className="btn btn--primary">
              {t('practice.pslLink')} <HiExternalLink aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
