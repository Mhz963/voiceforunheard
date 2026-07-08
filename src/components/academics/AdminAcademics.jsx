import { useMemo, useState } from 'react'
import { HiCheck, HiPlus } from 'react-icons/hi'
import { useLanguage } from '../../i18n/LanguageContext'
import { useToast } from '../../context/ToastContext'
import { usePortalConfig } from '../../i18n/usePortalConfig'
import {
  addLessonUpdate,
  addSchoolworkGuidance,
  getAllLessonUpdates,
  getAllSchoolworkGuidance,
  getAllTuitionRequests,
  getParents,
  updateTuitionRequest,
} from '../../services/parentStorage'

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function formatLessonDate(dateStr) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
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

export default function AdminAcademics({ admin, refreshKey, onRefresh }) {
  const { t } = useLanguage()
  const portalConfig = usePortalConfig()
  const [section, setSection] = useState('lessons')

  const parents = useMemo(() => getParents().filter((p) => p.approved), [refreshKey])
  const lessons = useMemo(() => getAllLessonUpdates(), [refreshKey])
  const tuitionRequests = useMemo(() => getAllTuitionRequests(), [refreshKey])
  const guidance = useMemo(() => getAllSchoolworkGuidance(), [refreshKey])
  const pendingTuition = tuitionRequests.filter((r) => r.status === 'pending').length

  const sections = [
    { id: 'lessons', label: t('academics.postLessons') },
    { id: 'tuition', label: t('academics.homeworkRequests'), badge: pendingTuition },
    { id: 'guidance', label: t('academics.sendGuidanceTab') },
    { id: 'history', label: t('academics.history') },
  ]

  return (
    <div className="academics-panel">
      <nav className="academics-panel__tabs" aria-label="Academic admin sections">
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

      {section === 'lessons' && (
        <PostLessonForm parents={parents} admin={admin} portalConfig={portalConfig} onPosted={onRefresh} />
      )}
      {section === 'tuition' && (
        <TuitionManageList requests={tuitionRequests} portalConfig={portalConfig} onUpdate={onRefresh} />
      )}
      {section === 'guidance' && (
        <PostGuidanceForm parents={parents} admin={admin} portalConfig={portalConfig} onPosted={onRefresh} />
      )}
      {section === 'history' && (
        <HistorySection lessons={lessons} guidance={guidance} portalConfig={portalConfig} />
      )}
    </div>
  )
}

