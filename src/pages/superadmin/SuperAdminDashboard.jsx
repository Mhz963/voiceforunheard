import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiCalendar,
  HiCheck,
  HiClipboardList,
  HiCog,
  HiDatabase,
  HiKey,
  HiPlus,
  HiTrash,
  HiUserGroup,
  HiViewGrid,
  HiX,
} from 'react-icons/hi'
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext'
import { useToast } from '../../context/ToastContext'
import { portalConfig as basePortalConfig } from '../../data/parentPortal'
import { useLanguage } from '../../i18n/LanguageContext'
import { usePortalConfig } from '../../i18n/usePortalConfig'
import PortalLayout from '../../components/portal/PortalLayout'
import { SpeakHeading } from '../../components/voice/SpeakAloud'
import {
  addAccessCode,
  approveParent,
  confirmJazzCashManualPayment,
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
  const { t } = useLanguage()
  const portalConfig = usePortalConfig()
  const { superadmin, logout } = useSuperAdminAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [refreshKey, setRefreshKey] = useState(0)

  const parents = useMemo(() => getParents(), [refreshKey])
  const concerns = useMemo(() => getAllConcerns(), [refreshKey])
  const meetings = useMemo(() => getAllMeetings(), [refreshKey])
  const activity = useMemo(() => getActivityLog(), [refreshKey])
  const accessCodes = useMemo(
    () => getAccessCodes() || basePortalConfig.accessCodes,
    [refreshKey],
  )

  const pendingParents = parents.filter((p) => !p.approved)
  const urgentConcerns = concerns.filter((c) => c.urgency === 'high' && c.status !== 'resolved')
  const pendingPayments = meetings.filter((m) => m.status === 'pending_payment')
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
    toast.successT('toasts.parentApprovedTitle', 'toasts.parentApprovedMessage')
    act('Approved parent', `${p?.name} (${p?.email})`)
  }

  function handleReject(parentId) {
    const p = parents.find((x) => x.id === parentId)
    if (window.confirm('Remove this family account permanently?')) {
      deleteParent(parentId)
      toast.successT('toasts.parentRejectedTitle', 'toasts.parentRejectedMessage')
      act('Removed parent', `${p?.name} (${p?.email})`)
    }
  }

  const pageCopy = {
    overview: { title: t('superadminPortal.overviewTitle'), description: t('superadminPortal.overviewDesc') },
    families: { title: t('superadminPortal.familiesTitle'), description: t('superadminPortal.familiesDesc') },
    concerns: { title: t('superadminPortal.concernsTitle'), description: t('superadminPortal.concernsDesc') },
    meetings: { title: t('superadminPortal.sessionsTitle'), description: t('superadminPortal.sessionsDesc') },
    system: { title: t('superadminPortal.systemTitle'), description: t('superadminPortal.systemDesc') },
  }[tab]

  const navItems = [
    { id: 'overview', label: t('superadminPortal.overview'), icon: HiViewGrid },
    { id: 'families', label: t('superadminPortal.families'), icon: HiUserGroup, badge: pendingParents.length },
    { id: 'concerns', label: t('superadminPortal.concerns'), icon: HiClipboardList, badge: urgentConcerns.length },
    { id: 'meetings', label: t('superadminPortal.sessions'), icon: HiCalendar, badge: pendingPayments.length || upcomingMeetings.length || undefined },
    { id: 'system', label: t('superadminPortal.system'), icon: HiCog },
  ]

  return (
    <PortalLayout
      variant="superadmin"
      portalLabel={t('portal.superadminLabel')}
      userName={superadmin.name}
      userMeta={t('portal.fullAccess')}
      navItems={navItems}
      activeId={tab}
      onNavigate={setTab}
      onLogout={handleLogout}
      pageTitle={pageCopy.title}
      pageDescription={pageCopy.description}
    >
      {tab === 'overview' && (
        <div className="portal-page">
          <div className="portal-page__stats">
            <button type="button" className="portal-stat portal-stat--clickable" onClick={() => setTab('families')}>
              <strong>{parents.length}</strong>
              <span>{t('superadminPortal.totalFamilies')}</span>
              <em>{pendingParents.length} {t('superadminPortal.pending')}</em>
            </button>
            <button type="button" className="portal-stat portal-stat--clickable" onClick={() => setTab('concerns')}>
              <strong>{concerns.length}</strong>
              <span>{t('superadminPortal.concernsLogged')}</span>
              <em>{urgentConcerns.length} {t('superadminPortal.urgentOpen')}</em>
            </button>
            <button type="button" className="portal-stat portal-stat--clickable" onClick={() => setTab('meetings')}>
              <strong>{upcomingMeetings.length}</strong>
              <span>{t('superadminPortal.upcomingSessions')}</span>
            </button>
            <button type="button" className="portal-stat portal-stat--clickable" onClick={() => setTab('system')}>
              <strong>{accessCodes.length}</strong>
              <span>{t('superadminPortal.activeCodes')}</span>
            </button>
          </div>

          {pendingParents.length > 0 && (
            <div className="portal-page__section">
              <SpeakHeading as="h3">{t('superadminPortal.requiresAction')}</SpeakHeading>
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
            <div className="portal-page__section">
              <SpeakHeading as="h3">{t('superadminPortal.recentActivity')}</SpeakHeading>
              <ActivityList entries={activity.slice(0, 5)} />
            </div>
          )}
        </div>
      )}

      {tab === 'families' && (
        <div className="portal-page__list">
          {parents.length === 0 ? (
            <p className="portal-page__empty">{t('superadminPortal.noFamilies')}</p>
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
        <div className="portal-page__list">
          {concerns.length === 0 ? (
            <p className="portal-page__empty">{t('superadminPortal.noConcerns')}</p>
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
        <div className="portal-page__list">
          {meetings.length === 0 ? (
            <p className="portal-page__empty">{t('superadminPortal.noSessions')}</p>
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
          portalConfig={portalConfig}
          onCodesChange={() => {
            act('Updated access codes', 'Access code list modified')
          }}
          onRefresh={refresh}
        />
      )}
    </PortalLayout>
  )
}

function FamilyCard({ parent, concerns, meetings, onApprove, onReject }) {
  const { t } = useLanguage()
  const parentConcerns = concerns.filter((c) => c.parentId === parent.id)
  const parentMeetings = meetings.filter((m) => m.parentId === parent.id)

  return (
    <article className="admin-card interactive-card">
      <div className="admin-card__meta">
        <span className={`admin-badge ${parent.approved ? 'admin-badge--ok' : 'admin-badge--pending'}`}>
          {parent.approved ? t('adminPortal.approved') : t('adminPortal.pending')}
        </span>
        <span className="parent-dashboard__tag">{parent.relationship}</span>
      </div>
      <h4>{parent.name}</h4>
      <p className="admin-card__detail">
        {parent.email} · {t('common.child')}: {parent.childName} ({parent.childAge})
      </p>
      <p className="admin-card__detail">
        {parentConcerns.length} {t('superadminPortal.concerns').toLowerCase()} · {parentMeetings.length} {t('superadminPortal.sessions').toLowerCase()}
      </p>
      {!parent.approved && (
        <div className="admin-card__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={onApprove}>
            <HiCheck /> {t('adminPortal.approve')}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onReject}>
            <HiX /> {t('superadminPortal.remove')}
          </button>
        </div>
      )}
    </article>
  )
}

function ConcernCard({ concern, onUpdate }) {
  const { t } = useLanguage()
  const toast = useToast()
  const portalConfig = usePortalConfig()
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
      <p className="admin-card__detail">{t('common.from')} {concern.parentName} · {t('common.regarding')}: {concern.childName}</p>
      <p>{concern.description}</p>
      <label className="admin-card__note">
        {t('adminPortal.educatorNote')}
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="admin-card__actions">
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={() => {
            updateConcernStatus(concern.id, 'reviewed', note)
            toast.successT('toasts.concernUpdatedTitle', 'toasts.concernReviewedMessage')
            onUpdate()
          }}
        >
          {t('adminPortal.markUnderReview')}
        </button>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={() => {
            updateConcernStatus(concern.id, 'resolved', note)
            toast.successT('toasts.concernUpdatedTitle', 'toasts.concernResolvedMessage')
            onUpdate()
          }}
        >
          <HiCheck /> {t('adminPortal.markResolved')}
        </button>
      </div>
    </article>
  )
}

function MeetingCard({ meeting, onUpdate }) {
  const { t } = useLanguage()
  const toast = useToast()
  const portalConfig = usePortalConfig()
  const [note, setNote] = useState(meeting.adminNote || '')
  const [txnRef, setTxnRef] = useState(meeting.payment?.parentTxnRef || '')
  const isPendingPayment = meeting.status === 'pending_payment'
  const payment = meeting.payment

  function handleConfirmPayment() {
    confirmJazzCashManualPayment(meeting.id, { txnRef: txnRef.trim(), adminNote: note })
    toast.successT('toasts.paymentConfirmedTitle', 'toasts.paymentConfirmedMessage')
    onUpdate()
  }

  const isJazzCashManual =
    payment?.provider === 'jazzcash_manual' || payment?.provider === 'jazzcash_qr'

  return (
    <article className="admin-card interactive-card">
      <div className="admin-card__meta">
        <span className="parent-dashboard__tag">{formatDate(meeting.date)}</span>
        <span className="parent-dashboard__tag">{formatTime(meeting.time)}</span>
        <span className="admin-badge">{labelFor(portalConfig.meetingStatuses, meeting.status)}</span>
        {isJazzCashManual && (
          <span className="parent-dashboard__tag">JazzCash</span>
        )}
      </div>
      <h4>{meeting.parentName} — {meeting.childName}</h4>
      {meeting.agenda && <p>{meeting.agenda}</p>}
      {isPendingPayment && (
        <div className="admin-card__payment-pending">
          <p>
            <strong>{t('adminPortal.pendingManualPayment')}</strong>
            {' · '}
            {payment?.currency === 'PKR'
              ? `Rs ${Number(payment.amount).toLocaleString()}`
              : payment?.amount}
          </p>
          {payment?.parentTxnRef && (
            <p className="admin-card__detail">
              {t('adminPortal.parentTxnRef')}: {payment.parentTxnRef}
            </p>
          )}
          {payment?.paymentReceiptImage && (
            <div className="admin-card__receipt">
              <p className="admin-card__detail">{t('adminPortal.paymentReceipt')}</p>
              <a
                href={payment.paymentReceiptImage}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-card__receipt-link"
              >
                <img
                  src={payment.paymentReceiptImage}
                  alt={payment.paymentReceiptName || t('adminPortal.paymentReceipt')}
                />
              </a>
            </div>
          )}
          <label className="admin-card__note">
            {t('adminPortal.txnRefLabel')}
            <input
              type="text"
              value={txnRef}
              onChange={(e) => setTxnRef(e.target.value)}
              placeholder={t('adminPortal.txnRefPlaceholder')}
            />
          </label>
        </div>
      )}
      <div className="admin-card__actions">
        {isPendingPayment && (
          <button type="button" className="btn btn--primary btn--sm" onClick={handleConfirmPayment}>
            {t('adminPortal.confirmPayment')}
          </button>
        )}
        {meeting.status === 'scheduled' && (
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => {
              updateMeetingStatus(meeting.id, 'confirmed', null, note)
              toast.successT('toasts.sessionConfirmedTitle', 'toasts.sessionConfirmedMessage')
              onUpdate()
            }}
          >
            {t('adminPortal.confirm')}
          </button>
        )}
        {meeting.status !== 'cancelled' && meeting.status !== 'completed' && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              updateMeetingStatus(meeting.id, 'cancelled', null, note)
              toast.successT('toasts.meetingCancelledTitle', 'toasts.meetingCancelledMessage')
              onUpdate()
            }}
          >
            <HiX /> {t('common.cancel')}
          </button>
        )}
      </div>
    </article>
  )
}

