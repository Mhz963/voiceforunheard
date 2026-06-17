import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiCalendar,
  HiCheck,
  HiLogout,
  HiUserAdd,
  HiX,
} from 'react-icons/hi'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { parentPortalConfig } from '../../data/parentPortal'
import {
  approveParent,
  deleteParent,
  getAllConcerns,
  getAllMeetings,
  getParents,
  updateConcernStatus,
  updateMeetingStatus,
} from '../../services/parentStorage'
import '../parents/ParentPortal.css'
import './AdminPortal.css'

function formatDate(dateStr) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
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

function labelFor(list, id) {
  return list.find((item) => item.id === id)?.label || id
}

export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [refreshKey, setRefreshKey] = useState(0)

  const parents = useMemo(() => getParents(), [refreshKey])
  const concerns = useMemo(() => getAllConcerns(), [refreshKey])
  const meetings = useMemo(() => getAllMeetings(), [refreshKey])

  const pendingParents = parents.filter((p) => !p.approved)
  const upcomingMeetings = meetings.filter(
    (m) => m.status !== 'cancelled' && m.status !== 'completed' && new Date(`${m.date}T${m.time}`) >= new Date(),
  )

  function refresh() {
    setRefreshKey((k) => k + 1)
  }

  function handleLogout() {
    logout()
    navigate('/signin')
  }

  function handleApprove(parentId) {
    approveParent(parentId)
    refresh()
  }

  function handleReject(parentId) {
    if (window.confirm('Remove this access request?')) {
      deleteParent(parentId)
      refresh()
    }
  }

  return (
    <div className="page admin-portal admin-dashboard">
      <section className="admin-dashboard__header">
        <div className="container admin-dashboard__header-inner">
          <div>
            <span className="admin-dashboard__badge">Admin Portal</span>
            <h1>Educator Dashboard</h1>
            <p>Signed in as {admin.name}</p>
          </div>
          <button type="button" className="btn btn--outline admin-dashboard__logout" onClick={handleLogout}>
            <HiLogout /> Sign Out
          </button>
        </div>
      </section>

      <section className="section section--compact">
        <div className="container">
          <nav className="parent-dashboard__tabs" aria-label="Admin sections">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'requests', label: `Requests (${pendingParents.length})` },
              { id: 'parents', label: 'Parents' },
              { id: 'concerns', label: 'Concerns' },
              { id: 'meetings', label: 'Meetings' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                className={tab === t.id ? 'parent-dashboard__tab--active' : ''}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {tab === 'overview' && (
            <div className="admin-dashboard__overview">
              <div className="admin-dashboard__stats">
                <div className="parent-dashboard__stat interactive-card">
                  <strong>{pendingParents.length}</strong>
                  <span>Pending access requests</span>
                </div>
                <div className="parent-dashboard__stat interactive-card">
                  <strong>{parents.filter((p) => p.approved).length}</strong>
                  <span>Approved parents</span>
                </div>
                <div className="parent-dashboard__stat interactive-card">
                  <strong>{concerns.filter((c) => c.status === 'submitted').length}</strong>
                  <span>New concerns</span>
                </div>
                <div className="parent-dashboard__stat interactive-card">
                  <strong>{upcomingMeetings.length}</strong>
                  <span>Upcoming meetings</span>
                </div>
              </div>
              {pendingParents.length > 0 && (
                <div className="admin-dashboard__section">
                  <h3>Latest Access Request</h3>
                  <ParentRequestCard
                    parent={pendingParents[0]}
                    onApprove={() => handleApprove(pendingParents[0].id)}
                    onReject={() => handleReject(pendingParents[0].id)}
                  />
                </div>
              )}
            </div>
          )}

          {tab === 'requests' && (
            <div className="admin-dashboard__list">
              <h3>Parent Access Requests</h3>
              {pendingParents.length === 0 ? (
                <p className="parent-dashboard__empty">No pending requests.</p>
              ) : (
                pendingParents.map((p) => (
                  <ParentRequestCard
                    key={p.id}
                    parent={p}
                    onApprove={() => handleApprove(p.id)}
                    onReject={() => handleReject(p.id)}
                  />
                ))
              )}
            </div>
          )}

          {tab === 'parents' && (
            <div className="admin-dashboard__list">
              <h3>All Registered Parents</h3>
              {parents.length === 0 ? (
                <p className="parent-dashboard__empty">No parents registered yet.</p>
              ) : (
                parents.map((p) => (
                  <article key={p.id} className="admin-card interactive-card">
                    <div className="admin-card__meta">
                      <span className={`admin-badge ${p.approved ? 'admin-badge--ok' : 'admin-badge--pending'}`}>
                        {p.approved ? 'Approved' : 'Pending'}
                      </span>
                      <span className="parent-dashboard__tag">{p.relationship}</span>
                    </div>
                    <h4>{p.name}</h4>
                    <p className="admin-card__detail">
                      {p.email} · Child: {p.childName} ({p.childAge})
                    </p>
                    <p className="admin-card__detail">
                      Concerns: {concerns.filter((c) => c.parentId === p.id).length} ·
                      Meetings: {meetings.filter((m) => m.parentId === p.id).length}
                    </p>
                    {!p.approved && (
                      <div className="admin-card__actions">
                        <button type="button" className="btn btn--primary btn--sm" onClick={() => handleApprove(p.id)}>
                          <HiCheck /> Approve
                        </button>
                        <button type="button" className="btn btn--ghost btn--sm" onClick={() => handleReject(p.id)}>
                          <HiX /> Reject
                        </button>
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          )}

          {tab === 'concerns' && (
            <div className="admin-dashboard__list">
              <h3>All Parent Concerns</h3>
              {concerns.length === 0 ? (
                <p className="parent-dashboard__empty">No concerns submitted yet.</p>
              ) : (
                concerns.map((c) => (
                  <ConcernAdminCard key={c.id} concern={c} onUpdate={refresh} />
                ))
              )}
            </div>
          )}

          {tab === 'meetings' && (
            <div className="admin-dashboard__list">
              <h3>All Scheduled Meetings</h3>
              {meetings.length === 0 ? (
                <p className="parent-dashboard__empty">No meetings scheduled yet.</p>
              ) : (
                meetings.map((m) => (
                  <MeetingAdminCard key={m.id} meeting={m} onUpdate={refresh} />
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function ParentRequestCard({ parent, onApprove, onReject }) {
  return (
    <article className="admin-card interactive-card">
      <div className="admin-card__meta">
        <span className="admin-badge admin-badge--pending">Pending approval</span>
        <span className="parent-dashboard__tag">Requested {new Date(parent.createdAt).toLocaleDateString()}</span>
      </div>
      <h4>{parent.name}</h4>
      <p className="admin-card__detail">{parent.email}</p>
      <p className="admin-card__detail">
        Child: {parent.childName} ({parent.childAge}) · {parent.relationship}
      </p>
      <div className="admin-card__actions">
        <button type="button" className="btn btn--primary btn--sm" onClick={onApprove}>
          <HiUserAdd /> Approve Access
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onReject}>
          <HiX /> Reject
        </button>
      </div>
    </article>
  )
}

function ConcernAdminCard({ concern, onUpdate }) {
  const [note, setNote] = useState(concern.adminNote || '')

  return (
    <article className="admin-card interactive-card">
      <div className="admin-card__meta">
        <span className="parent-dashboard__tag">{labelFor(parentPortalConfig.concernCategories, concern.category)}</span>
        <span className={`parent-dashboard__urgency parent-dashboard__urgency--${concern.urgency}`}>
          {labelFor(parentPortalConfig.urgencyLevels, concern.urgency)}
        </span>
        <span className="admin-badge">{labelFor(parentPortalConfig.concernStatuses, concern.status)}</span>
      </div>
      <h4>{concern.title}</h4>
      <p className="admin-card__detail">
        From {concern.parentName} · Re: {concern.childName}
      </p>
      <p>{concern.description}</p>
      <label className="admin-card__note">
        Educator note
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for your records..." />
      </label>
      <div className="admin-card__actions">
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={() => { updateConcernStatus(concern.id, 'reviewed', note); onUpdate() }}
        >
          Mark Under Review
        </button>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={() => { updateConcernStatus(concern.id, 'resolved', note); onUpdate() }}
        >
          <HiCheck /> Mark Resolved
        </button>
      </div>
    </article>
  )
}

function MeetingAdminCard({ meeting, onUpdate }) {
  const [note, setNote] = useState(meeting.adminNote || '')

  return (
    <article className="admin-card interactive-card">
      <div className="admin-card__meta">
        <span className="parent-dashboard__tag">{formatDate(meeting.date)}</span>
        <span className="parent-dashboard__tag">{formatTime(meeting.time)}</span>
        <span className="admin-badge">{labelFor(parentPortalConfig.meetingStatuses, meeting.status)}</span>
      </div>
      <h4>{meeting.parentName} — {meeting.childName}</h4>
      <p className="admin-card__detail">{meeting.email}</p>
      {meeting.agenda && <p>{meeting.agenda}</p>}
      <label className="admin-card__note">
        Session note
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Prep notes or follow-up..." />
      </label>
      <div className="admin-card__actions">
        {meeting.status === 'scheduled' && (
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => { updateMeetingStatus(meeting.id, 'confirmed', null, note); onUpdate() }}
          >
            <HiCheck /> Confirm
          </button>
        )}
        {meeting.status !== 'completed' && meeting.status !== 'cancelled' && (
          <>
            <a href={meeting.meetLink} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--sm">
              <HiCalendar /> Open Meet
            </a>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => { updateMeetingStatus(meeting.id, 'completed', null, note); onUpdate() }}
            >
              Mark Completed
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => { updateMeetingStatus(meeting.id, 'cancelled', null, note); onUpdate() }}
            >
              <HiX /> Cancel
            </button>
          </>
        )}
      </div>
    </article>
  )
}