function PostLessonForm({ parents, admin, portalConfig, onPosted }) {
  const { t } = useLanguage()
  const toast = useToast()
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    audience: 'parent',
    parentId: parents[0]?.id || '',
    grade: 1,
    date: today,
    subjects: [portalConfig.subjects[0]],
    topics: '',
    summary: '',
    homework: '',
  })
  const [success, setSuccess] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleSubject(subject) {
    setForm((prev) => {
      const subjects = prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject]
      return { ...prev, subjects: subjects.length ? subjects : [subject] }
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const parent = parents.find((p) => p.id === form.parentId)
    const grade =
      form.audience === 'grade'
        ? Number(form.grade)
        : Number(parent?.childGrade) || Number(form.grade)

    addLessonUpdate({
      id: createId('lesson'),
      audience: form.audience,
      parentId: form.audience === 'parent' ? form.parentId : null,
      parentName: parent?.name || '',
      childName: parent?.childName || '',
      grade,
      date: form.date,
      subjects: form.subjects,
      topics: form.topics.trim(),
      summary: form.summary.trim(),
      homework: form.homework.trim(),
      educatorName: admin.name,
      createdAt: new Date().toISOString(),
    })

    setForm((prev) => ({ ...prev, topics: '', summary: '', homework: '' }))
    setSuccess(true)
    toast.successT('toasts.lessonPostedTitle', 'toasts.lessonPostedMessage')
    onPosted()
    setTimeout(() => setSuccess(false), 4000)
  }

  if (parents.length === 0) {
    return <p className="portal-page__empty">{t('academics.approveOneParent')}</p>
  }

  return (
    <div className="parent-portal__auth-card academics-panel__form-card">
      <h2>{t('academics.postLesson')}</h2>
      <p className="parent-portal__auth-sub">
        {t('academics.postLessonDesc')}
      </p>

      {success && (
        <div className="parent-portal__alert parent-portal__alert--success">
          {t('academics.lessonPublished')}
        </div>
      )}

      <form className="parent-portal__form" onSubmit={handleSubmit}>
        <label>
          {t('academics.shareWith')}
          <select value={form.audience} onChange={(e) => update('audience', e.target.value)}>
            <option value="parent">{t('academics.oneFamily')}</option>
            <option value="grade">{t('academics.allGrade')}</option>
          </select>
        </label>

        {form.audience === 'parent' ? (
          <label>
            {t('academics.family')}
            <select value={form.parentId} onChange={(e) => update('parentId', e.target.value)} required>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.childName} — {p.name} ({gradeLabel(p.childGrade, portalConfig)})
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            {t('academics.gradeLevel')}
            <select value={form.grade} onChange={(e) => update('grade', Number(e.target.value))}>
              {portalConfig.grades.map((g) => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </label>
        )}

        <label>
          {t('academics.lessonDate')}
          <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} required />
        </label>

        <fieldset className="academics-panel__subject-field">
          <legend>{t('academics.subjectsCovered')}</legend>
          <div className="academics-panel__subject-grid">
            {portalConfig.subjects.map((s) => (
              <label key={s} className="academics-panel__subject-check">
                <input
                  type="checkbox"
                  checked={form.subjects.includes(s)}
                  onChange={() => toggleSubject(s)}
                />
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        <label>
          {t('academics.topicsTaught')}
          <input
            type="text"
            value={form.topics}
            onChange={(e) => update('topics', e.target.value)}
            required
          />
        </label>
        <label>
          {t('academics.summaryForParents')}
          <textarea
            rows={4}
            value={form.summary}
            onChange={(e) => update('summary', e.target.value)}
            required
          />
        </label>
        <label>
          {t('academics.homeworkOptional')}
          <textarea
            rows={3}
            value={form.homework}
            onChange={(e) => update('homework', e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn--primary">
          <HiPlus /> {t('academics.publishUpdate')}
        </button>
      </form>
    </div>
  )
}

function PostGuidanceForm({ parents, admin, portalConfig, onPosted }) {
  const { t } = useLanguage()
  const toast = useToast()
  const [form, setForm] = useState({
    parentId: parents[0]?.id || '',
    title: '',
    message: '',
    tips: '',
    priority: 'normal',
  })
  const [success, setSuccess] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const parent = parents.find((p) => p.id === form.parentId)
    if (!parent) return

    addSchoolworkGuidance({
      id: createId('guidance'),
      parentId: parent.id,
      parentName: parent.name,
      childName: parent.childName,
      grade: Number(parent.childGrade) || 1,
      title: form.title.trim(),
      message: form.message.trim(),
      tips: form.tips.trim(),
      priority: form.priority,
      read: false,
      educatorName: admin.name,
      createdAt: new Date().toISOString(),
    })

    setForm((prev) => ({ ...prev, title: '', message: '', tips: '' }))
    setSuccess(true)
    toast.successT('toasts.guidancePostedTitle', 'toasts.guidancePostedMessage')
    onPosted()
    setTimeout(() => setSuccess(false), 4000)
  }

  if (parents.length === 0) {
    return <p className="portal-page__empty">{t('academics.approveOneParent')}</p>
  }

  return (
    <div className="parent-portal__auth-card academics-panel__form-card">
      <h2>{t('academics.sendGuidance')}</h2>
      <p className="parent-portal__auth-sub">
        {t('academics.sendGuidanceDesc')}
      </p>

      {success && (
        <div className="parent-portal__alert parent-portal__alert--success">
          {t('academics.guidanceSent')}
        </div>
      )}

      <form className="parent-portal__form" onSubmit={handleSubmit}>
        <label>
          {t('academics.family')}
          <select value={form.parentId} onChange={(e) => update('parentId', e.target.value)} required>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.childName} — {p.name} ({gradeLabel(p.childGrade, portalConfig)})
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('academics.priority')}
          <select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
            {portalConfig.guidancePriorities.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>
        <label>
          {t('academics.title')}
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            required
          />
        </label>
        <label>
          {t('academics.message')}
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            required
          />
        </label>
        <label>
          {t('academics.tipsOptional')}
          <textarea
            rows={3}
            value={form.tips}
            onChange={(e) => update('tips', e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn--primary">
          <HiPlus /> {t('academics.sendGuidanceBtn')}
        </button>
      </form>
    </div>
  )
}

function TuitionManageList({ requests, portalConfig, onUpdate }) {
  const { t } = useLanguage()
  const toast = useToast()
  const [notes, setNotes] = useState({})
  const [schedules, setSchedules] = useState({})

  if (requests.length === 0) {
    return <p className="portal-page__empty">{t('academics.noHomeworkRequests')}</p>
  }

  return (
    <div className="portal-page__list">
      {requests.map((r) => (
        <article key={r.id} className="academics-card interactive-card">
          <header className="academics-card__header">
            <span className="parent-dashboard__tag">{r.childName} · {gradeLabel(r.grade, portalConfig)}</span>
            <span className="parent-dashboard__tag">{r.subject}</span>
            <span className="admin-badge">
              {labelFor(portalConfig.tuitionStatuses, r.status)}
            </span>
          </header>
          <h4>{labelFor(portalConfig.tuitionRequestTypes, r.requestType)}</h4>
          <p className="admin-card__detail">{t('common.from')} {r.parentName}</p>
          <p>{r.description}</p>
          {r.preferredTimes && (
            <p className="admin-card__detail">{t('academics.preferredTimes')}: {r.preferredTimes}</p>
          )}

          {r.status === 'pending' && (
            <>
              <label className="admin-card__note">
                {t('academics.offerResponse')}
                <textarea
                  rows={2}
                  value={notes[r.id] || ''}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                />
              </label>
              <label className="admin-card__note">
                {t('academics.proposedSchedule')}
                <input
                  type="text"
                  value={schedules[r.id] || ''}
                  onChange={(e) => setSchedules((prev) => ({ ...prev, [r.id]: e.target.value }))}
                />
              </label>
              <div className="admin-card__actions">
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => {
                    updateTuitionRequest(r.id, {
                      status: 'offered',
                      offerNote: notes[r.id] || 'Support has been arranged.',
                      offerSchedule: schedules[r.id] || '',
                    })
                    toast.successT('toasts.tuitionUpdatedTitle', 'toasts.tuitionApprovedMessage')
                    onUpdate()
                  }}
                >
                  <HiCheck /> {t('academics.sendOffer')}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    updateTuitionRequest(r.id, { status: 'declined', offerNote: notes[r.id] || '' })
                    toast.successT('toasts.savedTitle', 'toasts.savedMessage')
                    onUpdate()
                  }}
                >
                  {t('academics.decline')}
                </button>
              </div>
            </>
          )}

          {r.status !== 'pending' && r.offerNote && (
            <div className="academics-card__offer">
              <strong>{t('academics.responseSent')}</strong>
              <p>{r.offerNote}</p>
              {r.offerSchedule && <p className="admin-card__detail">{t('academics.proposedSchedule')}: {r.offerSchedule}</p>}
            </div>
          )}

          {['offered', 'scheduled'].includes(r.status) && (
            <div className="admin-card__actions">
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => {
                  updateTuitionRequest(r.id, { status: 'scheduled' })
                  toast.successT('toasts.tuitionUpdatedTitle', 'toasts.tuitionApprovedMessage')
                  onUpdate()
                }}
              >
                {t('academics.markScheduled')}
              </button>
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={() => {
                  updateTuitionRequest(r.id, { status: 'completed' })
                  toast.successT('toasts.tuitionUpdatedTitle', 'toasts.tuitionCompletedMessage')
                  onUpdate()
                }}
              >
                <HiCheck /> {t('adminPortal.markCompleted')}
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

function HistorySection({ lessons, guidance, portalConfig }) {
  const { t } = useLanguage()

  if (lessons.length === 0 && guidance.length === 0) {
    return <p className="portal-page__empty">{t('academics.noAcademicPosts')}</p>
  }

  return (
    <div className="academics-panel__feed">
      {lessons.slice(0, 10).map((lesson) => (
        <article key={lesson.id} className="academics-card interactive-card">
          <header className="academics-card__header">
            <span className="parent-dashboard__tag">Lesson · {formatLessonDate(lesson.date)}</span>
            <span className="parent-dashboard__tag">{gradeLabel(lesson.grade, portalConfig)}</span>
          </header>
          <h4>{lesson.topics}</h4>
          <p className="admin-card__detail">
            {lesson.audience === 'grade'
              ? t('academics.gradeWideUpdate')
              : `${lesson.childName} — ${lesson.parentName}`}
          </p>
          <p>{lesson.summary}</p>
        </article>
      ))}
      {guidance.slice(0, 10).map((item) => (
        <article key={item.id} className="academics-card interactive-card">
          <header className="academics-card__header">
            <span className="parent-dashboard__tag">{t('academics.guidance')}</span>
            <span className="parent-dashboard__tag">{item.childName}</span>
          </header>
          <h4>{item.title}</h4>
          <p>{item.message}</p>
        </article>
      ))}
    </div>
  )
}
