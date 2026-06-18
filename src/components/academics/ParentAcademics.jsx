import { useMemo, useState } from 'react'
import { HiBell, HiBookOpen, HiCheck, HiPlus } from 'react-icons/hi'
import { parentPortalConfig } from '../../data/parentPortal'
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

function gradeLabel(grade) {
  return parentPortalConfig.grades.find((g) => g.id === Number(grade))?.label || `Grade ${grade}`
}

export default function ParentAcademics({ parent, refreshKey, onRefresh }) {
  const [section, setSection] = useState('lessons')

  const lessons = useMemo(() => getLessonUpdatesForParent(parent), [parent, refreshKey])
  const tuitionRequests = useMemo(() => getTuitionRequests(parent.id), [parent.id, refreshKey])
  const guidance = useMemo(() => getSchoolworkGuidance(parent.id), [parent.id, refreshKey])
  const unreadGuidance = guidance.filter((g) => !g.read).length
  const pendingTuition = tuitionRequests.filter((r) => r.status === 'pending').length

  const sections = [
    { id: 'lessons', label: 'Daily Lessons', badge: lessons.length },
    { id: 'homework', label: 'Homework Help', badge: pendingTuition },
    { id: 'guidance', label: 'Guidance', badge: unreadGuidance },
  ]

  return (
    <div className="academics-panel">
      <div className="academics-panel__grade-banner">
        <HiBookOpen aria-hidden="true" />
        <div>
          <strong>Academic support — {gradeLabel(parent.childGrade)}</strong>
          <span>Grades 1–10 lesson updates, homework help, and schoolwork guidance for {parent.childName}</span>
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

      {section === 'lessons' && <LessonsSection lessons={lessons} />}
      {section === 'homework' && (
        <HomeworkSection
          parent={parent}
          requests={tuitionRequests}
          onSubmitted={onRefresh}
        />
      )}
      {section === 'guidance' && (
        <GuidanceSection
          guidance={guidance}
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

function LessonsSection({ lessons }) {
  if (lessons.length === 0) {
    return (
      <p className="portal-page__empty">
        No lesson updates yet. Your educator will post daily topics and homework notes here.
      </p>
    )
  }

  return (
    <div className="academics-panel__feed">
      {lessons.map((lesson) => (
        <article key={lesson.id} className="academics-card interactive-card">
          <header className="academics-card__header">
            <span className="parent-dashboard__tag">{formatLessonDate(lesson.date)}</span>
            <span className="parent-dashboard__tag">{gradeLabel(lesson.grade)}</span>
            {lesson.audience === 'grade' && (
              <span className="parent-dashboard__tag parent-dashboard__tag--confirmed">Grade-wide</span>
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
          <SpeakButton text={lesson.summary} label="Listen" />
          {lesson.homework && (
            <div className="academics-card__homework">
              <strong>Homework & practice</strong>
              <p>{lesson.homework}</p>
              <SpeakButton text={lesson.homework} label="Listen to homework" />
            </div>
          )}
          <footer className="academics-card__footer">
            Posted by {lesson.educatorName}
          </footer>
        </article>
      ))}
    </div>
  )
}

function HomeworkSection({ parent, requests, onSubmitted }) {
  const [form, setForm] = useState({
    subject: parentPortalConfig.subjects[0],
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
      subject: parentPortalConfig.subjects[0],
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
        <h2>Request Homework or Tuition Help</h2>
        <p className="parent-portal__auth-sub">
          Ask your educator to arrange extra support for schoolwork, assignments, or subject tutoring.
        </p>

        {success && (
          <div className="parent-portal__alert parent-portal__alert--success">
            Your request has been sent. Your educator will respond with options soon.
          </div>
        )}

        <form className="parent-portal__form" onSubmit={handleSubmit}>
          <label>
            Subject
            <select value={form.subject} onChange={(e) => update('subject', e.target.value)} required>
              {parentPortalConfig.subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Type of support
            <select value={form.requestType} onChange={(e) => update('requestType', e.target.value)} required>
              {parentPortalConfig.tuitionRequestTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </label>
          <label>
            <VoiceLabel onTranscript={(text) => update('description', appendSpeechText(form.description, text))}>
              What does your child need help with?
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
              Preferred days or times (optional)
            </VoiceLabel>
            <input
              type="text"
              value={form.preferredTimes}
              onChange={(e) => update('preferredTimes', e.target.value)}
              placeholder="e.g. Weekday evenings, Saturday mornings"
            />
          </label>
          <button type="submit" className="btn btn--primary btn--block">
            <HiPlus /> Submit Request
          </button>
        </form>
      </div>

      <div className="portal-page__list">
        <h3>Your Requests</h3>
        {requests.length === 0 ? (
          <p className="portal-page__empty">No homework or tuition requests yet.</p>
        ) : (
          requests.map((r) => <TuitionRequestCard key={r.id} request={r} />)
        )}
      </div>
    </div>
  )
}

function TuitionRequestCard({ request }) {
  return (
    <article className="academics-card interactive-card">
      <header className="academics-card__header">
        <span className="parent-dashboard__tag">{request.subject}</span>
        <span className="admin-badge">
          {labelFor(parentPortalConfig.tuitionStatuses, request.status)}
        </span>
      </header>
      <h4>{labelFor(parentPortalConfig.tuitionRequestTypes, request.requestType)}</h4>
      <p>{request.description}</p>
      {request.preferredTimes && (
        <p className="admin-card__detail">Preferred times: {request.preferredTimes}</p>
      )}
      {request.offerNote && (
        <div className="academics-card__offer">
          <strong>Educator response</strong>
          <p>{request.offerNote}</p>
          {request.offerSchedule && <p className="admin-card__detail">Schedule: {request.offerSchedule}</p>}
        </div>
      )}
      <footer className="academics-card__footer">
        Submitted {new Date(request.createdAt).toLocaleDateString()}
      </footer>
    </article>
  )
}

function GuidanceSection({ guidance, onRead, onReadAll }) {
  const unread = guidance.filter((g) => !g.read)

  if (guidance.length === 0) {
    return (
      <p className="portal-page__empty">
        No schoolwork guidance yet. Tips and reminders from your educator will appear here.
      </p>
    )
  }

  return (
    <div className="academics-panel__feed">
      {unread.length > 0 && (
        <div className="academics-panel__actions">
          <button type="button" className="btn btn--outline btn--sm" onClick={onReadAll}>
            <HiCheck /> Mark all as read
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
              {labelFor(parentPortalConfig.guidancePriorities, item.priority)}
            </span>
            {!item.read && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => onRead(item.id)}>
                Mark read
              </button>
            )}
          </header>
          <h4>{item.title}</h4>
          <p>{item.message}</p>
          <SpeakButton text={`${item.title}. ${item.message}`} />
          {item.tips && (
            <div className="academics-card__homework">
              <strong>How to help at home</strong>
              <p>{item.tips}</p>
              <SpeakButton text={item.tips} label="Listen to tips" />
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
