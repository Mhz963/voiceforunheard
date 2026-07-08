import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiBookOpen,
  HiCalendar,
  HiCheck,
  HiClipboardList,
  HiUserAdd,
  HiUserGroup,
  HiViewGrid,
  HiX,
} from 'react-icons/hi'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { usePortalConfig } from '../../i18n/usePortalConfig'
import PortalLayout from '../../components/portal/PortalLayout'
import AdminAcademics from '../../components/academics/AdminAcademics'
import { SpeakHeading } from '../../components/voice/SpeakAloud'
import {
  approveParent,
  deleteParent,
  getAllConcerns,
  getAllMeetings,
  getAllTuitionRequests,
  getParents,
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

export default function AdminDashboard() {
  const { t } = useLanguage()
  const portalConfig = usePortalConfig()
  const { admin, logout } = useAdminAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [refreshKey, setRefreshKey] = useState(0)

  const parents = useMemo(() => getParents(), [refreshKey])
  const concerns = useMemo(() => getAllConcerns(), [refreshKey])
  const meetings = useMemo(() => getAllMeetings(), [refreshKey])
  const tuitionRequests = useMemo(() => getAllTuitionRequests(), [refreshKey])

  const pendingParents = parents.filter((p) => !p.approved)
  const pendingTuition = tuitionRequests.filter((r) => r.status === 'pending')
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

  function handleApprove(parentId) {
    approveParent(parentId)
    toast.successT('toasts.parentApprovedTitle', 'toasts.parentApprovedMessage')
    refresh()
  }

  function handleReject(parentId) {
    if (window.confirm('Remove this access request?')) {
      deleteParent(parentId)
      toast.successT('toasts.parentRejectedTitle', 'toasts.parentRejectedMessage')
      refresh()
    }
  }

  const pageCopy = {
    overview: { title: t('adminPortal.dashboardTitle'), description: t('adminPortal.dashboardDesc') },
    requests: { title: t('adminPortal.requestsTitle'), description: t('adminPortal.requestsDesc') },
    parents: { title: t('adminPortal.parentsTitle'), description: t('adminPortal.parentsDesc') },
    concerns: { title: t('adminPortal.concernsTitle'), description: t('adminPortal.concernsDesc') },
    meetings: { title: t('adminPortal.meetingsTitle'), description: t('adminPortal.meetingsDesc') },
    academics: {
      title: t('adminPortal.academicsTitle'),
      description: t('adminPortal.academicsDesc'),
    },
  }[tab]

  const navItems = [
    { id: 'overview', label: t('adminPortal.overview'), icon: HiViewGrid },
    { id: 'academics', label: t('adminPortal.academics'), icon: HiBookOpen, badge: pendingTuition.length },
    { id: 'requests', label: t('adminPortal.requests'), icon: HiUserAdd, badge: pendingParents.length },
    { id: 'parents', label: t('adminPortal.parents'), icon: HiUserGroup },
    { id: 'concerns', label: t('adminPortal.concerns'), icon: HiClipboardList, badge: concerns.filter((c) => c.status === 'submitted').length },
    { id: 'meetings', label: t('adminPortal.meetings'), icon: HiCalendar, badge: pendingPayments.length || undefined },
  ]

  return (
    <PortalLayout
      variant="admin"
      portalLabel={t('portal.adminLabel')}
      userName={admin.name}
      userMeta={t('portal.educatorAccount')}
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
            <button type="button" className="portal-stat portal-stat--clickable" onClick={() => setTab('requests')}>
              <strong>{pendingParents.length}</strong>
              <span>{t('adminPortal.pendingRequests')}</span>
            </button>
            <button type="button" className="portal-stat portal-stat--clickable" onClick={() => setTab('parents')}>
              <strong>{parents.filter((p) => p.approved).length}</strong>
              <span>{t('adminPortal.approvedParents')}</span>
            </button>
            <button type="button" className="portal-stat portal-stat--clickable" onClick={() => setTab('concerns')}>
              <strong>{concerns.filter((c) => c.status === 'submitted').length}</strong>
              <span>{t('adminPortal.newConcerns')}</span>
            </button>
            <button type="button" className="portal-stat portal-stat--clickable" onClick={() => setTab('meetings')}>
              <strong>{upcomingMeetings.length}</strong>
              <span>{t('adminPortal.upcomingMeetings')}</span>
            </button>
            {pendingPayments.length > 0 && (
              <button type="button" className="portal-stat portal-stat--clickable" onClick={() => setTab('meetings')}>
                <strong>{pendingPayments.length}</strong>
                <span>{t('adminPortal.pendingPayments')}</span>
              </button>
            )}
            <button type="button" className="portal-stat portal-stat--clickable" onClick={() => setTab('academics')}>
              <strong>{pendingTuition.length}</strong>
              <span>{t('adminPortal.homeworkRequests')}</span>
            </button>
          </div>
          {pendingParents.length > 0 && (
            <div className="portal-page__section">
              <SpeakHeading as="h3">{t('adminPortal.latestRequest')}</SpeakHeading>
              <ParentRequestCard
                parent={pendingParents[0]}
                onApprove={() => handleApprove(pendingParents[0].id)}
                onReject={() => handleReject(pendingParents[0].id)}
              />
            </div>
          )}
        </div>
      )}

      {tab === 'academics' && (
        <AdminAcademics admin={admin} refreshKey={refreshKey} onRefresh={refresh} />
      )}

      {tab === 'requests' && (
        <div className="portal-page__list">
          {pendingParents.length === 0 ? (
            <p className="portal-page__empty">{t('adminPortal.noPending')}</p>
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
        <div className="portal-page__list">
          {parents.length === 0 ? (
            <p className="portal-page__empty">{t('adminPortal.noParents')}</p>
          ) : (
            parents.map((p) => (
              <article key={p.id} className="admin-card interactive-card">
                <div className="admin-card__meta">
                  <span className={`admin-badge ${p.approved ? 'admin-badge--ok' : 'admin-badge--pending'}`}>
                    {p.approved ? t('adminPortal.approved') : t('adminPortal.pending')}
                  </span>
                  <span className="parent-dashboard__tag">{p.relationship}</span>
                </div>
                <h4>{p.name}</h4>
                <p className="admin-card__detail">
                  {p.email} · {t('common.child')}: {p.childName} ({p.childAge})
                  {p.childGrade ? ` · Grade ${p.childGrade}` : ''}
                </p>
                <p className="admin-card__detail">
                  Concerns: {concerns.filter((c) => c.parentId === p.id).length} ·
                  Meetings: {meetings.filter((m) => m.parentId === p.id).length}
                </p>
                {!p.approved && (
                  <div className="admin-card__actions">
                    <button type="button" className="btn btn--primary btn--sm" onClick={() => handleApprove(p.id)}>
                      <HiCheck /> {t('adminPortal.approve')}
                    </button>
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => handleReject(p.id)}>
                      <HiX /> {t('adminPortal.reject')}
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      )}

      {tab === 'concerns' && (
        <div className="portal-page__list">
          {concerns.length === 0 ? (
            <p className="portal-page__empty">{t('adminPortal.noConcerns')}</p>
          ) : (
            concerns.map((c) => (
              <ConcernAdminCard key={c.id} concern={c} onUpdate={refresh} />
            ))
          )}
        </div>
      )}

      {tab === 'meetings' && (
        <div className="portal-page__list">
          {meetings.length === 0 ? (
            <p className="portal-page__empty">{t('adminPortal.noMeetings')}</p>
          ) : (
            meetings.map((m) => (
              <MeetingAdminCard key={m.id} meeting={m} onUpdate={refresh} />
            ))
          )}
        </div>
      )}
    </PortalLayout>
  )
}

function ParentRequestCard({ parent, onApprove, onReject }) {
  const { t } = useLanguage()

  return (
    <article className="admin-card interactive-card">
      <div className="admin-card__meta">
        <span className="admin-badge admin-badge--pending">{t('adminPortal.pendingApproval')}</span>
        <span className="parent-dashboard__tag">{t('adminPortal.requested')} {new Date(parent.createdAt).toLocaleDateString()}</span>
      </div>
      <h4>{parent.name}</h4>
      <p className="admin-card__detail">{parent.email}</p>
      <p className="admin-card__detail">
        {t('common.child')}: {parent.childName} ({parent.childAge}) · {parent.relationship}
      </p>
      <div className="admin-card__actions">
        <button type="button" className="btn btn--primary btn--sm" onClick={onApprove}>
          <HiUserAdd /> {t('adminPortal.approveAccess')}
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onReject}>
          <HiX /> {t('adminPortal.reject')}
        </button>
      </div>
    </article>
  )
}

function ConcernAdminCard({ concern, onUpdate }) {
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
      <p className="admin-card__detail">
        {t('common.from')} {concern.parentName} · Re: {concern.childName}
      </p>
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

function MeetingAdminCard({ meeting, onUpdate }) {
  const { t } = useLanguage()
  const toast = useToast()
  const portalConfig = usePortalConfig()
  const [note, setNote] = useState(meeting.adminNote || '')
  const isPendingPayment = meeting.status === 'pending_payment'
  const payment = meeting.payment
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
      <p className="admin-card__detail">{meeting.email}</p>
      {meeting.agenda && <p>{meeting.agenda}</p>}

      {isPendingPayment && (
        <div className="admin-card__payment-pending">
          <p>
            <strong>{t('adminPortal.pendingManualPaymentEducator')}</strong>
          </p>
          <p className="admin-card__detail">
            {t('adminPortal.pendingQrAmount')}:{' '}
            {payment?.currency === 'PKR'
              ? `Rs ${Number(payment.amount).toLocaleString()}`
              : payment?.amount}
          </p>
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
        </div>
      )}

      <label className="admin-card__note">
        {t('adminPortal.sessionNote')}
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="admin-card__actions">
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
            <HiCheck /> {t('adminPortal.confirm')}
          </button>
        )}
        {meeting.status !== 'completed' && meeting.status !== 'cancelled' && meeting.status !== 'pending_payment' && (
          <>
            <a href={meeting.meetLink} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--sm">
              <HiCalendar /> {t('adminPortal.openMeet')}
            </a>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => {
                updateMeetingStatus(meeting.id, 'completed', null, note)
                toast.successT('toasts.sessionCompletedTitle', 'toasts.sessionCompletedMessage')
                onUpdate()
              }}
            >
              {t('adminPortal.markCompleted')}
            </button>
          </>
        )}
        {meeting.status !== 'completed' && meeting.status !== 'cancelled' && (
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
