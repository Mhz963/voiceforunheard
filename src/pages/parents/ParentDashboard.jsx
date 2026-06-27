import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  HiBookOpen,
  HiCalendar,
  HiChatAlt2,
  HiPlus,
  HiVideoCamera,
  HiViewGrid,
  HiX,
} from 'react-icons/hi'
import { useParentAuth } from '../../context/ParentAuthContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { usePortalConfig } from '../../i18n/usePortalConfig'
import PortalLayout from '../../components/portal/PortalLayout'
import ParentAcademics from '../../components/academics/ParentAcademics'
import { SpeakButton, VoiceLabel } from '../../components/voice/VoiceInput'
import { SpeakHeading } from '../../components/voice/SpeakAloud'
import { appendSpeechText } from '../../hooks/useSpeechRecognition'
import {
  addConcern,
  cancelMeeting,
  canRequestRefund,
  getAllMeetingsForSlot,
  getConcerns,
  getLessonUpdatesForParent,
  getMeetings,
  getSchoolworkGuidance,
  updateMeetingPayment,
} from '../../services/parentStorage'
import { requestRefund } from '../../services/payments'
import SessionCheckout from '../../components/payments/SessionCheckout'
import '../../components/payments/SessionCheckout.css'

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

function getAvailableDates(config) {
  const dates = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 1; i <= config.maxDaysAhead; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (config.meetingDays.includes(d.getDay())) {
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
  const { t } = useLanguage()
  const portalConfig = usePortalConfig()
  const { parent, logout } = useParentAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState('overview')
  const [refreshKey, setRefreshKey] = useState(0)
  const [paymentNotice, setPaymentNotice] = useState('')

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['overview', 'academics', 'concerns', 'meetings'].includes(tabParam)) {
      setTab(tabParam)
    }
    if (searchParams.get('payment') === 'cancelled') {
      setPaymentNotice('cancelled')
    }
  }, [searchParams])

  const concerns = useMemo(() => getConcerns(parent.id), [parent.id, refreshKey])
  const meetings = useMemo(() => getMeetings(parent.id), [parent.id, refreshKey])
  const lessons = useMemo(() => getLessonUpdatesForParent(parent), [parent, refreshKey])
  const guidance = useMemo(() => getSchoolworkGuidance(parent.id), [parent.id, refreshKey])
  const unreadGuidance = guidance.filter((g) => !g.read).length

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

  const pageCopy = {
    overview: {
      title: t('parentPortal.overviewTitle'),
      description: t('parentPortal.overviewDesc', { childName: parent.childName, childAge: parent.childAge }),
    },
    concerns: {
      title: t('parentPortal.concernsTitle'),
      description: t('parentPortal.concernsDesc'),
    },
    meetings: {
      title: t('parentPortal.meetingsTitle'),
      description: t('parentPortal.meetingsDesc'),
    },
    academics: {
      title: t('parentPortal.academicsTitle'),
      description: t('parentPortal.academicsDesc', { childName: parent.childName }),
    },
  }[tab]

  const navItems = [
    { id: 'overview', label: t('parentPortal.overview'), icon: HiViewGrid },
    { id: 'academics', label: t('parentPortal.academics'), icon: HiBookOpen, badge: unreadGuidance },
    { id: 'concerns', label: t('parentPortal.concerns'), icon: HiChatAlt2, badge: concerns.length },
    { id: 'meetings', label: t('parentPortal.sessions'), icon: HiCalendar, badge: upcomingMeetings.length },
  ]

  return (
    <PortalLayout
      variant="parent"
      portalLabel={t('portal.parentLabel')}
      userName={parent.name}
      userMeta={t('portal.childMeta', { name: parent.childName })}
      navItems={navItems}
      activeId={tab}
      onNavigate={setTab}
      onLogout={handleLogout}
      pageTitle={pageCopy.title}
      pageDescription={pageCopy.description}
    >
          {tab === 'overview' && (
            <OverviewTab
              concerns={concerns}
              upcomingMeetings={upcomingMeetings}
          lessons={lessons}
          unreadGuidance={unreadGuidance}
              onGoConcerns={() => setTab('concerns')}
              onGoMeetings={() => setTab('meetings')}
          onGoAcademics={() => setTab('academics')}
            />
          )}
      {tab === 'academics' && (
        <ParentAcademics parent={parent} refreshKey={refreshKey} onRefresh={refresh} />
      )}
          {tab === 'concerns' && <ConcernsTab parent={parent} onSubmitted={refresh} concerns={concerns} />}
          {tab === 'meetings' && (
            <MeetingsTab
              parent={parent}
              meetings={meetings}
              paymentNotice={paymentNotice}
              onScheduled={refresh}
              onCancel={refresh}
              onRefund={refresh}
            />
          )}
    </PortalLayout>
  )
}

