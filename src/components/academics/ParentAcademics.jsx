import { useMemo, useState } from 'react'
import { HiBell, HiBookOpen, HiCheck, HiPlus } from 'react-icons/hi'
import { useLanguage } from '../../i18n/LanguageContext'
import { usePortalConfig } from '../../i18n/usePortalConfig'
import { SpeakButton, VoiceLabel } from '../voice/VoiceInput'
import { appendSpeechText } from '../../hooks/useSpeechRecognition'
import {
  addTuitionRequest,
  getLessonUpdatesForParent,
  getSchoolworkGuidance,
  getTuitionRequests,
  markAllGuidanceRead,
  markGuidanceRead,
} from '../../services/parentStorage'

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function formatLessonDate(dateStr) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function labelFor(list, id) {
  return list.find((item) => item.id === id)?.label || id
}

function gradeLabel(grade, portalConfig) {
  return portalConfig.grades.find((g) => g.id === Number(grade))?.label || `Grade ${grade}`
}

export default function ParentAcademics({ parent, refreshKey, onRefresh }) {
  const { t } = useLanguage()
  const portalConfig = usePortalConfig()
  const [section, setSection] = useState('lessons')

  const lessons = useMemo(() => getLessonUpdatesForParent(parent), [parent, refreshKey])
  const tuitionRequests = useMemo(() => getTuitionRequests(parent.id), [parent.id, refreshKey])
  const guidance = useMemo(() => getSchoolworkGuidance(parent.id), [parent.id, refreshKey])
  const unreadGuidance = guidance.filter((g) => !g.read).length
  const pendingTuition = tuitionRequests.filter((r) => r.status === 'pending').length

  const sections = [
    { id: 'lessons', label: t('academics.dailyLessons'), badge: lessons.length },
    { id: 'homework', label: t('academics.homeworkHelp'), badge: pendingTuition },
    { id: 'guidance', label: t('academics.guidance'), badge: unreadGuidance },
  ]

  return (
    <div className="academics-panel">
      <div className="academics-panel__grade-banner">
        <HiBookOpen aria-hidden="true" />
        <div>
          <strong>{t('academics.supportBanner', { grade: gradeLabel(parent.childGrade, portalConfig) })}</strong>
          <span>{t('academics.supportDesc', { childName: parent.childName })}</span>
        </div>
      </div>

      <nav className="academics-panel__tabs" aria-label="Academic sections">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            className={section === s.id ? 'academics-panel__tab--active' : ''}
            onClick={() => setSection(s.id)}
          >
            {s.label}
            {s.badge > 0 && <span className="academics-panel__tab-badge">{s.badge}</span>}
          </button>
        ))}
      </nav>

      {section === 'lessons' && <LessonsSection lessons={lessons} portalConfig={portalConfig} />}
      {section === 'homework' && (
        <HomeworkSection
          parent={parent}
          requests={tuitionRequests}
          portalConfig={portalConfig}
          onSubmitted={onRefresh}
        />
      )}
      {section === 'guidance' && (
        <GuidanceSection
          guidance={guidance}
          portalConfig={portalConfig}
          onRead={(id) => {
            markGuidanceRead(id, parent.id)
            onRefresh()
          }}
          onReadAll={() => {
            markAllGuidanceRead(parent.id)
            onRefresh()
          }}
        />
      )}
    </div>
  )
}

function LessonsSection({ lessons, portalConfig }) {
  const { t } = useLanguage()

  if (lessons.length === 0) {
    return (
      <p className="portal-page__empty">
        {t('academics.noLessons')}
      </p>
    )
  }

  return (
    <div className="academics-panel__feed">
      {lessons.map((lesson) => (
        <article key={lesson.id} className="academics-card interactive-card">
          <header className="academics-card__header">
            <span className="parent-dashboard__tag">{formatLessonDate(lesson.date)}</span>
            <span className="parent-dashboard__tag">{gradeLabel(lesson.grade, portalConfig)}</span>
            {lesson.audience === 'grade' && (
              <span className="parent-dashboard__tag parent-dashboard__tag--confirmed">{t('academics.gradeWide')}</span>
            )}
          </header>
          <h4>{lesson.topics}</h4>
          {lesson.subjects?.length > 0 && (
            <div className="academics-card__subjects">
              {lesson.subjects.map((s) => (
                <span key={s} className="academics-card__subject">{s}</span>
              ))}
            </div>
          )}
          <p>{lesson.summary}</p>
          <SpeakButton text={lesson.summary} />
          {lesson.homework && (
            <div className="academics-card__homework">
              <strong>{t('academics.homeworkPractice')}</strong>
              <p>{lesson.homework}</p>
              <SpeakButton text={lesson.homework} label={t('academics.listenHomework')} />
            </div>
          )}
          <footer className="academics-card__footer">
            {t('academics.postedBy', { name: lesson.educatorName })}
          </footer>
        </article>
      ))}
    </div>
  )
}