function SystemTab({ accessCodes, activity, portalConfig, onCodesChange, onRefresh }) {
  const { t } = useLanguage()
  const toast = useToast()
  const [newCode, setNewCode] = useState('')
  const [exportMsg, setExportMsg] = useState('')

  function handleAddCode(e) {
    e.preventDefault()
    if (!newCode.trim()) return
    addAccessCode(newCode)
    setNewCode('')
    toast.successT('toasts.codeAddedTitle', 'toasts.codeAddedMessage')
    onCodesChange()
    onRefresh()
  }

  function handleRemove(code) {
    removeAccessCode(code)
    toast.successT('toasts.codeRemovedTitle', 'toasts.codeRemovedMessage')
    onCodesChange()
    onRefresh()
  }

  function handleResetCodes() {
    if (window.confirm('Reset access codes to defaults?')) {
      setAccessCodes([...basePortalConfig.accessCodes])
      toast.successT('toasts.codesResetTitle', 'toasts.codesResetMessage')
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
    setExportMsg(t('superadminPortal.exportSuccess'))
    toast.successT('toasts.dataExportedTitle', 'toasts.dataExportedMessage')
    setTimeout(() => setExportMsg(''), 3000)
  }

  return (
    <div className="superadmin-system">
      <div className="superadmin-system__grid">
        <div className="superadmin-system__panel">
          <SpeakHeading
            as="h3"
            speak={`${t('superadminPortal.accessCodesTitle')}. ${t('superadminPortal.accessCodesDesc')}`}
            body={t('superadminPortal.accessCodesDesc')}
          >
            <HiKey aria-hidden="true" /> {t('superadminPortal.accessCodesTitle')}
          </SpeakHeading>
          <p className="superadmin-system__desc">
            {t('superadminPortal.accessCodesDesc')}
          </p>
          <ul className="superadmin-codes">
            {accessCodes.map((code) => (
              <li key={code}>
                <code>{code}</code>
                <button type="button" className="superadmin-codes__remove" onClick={() => handleRemove(code)} aria-label={`${t('superadminPortal.removeCode')} ${code}`}>
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
              placeholder={t('superadminPortal.newCodePlaceholder')}
            />
            <button type="submit" className="btn btn--primary btn--sm">
              <HiPlus /> {t('superadminPortal.addCode')}
            </button>
          </form>
          <button type="button" className="btn btn--ghost btn--sm" onClick={handleResetCodes}>
            {t('superadminPortal.resetCodes')}
          </button>
        </div>

        <div className="superadmin-system__panel">
          <SpeakHeading
            as="h3"
            speak={`${t('superadminPortal.dataExportTitle')}. ${t('superadminPortal.dataExportDesc')}`}
            body={t('superadminPortal.dataExportDesc')}
          >
            <HiDatabase aria-hidden="true" /> {t('superadminPortal.dataExportTitle')}
          </SpeakHeading>
          <p className="superadmin-system__desc">
            {t('superadminPortal.dataExportDesc')}
          </p>
          <button type="button" className="btn btn--primary" onClick={handleExport}>
            <HiDatabase /> {t('superadminPortal.exportData')}
          </button>
          {exportMsg && <p className="superadmin-system__success">{exportMsg}</p>}

          <div className="superadmin-system__roles">
            <h4>{t('superadminPortal.portalAccountsTitle')}</h4>
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
        <SpeakHeading as="h3" speak={t('superadminPortal.activityLogTitle')}>
          <HiClipboardList aria-hidden="true" /> {t('superadminPortal.activityLogTitle')}
        </SpeakHeading>
        {activity.length === 0 ? (
          <p className="portal-page__empty">{t('superadminPortal.noActivity')}</p>
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