function OverviewTab({ concerns, upcomingMeetings, lessons, unreadGuidance, onGoConcerns, onGoMeetings, onGoAcademics }) {
  const { t } = useLanguage()

  return (
    <div className="portal-page">
      <div className="portal-page__stats">
        <div className="portal-stat">
          <strong>{lessons.length}</strong>
          <span>{t('parentPortal.lessonUpdates')}</span>
        </div>
        <div className="portal-stat">
          <strong>{unreadGuidance}</strong>
          <span>{t('parentPortal.newGuidance')}</span>
        </div>
        <div className="portal-stat">
          <strong>{concerns.length}</strong>
          <span>{t('parentPortal.concernsShared')}</span>
        </div>
        <div className="portal-stat">
          <strong>{upcomingMeetings.length}</strong>
          <span>{t('parentPortal.upcomingSessions')}</span>
        </div>
      </div>

      <div className="portal-page__actions">
        <button type="button" className="btn btn--primary" onClick={onGoAcademics}>
          <HiBookOpen /> {t('parentPortal.viewAcademics')}
        </button>
        <button type="button" className="btn btn--outline" onClick={onGoConcerns}>
          <HiPlus /> {t('parentPortal.shareConcern')}
        </button>
        <button type="button" className="btn btn--outline" onClick={onGoMeetings}>
          <HiCalendar /> {t('parentPortal.bookSession')}
        </button>
      </div>

      {lessons.length > 0 && (
        <div className="portal-page__section">
          <SpeakHeading as="h3" body={lessons[0].summary}>{t('parentPortal.todayLesson')}</SpeakHeading>
          <article className="academics-card interactive-card">
            <header className="academics-card__header">
              <span className="parent-dashboard__tag">{lessons[0].topics}</span>
            </header>
            <p>{lessons[0].summary}</p>
          </article>
        </div>
      )}

      {unreadGuidance > 0 && (
        <div className="portal-page__section">
          <SpeakHeading
            as="h3"
            body={unreadGuidance === 1
              ? t('parentPortal.guidanceCount', { count: unreadGuidance })
              : t('parentPortal.guidanceCountPlural', { count: unreadGuidance })}
          >
            {t('parentPortal.schoolworkReminder')}
          </SpeakHeading>
          <p className="admin-card__detail">
            {unreadGuidance === 1
              ? t('parentPortal.guidanceCount', { count: unreadGuidance })
              : t('parentPortal.guidanceCountPlural', { count: unreadGuidance })}
          </p>
          <button type="button" className="btn btn--outline btn--sm" onClick={onGoAcademics}>
            {t('parentPortal.viewGuidance')}
          </button>
        </div>
      )}

      {upcomingMeetings.length > 0 && (
        <div className="portal-page__section">
          <SpeakHeading as="h3">{t('parentPortal.nextSession')}</SpeakHeading>
          <MeetingCard meeting={upcomingMeetings[0]} />
        </div>
      )}

      {concerns.length > 0 && (
        <div className="portal-page__section">
          <SpeakHeading as="h3">{t('parentPortal.latestConcern')}</SpeakHeading>
          <ConcernCard concern={concerns[0]} />
        </div>
      )}
    </div>
  )
}