function HomeworkSection({ parent, requests, portalConfig, onSubmitted }) {
  const { t } = useLanguage()
  const [form, setForm] = useState({
    subject: portalConfig.subjects[0],
    requestType: 'homework',
    description: '',
    preferredTimes: '',
  })
  const [success, setSuccess] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    addTuitionRequest({
      id: createId('tuition'),
      parentId: parent.id,
      parentName: parent.name,
      childName: parent.childName,
      grade: Number(parent.childGrade) || 1,
      ...form,
      status: 'pending',
      offerNote: '',
      offerSchedule: '',
      createdAt: new Date().toISOString(),
    })
    setForm({
      subject: portalConfig.subjects[0],
      requestType: 'homework',
      description: '',
      preferredTimes: '',
    })
    setSuccess(true)
    onSubmitted()
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <div className="portal-page__split">
      <div className="parent-portal__auth-card">
        <h2>{t('academics.requestHelp')}</h2>
        <p className="parent-portal__auth-sub">
          {t('academics.requestHelpDesc')}
        </p>

        {success && (
          <div className="parent-portal__alert parent-portal__alert--success">
            {t('academics.requestSent')}
          </div>
        )}

        <form className="parent-portal__form" onSubmit={handleSubmit}>
          <label>
            {t('academics.subject')}
            <select value={form.subject} onChange={(e) => update('subject', e.target.value)} required>
              {portalConfig.subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            {t('academics.supportType')}
            <select value={form.requestType} onChange={(e) => update('requestType', e.target.value)} required>
              {portalConfig.tuitionRequestTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </label>
          <label>
            <VoiceLabel onTranscript={(text) => update('description', appendSpeechText(form.description, text))}>
              {t('academics.needHelp')}
            </VoiceLabel>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              required
              placeholder="Describe the assignment, topic, or skills your child is struggling with..."
            />
          </label>
          <label>
            <VoiceLabel onTranscript={(text) => update('preferredTimes', appendSpeechText(form.preferredTimes, text))}>
              {t('academics.preferredTimes')}
            </VoiceLabel>
            <input
              type="text"
              value={form.preferredTimes}
              onChange={(e) => update('preferredTimes', e.target.value)}
              placeholder="e.g. Weekday evenings, Saturday mornings"
            />
          </label>
          <button type="submit" className="btn btn--primary btn--block">
            <HiPlus /> {t('academics.submitRequest')}
          </button>
        </form>
      </div>

      <div className="portal-page__list">
        <h3>{t('academics.yourRequests')}</h3>
        {requests.length === 0 ? (
          <p className="portal-page__empty">{t('academics.noRequests')}</p>
        ) : (
          requests.map((r) => <TuitionRequestCard key={r.id} request={r} portalConfig={portalConfig} />)
        )}
      </div>
    </div>
  )
}

function TuitionRequestCard({ request, portalConfig }) {
  const { t } = useLanguage()

  return (
    <article className="academics-card interactive-card">
      <header className="academics-card__header">
        <span className="parent-dashboard__tag">{request.subject}</span>
        <span className="admin-badge">
          {labelFor(portalConfig.tuitionStatuses, request.status)}
        </span>
      </header>
      <h4>{labelFor(portalConfig.tuitionRequestTypes, request.requestType)}</h4>
      <p>{request.description}</p>
      {request.preferredTimes && (
        <p className="admin-card__detail">{t('academics.preferredTimes')}: {request.preferredTimes}</p>
      )}
      {request.offerNote && (
        <div className="academics-card__offer">
          <strong>{t('academics.educatorResponse')}</strong>
          <p>{request.offerNote}</p>
          {request.offerSchedule && <p className="admin-card__detail">{t('academics.proposedSchedule')}: {request.offerSchedule}</p>}
        </div>
      )}
      <footer className="academics-card__footer">
        {t('common.submitted')} {new Date(request.createdAt).toLocaleDateString()}
      </footer>
    </article>
  )
}

function GuidanceSection({ guidance, portalConfig, onRead, onReadAll }) {
  const { t } = useLanguage()
  const unread = guidance.filter((g) => !g.read)

  if (guidance.length === 0) {
    return (
      <p className="portal-page__empty">
        {t('academics.noGuidance')}
      </p>
    )
  }

  return (
    <div className="academics-panel__feed">
      {unread.length > 0 && (
        <div className="academics-panel__actions">
          <button type="button" className="btn btn--outline btn--sm" onClick={onReadAll}>
            <HiCheck /> {t('common.markAllRead')}
          </button>
        </div>
      )}
      {guidance.map((item) => (
        <article
          key={item.id}
          className={`academics-card interactive-card ${!item.read ? 'academics-card--unread' : ''}`}
        >
          <header className="academics-card__header">
            <span className={`parent-dashboard__urgency parent-dashboard__urgency--${item.priority === 'important' ? 'high' : 'low'}`}>
              <HiBell aria-hidden="true" />
              {labelFor(portalConfig.guidancePriorities, item.priority)}
            </span>
            {!item.read && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => onRead(item.id)}>
                {t('common.markRead')}
              </button>
            )}
          </header>
          <h4>{item.title}</h4>
          <p>{item.message}</p>
          <SpeakButton text={`${item.title}. ${item.message}`} />
          {item.tips && (
            <div className="academics-card__homework">
              <strong>{t('academics.howToHelp')}</strong>
              <p>{item.tips}</p>
              <SpeakButton text={item.tips} label={t('academics.listenTips')} />
            </div>
          )}
          <footer className="academics-card__footer">
            {new Date(item.createdAt).toLocaleDateString()}
          </footer>
        </article>
      ))}
    </div>
  )
}
