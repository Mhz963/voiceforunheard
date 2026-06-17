import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiCalendar,
  HiCheck,
  HiClipboardList,
  HiCog,
  HiDatabase,
  HiKey,
  HiLogout,
  HiPlus,
  HiShieldCheck,
  HiTrash,
  HiUserGroup,
  HiX,
} from 'react-icons/hi'
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext'
import { portalConfig } from '../../data/parentPortal'
import {
  addAccessCode,
  approveParent,
  deleteParent,
  getAccessCodes,
  getActivityLog,
  getAllConcerns,
  getAllMeetings,
  getParents,
  logActivity,
  removeAccessCode,
  setAccessCodes,
  updateConcernStatus,
  updateMeetingStatus,
} from '../../services/parentStorage'
import '../parents/ParentPortal.css'
import '../admin/AdminPortal.css'
import './SuperAdminPortal.css'

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

export default function SuperAdminDashboard() {
  const { superadmin, logout } = useSuperAdminAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [refreshKey, setRefreshKey] = useState(0)

  const parents = useMemo(() => getParents(), [refreshKey])
  const concerns = useMemo(() => getAllConcerns(), [refreshKey])
  const meetings = useMemo(() => getAllMeetings(), [refreshKey])
  const activity = useMemo(() => getActivityLog(), [refreshKey])
  const accessCodes = useMemo(
    () => getAccessCodes() || portalConfig.accessCodes,
    [refreshKey],
  )

  const pendingParents = parents.filter((p) => !p.approved)
  const urgentConcerns = concerns.filter((c) => c.urgency === 'high' && c.status !== 'resolved')
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

  function act(action, detail) {
    logActivity({
      actor: superadmin.name,
      role: 'superadmin',
      action,
      detail,
    })
    refresh()
  }

  function handleApprove(parentId) {
    const p = parents.find((x) => x.id === parentId)
    approveParent(parentId)
    act('Approved parent', `${p?.name} (${p?.email})`)
  }

  function handleReject(parentId) {
    const p = parents.find((x) => x.id === parentId)
    if (window.confirm('Remove this family account permanently?')) {
      deleteParent(parentId)
      act('Removed parent', `${p?.name} (${p?.email})`)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: HiShieldCheck },
    { id: 'families', label: `Families (${parents.length})`, icon: HiUserGroup },
    { id: 'concerns', label: `Concerns (${concerns.length})`, icon: HiClipboardList },
    { id: 'meetings', label: 'Sessions', icon: HiCalendar },
    { id: 'system', label: 'System', icon: HiCog },
  ]

  return (
    <div className="page superadmin-portal superadmin-dashboard">
      <section className="superadmin-dashboard__header">
        <div className="container superadmin-dashboard__header-inner">
          <div>
            <span className="superadmin-dashboard__badge">Super Admin</span>
            <h1>Platform Control Center</h1>
            <p>Signed in as {superadmin.name} — full system access</p>
          </div>
          <button type="button" className="btn btn--outline superadmin-dashboard__logout" onClick={handleLogout}>
            <HiLogout /> Sign Out
          </button>
        </div>
      </section>

      <section className="section section--compact">
        <div className="container">
          <nav className="superadmin-dashboard__tabs" aria-label="Super admin sections">
            {tabs.map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  type="button"
                  className={tab === t.id ? 'superadmin-dashboard__tab--active' : ''}
                  onClick={() => setTab(t.id)}
                >
                  <Icon aria-hidden="true" /> {t.label}
                </button>
              )
            })}
          </nav>

          {tab === 'overview' && (
            <div className="superadmin-dashboard__overview">
              <div className="superadmin-dashboard__stats">
                <button type="button" className="superadmin-stat interactive-card" onClick={() => setTab('families')}>
                  <strong>{parents.length}</strong>
                  <span>Total families</span>
                  <em>{pendingParents.length} pending</em>
                </button>
                <button type="button" className="superadmin-stat interactive-card" onClick={() => setTab('concerns')}>
                  <strong>{concerns.length}</strong>
                  <span>Concerns logged</span>
                  <em>{urgentConcerns.length} urgent open</em>
                </button>
                <button type="button" className="superadmin-stat interactive-card" onClick={() => setTab('meetings')}>
                  <strong>{upcomingMeetings.length}</strong>
                  <span>Upcoming sessions</span>
                </button>
                <button type="button" className="superadmin-stat interactive-card" onClick={() => setTab('system')}>
                  <strong>{accessCodes.length}</strong>
                  <span>Active access codes</span>
                </button>
              </div>

              {pendingParents.length > 0 && (
                <div className="superadmin-dashboard__section">
                  <h3>Requires Action — Pending Families</h3>
                  {pendingParents.slice(0, 2).map((p) => (
                    <FamilyCard
                      key={p.id}
                      parent={p}
                      concerns={concerns}
                      meetings={meetings}
                      onApprove={() => handleApprove(p.id)}
                      onReject={() => handleReject(p.id)}
                    />
                  ))}
                </div>
              )}

              {activity.length > 0 && (
                <div className="superadmin-dashboard__section">
                  <h3>Recent Activity</h3>
                  <ActivityList entries={activity.slice(0, 5)} />
                </div>
              )}
            </div>
          )}

          {tab === 'families' && (
            <div className="admin-dashboard__list">
              <h3>All Registered Families</h3>
              {parents.length === 0 ? (
                <p className="parent-dashboard__empty">No families registered yet.</p>
              ) : (
                parents.map((p) => (
                  <FamilyCard
                    key={p.id}
                    parent={p}
                    concerns={concerns}
                    meetings={meetings}
                    onApprove={() => handleApprove(p.id)}
                    onReject={() => handleReject(p.id)}
                  />
                ))
              )}
            </div>
          )}

          {tab === 'concerns' && (
            <div className="admin-dashboard__list">
              <h3>All Concerns</h3>
              {concerns.length === 0 ? (
                <p className="parent-dashboard__empty">No concerns yet.</p>
              ) : (
                concerns.map((c) => (
                  <ConcernCard
                    key={c.id}
                    concern={c}
                    onUpdate={() => {
                      act('Updated concern', c.title)
                    }}
                  />
                ))
              )}
            </div>
          )}

          {tab === 'meetings' && (
            <div className="admin-dashboard__list">
              <h3>All Video Sessions</h3>
              {meetings.length === 0 ? (
                <p className="parent-dashboard__empty">No sessions scheduled.</p>
              ) : (
                meetings.map((m) => (
                  <MeetingCard
                    key={m.id}
                    meeting={m}
                    onUpdate={() => {
                      act('Updated meeting', `${m.parentName} — ${formatDate(m.date)}`)
                    }}
                  />
                ))
              )}
            </div>
          )}

          {tab === 'system' && (
            <SystemTab
              accessCodes={accessCodes}
              activity={activity}
              onCodesChange={() => {
                act('Updated access codes', 'Access code list modified')
              }}
              onRefresh={refresh}
            />
          )}
        </div>
      </section>
    </div>
  )
}

