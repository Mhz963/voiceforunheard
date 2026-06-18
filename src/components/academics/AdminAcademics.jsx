import { useMemo, useState } from 'react'
import { HiCheck, HiPlus } from 'react-icons/hi'
import { parentPortalConfig } from '../../data/parentPortal'
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

function gradeLabel(grade) {
  return parentPortalConfig.grades.find((g) => g.id === Number(grade))?.label || `Grade ${grade}`
}

export default function AdminAcademics({ admin, refreshKey, onRefresh }) {
  const [section, setSection] = useState('lessons')

  const parents = useMemo(() => getParents().filter((p) => p.approved), [refreshKey])
  const lessons = useMemo(() => getAllLessonUpdates(), [refreshKey])
  const tuitionRequests = useMemo(() => getAllTuitionRequests(), [refreshKey])
  const guidance = useMemo(() => getAllSchoolworkGuidance(), [refreshKey])
  const pendingTuition = tuitionRequests.filter((r) => r.status === 'pending').length

  const sections = [
    { id: 'lessons', label: 'Post Lessons' },
    { id: 'tuition', label: 'Homework Requests', badge: pendingTuition },
    { id: 'guidance', label: 'Send Guidance' },
    { id: 'history', label: 'History' },
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
        <PostLessonForm parents={parents} admin={admin} onPosted={onRefresh} />
      )}
      {section === 'tuition' && (
        <TuitionManageList requests={tuitionRequests} onUpdate={onRefresh} />
      )}
      {section === 'guidance' && (
        <PostGuidanceForm parents={parents} admin={admin} onPosted={onRefresh} />
      )}
      {section === 'history' && (
        <HistorySection lessons={lessons} guidance={guidance} />
      )}
    </div>
  )
}

function PostLessonForm({ parents, admin, onPosted }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    audience: 'parent',
    parentId: parents[0]?.id || '',
    grade: 1,
    date: today,
    subjects: [parentPortalConfig.subjects[0]],
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
    onPosted()
    setTimeout(() => setSuccess(false), 4000)
  }

  if (parents.length === 0) {
    return <p className="portal-page__empty">Approve at least one parent before posting lesson updates.</p>
  }

  return (
    <div className="parent-portal__auth-card academics-panel__form-card">
      <h2>Post Daily Lesson Update</h2>
      <p className="parent-portal__auth-sub">
        Share what was taught today so parents can follow along and support learning at home.
      </p>

      {success && (
        <div className="parent-portal__alert parent-portal__alert--success">
          Lesson update published successfully.
        </div>
      )}

      <form className="parent-portal__form" onSubmit={handleSubmit}>
        <label>
          Share with
          <select value={form.audience} onChange={(e) => update('audience', e.target.value)}>
            <option value="parent">One family</option>
            <option value="grade">All families in a grade (1–10)</option>
          </select>
        </label>

        {form.audience === 'parent' ? (
          <label>
            Family
            <select value={form.parentId} onChange={(e) => update('parentId', e.target.value)} required>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.childName} — {p.name} ({gradeLabel(p.childGrade)})
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            Grade level
            <select value={form.grade} onChange={(e) => update('grade', Number(e.target.value))}>
              {parentPortalConfig.grades.map((g) => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </label>
        )}

        <label>
          Lesson date
          <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} required />
        </label>

        <fieldset className="academics-panel__subject-field">
          <legend>Subjects covered</legend>
          <div className="academics-panel__subject-grid">
            {parentPortalConfig.subjects.map((s) => (
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
          Topics / lessons taught
          <input
            type="text"
            value={form.topics}
            onChange={(e) => update('topics', e.target.value)}
            required
            placeholder="e.g. Fractions, reading comprehension strategies"
          />
        </label>
        <label>
          Summary for parents
          <textarea
            rows={4}
            value={form.summary}
            onChange={(e) => update('summary', e.target.value)}
            required
            placeholder="What the class worked on today and key takeaways..."
          />
        </label>
        <label>
          Homework & home practice (optional)
          <textarea
            rows={3}
            value={form.homework}
            onChange={(e) => update('homework', e.target.value)}
            placeholder="Assignments, worksheets, or practice parents can reinforce..."
          />
        </label>
        <button type="submit" className="btn btn--primary">
          <HiPlus /> Publish Update
        </button>
      </form>
    </div>
  )
}

function PostGuidanceForm({ parents, admin, onPosted }) {
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
    onPosted()
    setTimeout(() => setSuccess(false), 4000)
  }

  if (parents.length === 0) {
    return <p className="portal-page__empty">Approve at least one parent before sending guidance.</p>
  }

  return (
    <div className="parent-portal__auth-card academics-panel__form-card">
      <h2>Send Schoolwork Guidance</h2>
      <p className="parent-portal__auth-sub">
        Notify parents about assignments, study tips, or reminders to support schoolwork at home.
      </p>

      {success && (
        <div className="parent-portal__alert parent-portal__alert--success">
          Guidance notification sent to the family.
        </div>
      )}

      <form className="parent-portal__form" onSubmit={handleSubmit}>
        <label>
          Family
          <select value={form.parentId} onChange={(e) => update('parentId', e.target.value)} required>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.childName} — {p.name} ({gradeLabel(p.childGrade)})
              </option>
            ))}
          </select>
        </label>
        <label>
          Priority
          <select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
            {parentPortalConfig.guidancePriorities.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>
        <label>
          Title
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            required
            placeholder="e.g. Math worksheet due Friday"
          />
        </label>
        <label>
          Message
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            required
            placeholder="What parents should know about upcoming or current schoolwork..."
          />
        </label>
        <label>
          Tips for home support (optional)
          <textarea
            rows={3}
            value={form.tips}
            onChange={(e) => update('tips', e.target.value)}
            placeholder="Practical steps parents can take tonight or this week..."
          />
        </label>
        <button type="submit" className="btn btn--primary">
          <HiPlus /> Send Guidance
        </button>
      </form>
    </div>
  )
}

