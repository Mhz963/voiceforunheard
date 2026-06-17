import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiCalendar,
  HiChatAlt2,
  HiLogout,
  HiPlus,
  HiVideoCamera,
  HiX,
} from 'react-icons/hi'
import { useParentAuth } from '../../context/ParentAuthContext'
import { parentPortalConfig } from '../../data/parentPortal'
import {
  addConcern,
  addMeeting,
  cancelMeeting,
  getAllMeetingsForSlot,
  getConcerns,
  getMeetings,
} from '../../services/parentStorage'

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function formatDate(dateStr) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(time24) {
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function getAvailableDates() {
  const dates = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 1; i <= parentPortalConfig.maxDaysAhead; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (parentPortalConfig.meetingDays.includes(d.getDay())) {
      dates.push(d.toISOString().slice(0, 10))
    }
  }
  return dates
}

function canJoinMeeting(date, time) {
  const start = new Date(`${date}T${time}:00`)
  const now = new Date()
  const diffMs = start - now
  const fifteenMin = 15 * 60 * 1000
  const twoHoursAfter = 2 * 60 * 60 * 1000
  return diffMs <= fifteenMin && diffMs >= -twoHoursAfter
}

export default function ParentDashboard() {
  const { parent, logout } = useParentAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [refreshKey, setRefreshKey] = useState(0)

  const concerns = useMemo(() => getConcerns(parent.id), [parent.id, refreshKey])
  const meetings = useMemo(() => getMeetings(parent.id), [parent.id, refreshKey])

  const upcomingMeetings = meetings.filter(
    (m) => ['scheduled', 'confirmed'].includes(m.status) && new Date(`${m.date}T${m.time}`) >= new Date(),
  )

  function refresh() {
    setRefreshKey((k) => k + 1)
  }

  function handleLogout() {
    logout()
    navigate('/signin')
  }

  return (
    <div className="page parent-portal parent-dashboard">
      <section className="parent-dashboard__header">
        <div className="container parent-dashboard__header-inner">
          <div>
            <span className="parent-dashboard__badge">Parent Portal</span>
            <h1>Welcome, {parent.name.split(' ')[0]}</h1>
            <p>
              Managing support for <strong>{parent.childName}</strong> ({parent.childAge})
            </p>
          </div>
          <button type="button" className="btn btn--outline parent-dashboard__logout" onClick={handleLogout}>
            <HiLogout /> Sign Out
          </button>
        </div>
      </section>

      <section className="section section--compact">
        <div className="container">
          <nav className="parent-dashboard__tabs" aria-label="Portal sections">
            <button
              type="button"
              className={tab === 'overview' ? 'parent-dashboard__tab--active' : ''}
              onClick={() => setTab('overview')}
            >
              Overview
            </button>
            <button
              type="button"
              className={tab === 'concerns' ? 'parent-dashboard__tab--active' : ''}
              onClick={() => setTab('concerns')}
            >
              <HiChatAlt2 /> Share a Concern
            </button>
            <button
              type="button"
              className={tab === 'meetings' ? 'parent-dashboard__tab--active' : ''}
              onClick={() => setTab('meetings')}
            >
              <HiCalendar /> Schedule Meeting
            </button>
          </nav>

          {tab === 'overview' && (
            <OverviewTab
              concerns={concerns}
              upcomingMeetings={upcomingMeetings}
              onGoConcerns={() => setTab('concerns')}
              onGoMeetings={() => setTab('meetings')}
            />
          )}
          {tab === 'concerns' && <ConcernsTab parent={parent} onSubmitted={refresh} concerns={concerns} />}
          {tab === 'meetings' && (
            <MeetingsTab
              parent={parent}
              meetings={meetings}
              onScheduled={refresh}
              onCancel={refresh}
            />
          )}
        </div>
      </section>
    </div>
  )
}