function FamilyCard({ parent, concerns, meetings, onApprove, onReject }) {
  const parentConcerns = concerns.filter((c) => c.parentId === parent.id)
  const parentMeetings = meetings.filter((m) => m.parentId === parent.id)

  return (
    <article className="admin-card interactive-card">
      <div className="admin-card__meta">
        <span className={`admin-badge ${parent.approved ? 'admin-badge--ok' : 'admin-badge--pending'}`}>
          {parent.approved ? 'Approved' : 'Pending'}
        </span>
        <span className="parent-dashboard__tag">{parent.relationship}</span>
      </div>
      <h4>{parent.name}</h4>
      <p className="admin-card__detail">
        {parent.email} · Child: {parent.childName} ({parent.childAge})
      </p>
      <p className="admin-card__detail">
        {parentConcerns.length} concerns · {parentMeetings.length} sessions
      </p>
      {!parent.approved && (
        <div className="admin-card__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={onApprove}>
            <HiCheck /> Approve
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onReject}>
            <HiX /> Remove
          </button>
        </div>
      )}
    </article>
  )
}

function ConcernCard({ concern, onUpdate }) {
  const [note, setNote] = useState(concern.adminNote || '')

  return (
    <article className="admin-card interactive-card">
      <div className="admin-card__meta">
        <span className="parent-dashboard__tag">{labelFor(portalConfig.concernCategories, concern.category)}</span>
        <span className={`parent-dashboard__urgency parent-dashboard__urgency--${concern.urgency}`}>
          {labelFor(portalConfig.urgencyLevels, concern.urgency)}
        </span>
        <span className="admin-badge">{labelFor(portalConfig.concernStatuses, concern.status)}</span>
      </div>
      <h4>{concern.title}</h4>
      <p className="admin-card__detail">From {concern.parentName} · Re: {concern.childName}</p>
      <p>{concern.description}</p>
      <label className="admin-card__note">
        Admin note
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="admin-card__actions">
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={() => { updateConcernStatus(concern.id, 'reviewed', note); onUpdate() }}
        >
          Under Review
        </button>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={() => { updateConcernStatus(concern.id, 'resolved', note); onUpdate() }}
        >
          <HiCheck /> Resolved
        </button>
      </div>
    </article>
  )
}