function TuitionManageList({ requests, onUpdate }) {
  const [notes, setNotes] = useState({})
  const [schedules, setSchedules] = useState({})

  if (requests.length === 0) {
    return <p className="portal-page__empty">No homework or tuition requests yet.</p>
  }

  return (
    <div className="portal-page__list">
      {requests.map((r) => (
        <article key={r.id} className="academics-card interactive-card">
          <header className="academics-card__header">
            <span className="parent-dashboard__tag">{r.childName} · {gradeLabel(r.grade)}</span>
            <span className="parent-dashboard__tag">{r.subject}</span>
            <span className="admin-badge">
              {labelFor(parentPortalConfig.tuitionStatuses, r.status)}
            </span>
          </header>
          <h4>{labelFor(parentPortalConfig.tuitionRequestTypes, r.requestType)}</h4>
          <p className="admin-card__detail">From {r.parentName}</p>
          <p>{r.description}</p>
          {r.preferredTimes && (
            <p className="admin-card__detail">Preferred: {r.preferredTimes}</p>
          )}

          {r.status === 'pending' && (
            <>
              <label className="admin-card__note">
                Offer / response
                <textarea
                  rows={2}
                  value={notes[r.id] || ''}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                  placeholder="Describe the tutoring or homework help you can offer..."
                />
              </label>
              <label className="admin-card__note">
                Proposed schedule
                <input
                  type="text"
                  value={schedules[r.id] || ''}
                  onChange={(e) => setSchedules((prev) => ({ ...prev, [r.id]: e.target.value }))}
                  placeholder="e.g. Tuesdays 4–5 PM via Google Meet"
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
                    onUpdate()
                  }}
                >
                  <HiCheck /> Send Offer
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    updateTuitionRequest(r.id, { status: 'declined', offerNote: notes[r.id] || '' })
                    onUpdate()
                  }}
                >
                  Decline
                </button>
              </div>
            </>
          )}

          {r.status !== 'pending' && r.offerNote && (
            <div className="academics-card__offer">
              <strong>Response sent</strong>
              <p>{r.offerNote}</p>
              {r.offerSchedule && <p className="admin-card__detail">Schedule: {r.offerSchedule}</p>}
            </div>
          )}

          {['offered', 'scheduled'].includes(r.status) && (
            <div className="admin-card__actions">
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => {
                  updateTuitionRequest(r.id, { status: 'scheduled' })
                  onUpdate()
                }}
              >
                Mark Scheduled
              </button>
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={() => {
                  updateTuitionRequest(r.id, { status: 'completed' })
                  onUpdate()
                }}
              >
                <HiCheck /> Mark Completed
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

function HistorySection({ lessons, guidance }) {
  if (lessons.length === 0 && guidance.length === 0) {
    return <p className="portal-page__empty">No academic posts yet.</p>
  }

  return (
    <div className="academics-panel__feed">
      {lessons.slice(0, 10).map((lesson) => (
        <article key={lesson.id} className="academics-card interactive-card">
          <header className="academics-card__header">
            <span className="parent-dashboard__tag">Lesson · {formatLessonDate(lesson.date)}</span>
            <span className="parent-dashboard__tag">{gradeLabel(lesson.grade)}</span>
          </header>
          <h4>{lesson.topics}</h4>
          <p className="admin-card__detail">
            {lesson.audience === 'grade'
              ? `Grade-wide update`
              : `${lesson.childName} — ${lesson.parentName}`}
          </p>
          <p>{lesson.summary}</p>
        </article>
      ))}
      {guidance.slice(0, 10).map((item) => (
        <article key={item.id} className="academics-card interactive-card">
          <header className="academics-card__header">
            <span className="parent-dashboard__tag">Guidance</span>
            <span className="parent-dashboard__tag">{item.childName}</span>
          </header>
          <h4>{item.title}</h4>
          <p>{item.message}</p>
        </article>
      ))}
    </div>
  )
}