function ConcernsTab({ parent, onSubmitted, concerns }) {
  const { t } = useLanguage()
  const portalConfig = usePortalConfig()
  const [form, setForm] = useState({
    category: portalConfig.concernCategories[0].id,
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
      category: portalConfig.concernCategories[0].id,
      title: '',
      description: '',
      urgency: 'medium',
    })
    onSubmitted()
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="portal-page__split">
      <div className="parent-portal__auth-card">
        <SpeakHeading
          as="h2"
          body={`${t('parentPortal.shareConcernHint')} ${t('portal.speakInstead')}`}
        >
          {t('parentPortal.shareConcernForm')}
        </SpeakHeading>
        <p className="parent-portal__auth-sub">
          {t('parentPortal.shareConcernHint')} {t('portal.speakInstead')}
        </p>

        {submitted && (
          <div className="parent-portal__alert parent-portal__alert--success">
            {t('parentPortal.concernSubmitted')}
          </div>
        )}

        <form className="parent-portal__form" onSubmit={handleSubmit}>
          <label>
            {t('parentPortal.category')}
            <select value={form.category} onChange={(e) => update('category', e.target.value)} required>
              {portalConfig.concernCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>
          <label>
            <VoiceLabel onTranscript={(text) => update('title', appendSpeechText(form.title, text))}>
              {t('parentPortal.briefTitle')}
            </VoiceLabel>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              required
              placeholder="e.g. Difficulty with /s/ sounds at home"
            />
          </label>
          <label>
            <VoiceLabel onTranscript={(text) => update('description', appendSpeechText(form.description, text))}>
              {t('parentPortal.describeProblem')}
            </VoiceLabel>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              required
              placeholder="Share what you are noticing, when it happens, and what you have tried..."
            />
          </label>
          <label>
            {t('parentPortal.urgency')}
            <select value={form.urgency} onChange={(e) => update('urgency', e.target.value)} required>
              {portalConfig.urgencyLevels.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn--primary btn--block">{t('parentPortal.submitConcern')}</button>
        </form>
      </div>

      <div className="portal-page__list">
        <SpeakHeading as="h3">{t('parentPortal.yourConcerns')}</SpeakHeading>
        {concerns.length === 0 ? (
          <p className="portal-page__empty">{t('parentPortal.noConcerns')}</p>
        ) : (
          concerns.map((c) => <ConcernCard key={c.id} concern={c} />)
        )}
      </div>
    </div>
  )
}

function MeetingsTab({ parent, meetings, paymentNotice, onScheduled, onCancel, onRefund }) {
  const { t } = useLanguage()
  const portalConfig = usePortalConfig()
  const availableDates = useMemo(() => getAvailableDates(portalConfig), [portalConfig])
  const [form, setForm] = useState({
    date: availableDates[0] || '',
    time: portalConfig.timeSlots[0],
    agenda: '',
  })
  const [error, setError] = useState('')
  const [refundPolicyDays] = useState(7)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function isSlotTaken(time) {
    return getAllMeetingsForSlot(form.date, time).length > 0
  }

  const formValid =
    form.date &&
    form.time &&
    form.agenda.trim() &&
    !isSlotTaken(form.time)

  function handleCancel(id) {
    cancelMeeting(id, parent.id)
    onCancel()
  }

  async function handleRefund(meeting) {
    if (!meeting.payment?.providerPaymentId) return
    const confirmed = window.confirm(t('payments.refundConfirm'))
    if (!confirmed) return

    try {
      const result = await requestRefund(
        meeting.payment.provider,
        meeting.payment.providerPaymentId,
        'Not satisfied',
      )

      updateMeetingPayment(
        meeting.id,
        {
          refundStatus: result.refunded ? 'refunded' : 'pending_manual',
          refunded: Boolean(result.refunded),
          refundedAt: new Date().toISOString(),
        },
        parent.id,
      )
      onRefund()
    } catch (err) {
      if (meeting.payment.provider === 'jazzcash') {
        updateMeetingPayment(
          meeting.id,
          { refundStatus: 'pending_manual', refundRequestedAt: new Date().toISOString() },
          parent.id,
        )
        onRefund()
        window.alert(t('payments.jazzcashRefundNote'))
        return
      }
      window.alert(err.message || t('payments.refundFailed'))
    }
  }

  return (
    <div className="portal-page__split">
      <div className="parent-portal__auth-card">
        <SpeakHeading
          as="h2"
          body={t('parentPortal.scheduleHint', { minutes: portalConfig.sessionDurationMinutes })}
        >
          {t('parentPortal.scheduleMeeting')}
        </SpeakHeading>
        <p className="parent-portal__auth-sub">
          {t('parentPortal.scheduleHint', { minutes: portalConfig.sessionDurationMinutes })}
        </p>

        {paymentNotice === 'cancelled' && (
          <div className="parent-portal__alert parent-portal__alert--error">
            {t('payments.cancelled')}
          </div>
        )}
        {error && <div className="parent-portal__alert parent-portal__alert--error">{error}</div>}

        <form className="parent-portal__form" onSubmit={(e) => e.preventDefault()}>
          <label>
            {t('parentPortal.preferredDate')}
            <select value={form.date} onChange={(e) => update('date', e.target.value)} required>
              {availableDates.map((d) => (
                <option key={d} value={d}>{formatDate(d)}</option>
              ))}
            </select>
          </label>
          <label>
            {t('parentPortal.timeSlot')}
            <select value={form.time} onChange={(e) => update('time', e.target.value)} required>
              {portalConfig.timeSlots.map((slot) => (
                <option key={slot} value={slot} disabled={isSlotTaken(slot)}>
                  {formatTime(slot)}{isSlotTaken(slot) ? ` ${t('parentPortal.booked')}` : ''}
                </option>
              ))}
            </select>
          </label>
          <label>
            <VoiceLabel onTranscript={(text) => update('agenda', appendSpeechText(form.agenda, text))}>
              {t('parentPortal.discussAgenda')}
            </VoiceLabel>
            <textarea
              rows={4}
              value={form.agenda}
              onChange={(e) => update('agenda', e.target.value)}
              required
              placeholder="Share topics, recent challenges, or questions for the session..."
            />
          </label>
        </form>

        <SessionCheckout
          booking={{
            date: form.date,
            time: form.time,
            agenda: form.agenda.trim(),
          }}
          parent={parent}
          disabled={!formValid}
          onError={setError}
        />
      </div>

      <div className="portal-page__list">
        <SpeakHeading as="h3">{t('parentPortal.yourMeetings')}</SpeakHeading>
        {meetings.filter((m) => ['scheduled', 'confirmed'].includes(m.status)).length === 0 ? (
          <p className="portal-page__empty">{t('parentPortal.noMeetings')}</p>
        ) : (
          meetings
            .filter((m) => ['scheduled', 'confirmed'].includes(m.status))
            .map((m) => (
              <MeetingCard
                key={m.id}
                meeting={m}
                refundPolicyDays={refundPolicyDays}
                onCancel={() => handleCancel(m.id)}
                onRefund={() => handleRefund(m)}
              />
            ))
        )}
      </div>
    </div>
  )
}

function ConcernCard({ concern }) {
  const { t } = useLanguage()
  const portalConfig = usePortalConfig()
  const category = portalConfig.concernCategories.find((c) => c.id === concern.category)
  const urgency = portalConfig.urgencyLevels.find((u) => u.id === concern.urgency)

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
      <SpeakButton text={`${concern.title}. ${concern.description}`} />
      {concern.adminNote && (
        <div className="parent-dashboard__educator-note">
          <strong>{t('parentPortal.educatorNote')}</strong> {concern.adminNote}
          <SpeakButton text={concern.adminNote} label={t('parentPortal.listenToNote')} />
        </div>
      )}
      <footer>
        {t('common.submitted')} {new Date(concern.createdAt).toLocaleDateString()} · {t('common.status')}:{' '}
        {portalConfig.concernStatuses.find((s) => s.id === concern.status)?.label || concern.status}
      </footer>
    </article>
  )
}