function MeetingCard({ meeting, onUpdate }) {
  const [note, setNote] = useState(meeting.adminNote || '')

  return (
    <article className="admin-card interactive-card">
      <div className="admin-card__meta">
        <span className="parent-dashboard__tag">{formatDate(meeting.date)}</span>
        <span className="parent-dashboard__tag">{formatTime(meeting.time)}</span>
        <span className="admin-badge">{labelFor(portalConfig.meetingStatuses, meeting.status)}</span>
      </div>
      <h4>{meeting.parentName} — {meeting.childName}</h4>
      {meeting.agenda && <p>{meeting.agenda}</p>}
      <div className="admin-card__actions">
        {meeting.status === 'scheduled' && (
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => { updateMeetingStatus(meeting.id, 'confirmed', null, note); onUpdate() }}
          >
            Confirm
          </button>
        )}
        {meeting.status !== 'cancelled' && meeting.status !== 'completed' && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => { updateMeetingStatus(meeting.id, 'cancelled', null, note); onUpdate() }}
          >
            <HiX /> Cancel
          </button>
        )}
      </div>
    </article>
  )
}

function SystemTab({ accessCodes, activity, onCodesChange, onRefresh }) {
  const [newCode, setNewCode] = useState('')
  const [exportMsg, setExportMsg] = useState('')

  function handleAddCode(e) {
    e.preventDefault()
    if (!newCode.trim()) return
    addAccessCode(newCode)
    setNewCode('')
    onCodesChange()
    onRefresh()
  }

  function handleRemove(code) {
    removeAccessCode(code)
    onCodesChange()
    onRefresh()
  }

  function handleResetCodes() {
    if (window.confirm('Reset access codes to defaults?')) {
      setAccessCodes([...portalConfig.accessCodes])
      onCodesChange()
      onRefresh()
    }
  }

  function handleExport() {
    const data = {
      parents: getParents(),
      concerns: getAllConcerns(),
      meetings: getAllMeetings(),
      accessCodes,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vfu-platform-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportMsg('Platform data exported successfully.')
    setTimeout(() => setExportMsg(''), 3000)
  }

  return (
    <div className="superadmin-system">
      <div className="superadmin-system__grid">
        <div className="superadmin-system__panel">
          <h3><HiKey /> Access Codes</h3>
          <p className="superadmin-system__desc">
            Families with a valid code are auto-approved on registration.
          </p>
          <ul className="superadmin-codes">
            {accessCodes.map((code) => (
              <li key={code}>
                <code>{code}</code>
                <button type="button" className="superadmin-codes__remove" onClick={() => handleRemove(code)} aria-label={`Remove ${code}`}>
                  <HiTrash />
                </button>
              </li>
            ))}
          </ul>
          <form className="superadmin-codes__add" onSubmit={handleAddCode}>
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="NEW-CODE-2026"
            />
            <button type="submit" className="btn btn--primary btn--sm">
              <HiPlus /> Add
            </button>
          </form>
          <button type="button" className="btn btn--ghost btn--sm" onClick={handleResetCodes}>
            Reset to defaults
          </button>
        </div>

        <div className="superadmin-system__panel">
          <h3><HiDatabase /> Data Export</h3>
          <p className="superadmin-system__desc">
            Download a snapshot of all families, concerns, meetings, and access codes.
          </p>
          <button type="button" className="btn btn--primary" onClick={handleExport}>
            <HiDatabase /> Export Platform Data
          </button>
          {exportMsg && <p className="superadmin-system__success">{exportMsg}</p>}

          <div className="superadmin-system__roles">
            <h4>Portal Accounts (demo)</h4>
            <ul>
              {Object.entries(portalConfig.roles).map(([role, cfg]) => (
                <li key={role}>
                  <strong>{cfg.label}</strong> — {cfg.email}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="superadmin-system__panel superadmin-system__panel--wide">
        <h3><HiClipboardList /> Activity Log</h3>
        {activity.length === 0 ? (
          <p className="parent-dashboard__empty">No activity recorded yet.</p>
        ) : (
          <ActivityList entries={activity} />
        )}
      </div>
    </div>
  )
}

function ActivityList({ entries }) {
  return (
    <ul className="superadmin-activity">
      {entries.map((entry) => (
        <li key={entry.id} className="superadmin-activity__item">
          <span className="superadmin-activity__time">
            {new Date(entry.createdAt).toLocaleString()}
          </span>
          <span className="superadmin-activity__role">{entry.role}</span>
          <strong>{entry.action}</strong>
          {entry.detail && <span className="superadmin-activity__detail">— {entry.detail}</span>}
        </li>
      ))}
    </ul>
  )
}