function OverviewTab({ concerns, upcomingMeetings, onGoConcerns, onGoMeetings }) {
  return (
    <div className="parent-dashboard__overview">
      <div className="parent-dashboard__stat-row">
        <div className="parent-dashboard__stat interactive-card">
          <strong>{concerns.length}</strong>
          <span>Concerns shared</span>
        </div>
        <div className="parent-dashboard__stat interactive-card">
          <strong>{upcomingMeetings.length}</strong>
          <span>Upcoming sessions</span>
        </div>
      </div>

      <div className="parent-dashboard__actions">
        <button type="button" className="btn btn--primary" onClick={onGoConcerns}>
          <HiPlus /> Share a New Concern
        </button>
        <button type="button" className="btn btn--outline" onClick={onGoMeetings}>
          <HiCalendar /> Book a Video Session
        </button>
      </div>

      {upcomingMeetings.length > 0 && (
        <div className="parent-dashboard__section">
          <h3>Next Session</h3>
          <MeetingCard meeting={upcomingMeetings[0]} />
        </div>
      )}

      {concerns.length > 0 && (
        <div className="parent-dashboard__section">
          <h3>Latest Concern</h3>
          <ConcernCard concern={concerns[0]} />
        </div>
      )}
    </div>
  )
}

function ConcernsTab({ parent, onSubmitted, concerns }) {
  const [form, setForm] = useState({
    category: parentPortalConfig.concernCategories[0].id,
    title: '',
    description: '',
    urgency: 'medium',
  })
  const [submitted, setSubmitted] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    addConcern({
      id: createId('concern'),
      parentId: parent.id,
      parentName: parent.name,
      childName: parent.childName,
      ...form,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    })
    setSubmitted(true)
    setForm({
      category: parentPortalConfig.concernCategories[0].id,
      title: '',
      description: '',
      urgency: 'medium',
    })
    onSubmitted()
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="parent-dashboard__split">
      <div className="parent-portal__auth-card">
        <h2>Share a Concern or Problem</h2>
        <p className="parent-portal__auth-sub">
          Tell your educator about challenges your child is facing. This helps prepare for your next session.
        </p>

        {submitted && (
          <div className="parent-portal__alert parent-portal__alert--success">
            Your concern has been submitted. Your educator will review it before your next meeting.
          </div>
        )}

        <form className="parent-portal__form" onSubmit={handleSubmit}>
          <label>
            Category
            <select value={form.category} onChange={(e) => update('category', e.target.value)} required>
              {parentPortalConfig.concernCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>
          <label>
            Brief Title
            <input
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              required
              placeholder="e.g. Difficulty with /s/ sounds at home"
            />
          </label>
          <label>
            Describe the Problem
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              required
              placeholder="Share what you are noticing, when it happens, and what you have tried..."
            />
          </label>
          <label>
            Urgency
            <select value={form.urgency} onChange={(e) => update('urgency', e.target.value)} required>
              {parentPortalConfig.urgencyLevels.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn--primary btn--block">Submit Concern</button>
        </form>
      </div>

      <div className="parent-dashboard__list">
        <h3>Your Submitted Concerns</h3>
        {concerns.length === 0 ? (
          <p className="parent-dashboard__empty">No concerns submitted yet.</p>
        ) : (
          concerns.map((c) => <ConcernCard key={c.id} concern={c} />)
        )}
      </div>
    </div>
  )
}

function MeetingsTab({ parent, meetings, onScheduled, onCancel }) {
  const availableDates = useMemo(() => getAvailableDates(), [])
  const [form, setForm] = useState({
    date: availableDates[0] || '',
    time: parentPortalConfig.timeSlots[0],
    agenda: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function isSlotTaken(time) {
    return getAllMeetingsForSlot(form.date, time).length > 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (isSlotTaken(form.time)) {
      setError('This time slot was just booked. Please choose another.')
      return
    }

    addMeeting({
      id: createId('meeting'),
      parentId: parent.id,
      parentName: parent.name,
      childName: parent.childName,
      email: parent.email,
      date: form.date,
      time: form.time,
      agenda: form.agenda.trim(),
      meetLink: parentPortalConfig.googleMeetLink,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    })

    setSuccess('Meeting scheduled! You can join via Google Meet at the scheduled time.')
    setForm((prev) => ({ ...prev, agenda: '' }))
    onScheduled()
  }

  function handleCancel(id) {
    cancelMeeting(id, parent.id)
    onCancel()
  }

  return (
    <div className="parent-dashboard__split">
      <div className="parent-portal__auth-card">
        <h2>Schedule a Video Session</h2>
        <p className="parent-portal__auth-sub">
          Book a {parentPortalConfig.sessionDurationMinutes}-minute Google Meet session with your speech education teacher.
        </p>

        {error && <div className="parent-portal__alert parent-portal__alert--error">{error}</div>}
        {success && <div className="parent-portal__alert parent-portal__alert--success">{success}</div>}

        <form className="parent-portal__form" onSubmit={handleSubmit}>
          <label>
            Preferred Date
            <select value={form.date} onChange={(e) => update('date', e.target.value)} required>
              {availableDates.map((d) => (
                <option key={d} value={d}>{formatDate(d)}</option>
              ))}
            </select>
          </label>
          <label>
            Time Slot
            <select value={form.time} onChange={(e) => update('time', e.target.value)} required>
              {parentPortalConfig.timeSlots.map((t) => (
                <option key={t} value={t} disabled={isSlotTaken(t)}>
                  {formatTime(t)}{isSlotTaken(t) ? ' (booked)' : ''}
                </option>
              ))}
            </select>
          </label>
          <label>
            What would you like to discuss?
            <textarea
              rows={4}
              value={form.agenda}
              onChange={(e) => update('agenda', e.target.value)}
              required
              placeholder="Share topics, recent challenges, or questions for the session..."
            />
          </label>
          <button type="submit" className="btn btn--primary btn--block">
            <HiVideoCamera /> Confirm Meeting
          </button>
        </form>
      </div>

      <div className="parent-dashboard__list">
        <h3>Your Scheduled Sessions</h3>
        {meetings.filter((m) => ['scheduled', 'confirmed'].includes(m.status)).length === 0 ? (
          <p className="parent-dashboard__empty">No meetings scheduled yet.</p>
        ) : (
          meetings
            .filter((m) => ['scheduled', 'confirmed'].includes(m.status))
            .map((m) => (
              <MeetingCard key={m.id} meeting={m} onCancel={() => handleCancel(m.id)} />
            ))
        )}
      </div>
    </div>
  )
}

function ConcernCard({ concern }) {
  const category = parentPortalConfig.concernCategories.find((c) => c.id === concern.category)
  const urgency = parentPortalConfig.urgencyLevels.find((u) => u.id === concern.urgency)

  return (
    <article className="parent-dashboard__card interactive-card">
      <div className="parent-dashboard__card-meta">
        <span className="parent-dashboard__tag">{category?.label}</span>
        <span className={`parent-dashboard__urgency parent-dashboard__urgency--${concern.urgency}`}>
          {urgency?.label}
        </span>
      </div>
      <h4>{concern.title}</h4>
      <p>{concern.description}</p>
      {concern.adminNote && (
        <p className="parent-dashboard__educator-note">
          <strong>Educator note:</strong> {concern.adminNote}
        </p>
      )}
      <footer>
        Submitted {new Date(concern.createdAt).toLocaleDateString()} · Status:{' '}
        {parentPortalConfig.concernStatuses.find((s) => s.id === concern.status)?.label || concern.status}
      </footer>
    </article>
  )
}

function MeetingCard({ meeting, onCancel }) {
  const joinable = canJoinMeeting(meeting.date, meeting.time)
  const isPast = new Date(`${meeting.date}T${meeting.time}`) < new Date()

  return (
    <article className="parent-dashboard__card interactive-card">
      <div className="parent-dashboard__card-meta">
        <span className="parent-dashboard__tag">{formatDate(meeting.date)}</span>
        <span className="parent-dashboard__tag">{formatTime(meeting.time)}</span>
        {meeting.status === 'confirmed' && (
          <span className="parent-dashboard__tag parent-dashboard__tag--confirmed">Confirmed</span>
        )}
      </div>
      <h4>Video Session — {meeting.childName}</h4>
      {meeting.agenda && <p>{meeting.agenda}</p>}
      {meeting.adminNote && (
        <p className="parent-dashboard__educator-note">
          <strong>From educator:</strong> {meeting.adminNote}
        </p>
      )}
      <div className="parent-dashboard__meeting-actions">
        {joinable && (
          <a
            href={meeting.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
          >
            <HiVideoCamera /> Join Google Meet
          </a>
        )}
        {!joinable && !isPast && (
          <span className="parent-dashboard__meet-hint">
            Join link activates 15 minutes before the session
          </span>
        )}
        {onCancel && !isPast && (
          <button type="button" className="btn btn--ghost parent-dashboard__cancel" onClick={onCancel}>
            <HiX /> Cancel
          </button>
        )}
      </div>
    </article>
  )
}