function MeetingCard({ meeting, onCancel, onRefund, refundPolicyDays = 7 }) {
  const { t } = useLanguage()
  const portalConfig = usePortalConfig()
  const joinable = canJoinMeeting(meeting.date, meeting.time)
  const isPast = new Date(`${meeting.date}T${meeting.time}`) < new Date()
  const showRefund = canRequestRefund(meeting, refundPolicyDays)
  const payment = meeting.payment

  return (
    <article className="parent-dashboard__card interactive-card">
      <div className="parent-dashboard__card-meta">
        <span className="parent-dashboard__tag">{formatDate(meeting.date)}</span>
        <span className="parent-dashboard__tag">{formatTime(meeting.time)}</span>
        {meeting.status === 'confirmed' && (
          <span className="parent-dashboard__tag parent-dashboard__tag--confirmed">
            {portalConfig.meetingStatuses.find((s) => s.id === 'confirmed')?.label}
          </span>
        )}
        {payment && (
          <span className="parent-dashboard__tag">
            {payment.currency === 'PKR' ? `Rs ${Number(payment.amount).toLocaleString()}` : `$${payment.amount}`}
          </span>
        )}
        {payment?.refundStatus === 'refunded' && (
          <span className="parent-dashboard__tag parent-dashboard__tag--refunded">
            {t('payments.refunded')}
          </span>
        )}
        {payment?.refundStatus === 'pending_manual' && (
          <span className="parent-dashboard__tag">{t('payments.refundPending')}</span>
        )}
      </div>
      <h4>Video Session — {meeting.childName}</h4>
      {meeting.agenda && <p>{meeting.agenda}</p>}
      {meeting.adminNote && (
        <p className="parent-dashboard__educator-note">
          <strong>{t('parentPortal.fromEducator')}</strong> {meeting.adminNote}
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
            <HiVideoCamera /> {t('parentPortal.joinMeet')}
          </a>
        )}
        {!joinable && !isPast && (
          <span className="parent-dashboard__meet-hint">
            {t('parentPortal.joinHint')}
          </span>
        )}
        {onCancel && !isPast && (
          <button type="button" className="btn btn--ghost parent-dashboard__cancel" onClick={onCancel}>
            <HiX /> {t('common.cancel')}
          </button>
        )}
        {showRefund && onRefund && (
          <button type="button" className="btn btn--ghost parent-dashboard__refund" onClick={onRefund}>
            {t('payments.requestRefund')}
          </button>
        )}
      </div>
    </article>
  )
}
