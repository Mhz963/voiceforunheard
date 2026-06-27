const KEYS = {
  parents: 'vfu_parents',
  concerns: 'vfu_concerns',
  meetings: 'vfu_meetings',
  lessonUpdates: 'vfu_lesson_updates',
  tuitionRequests: 'vfu_tuition_requests',
  schoolworkGuidance: 'vfu_schoolwork_guidance',
  parentSession: 'vfu_parent_session',
  adminSession: 'vfu_admin_session',
  superAdminSession: 'vfu_superadmin_session',
  activity: 'vfu_activity_log',
  accessCodes: 'vfu_access_codes',
  seeded: 'vfu_demo_seeded',
  pendingPayment: 'vfu_pending_payment',
}

function readList(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeList(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// ——— Parents ———

export function getParents() {
  return readList(KEYS.parents)
}

export function getParentById(id) {
  return getParents().find((p) => p.id === id)
}

export function saveParent(parent) {
  const parents = getParents()
  const index = parents.findIndex((p) => p.id === parent.id)
  if (index >= 0) parents[index] = parent
  else parents.push(parent)
  writeList(KEYS.parents, parents)
  return parent
}

export function findParentByEmail(email) {
  return getParents().find((p) => p.email.toLowerCase() === email.toLowerCase())
}

export function approveParent(parentId) {
  const parent = getParentById(parentId)
  if (!parent) return null
  return saveParent({ ...parent, approved: true })
}

export function deleteParent(parentId) {
  const parents = getParents().filter((p) => p.id !== parentId)
  writeList(KEYS.parents, parents)
}

// ——— Concerns ———

export function getAllConcerns() {
  return readList(KEYS.concerns).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getConcerns(parentId) {
  return getAllConcerns().filter((c) => c.parentId === parentId)
}

export function addConcern(concern) {
  const concerns = readList(KEYS.concerns)
  concerns.push(concern)
  writeList(KEYS.concerns, concerns)
  return concern
}

export function updateConcernStatus(concernId, status, adminNote = '') {
  const concerns = readList(KEYS.concerns)
  const index = concerns.findIndex((c) => c.id === concernId)
  if (index < 0) return null
  concerns[index] = {
    ...concerns[index],
    status,
    adminNote,
    updatedAt: new Date().toISOString(),
  }
  writeList(KEYS.concerns, concerns)
  return concerns[index]
}

// ——— Meetings ———

export function getAllMeetings() {
  return readList(KEYS.meetings).sort(
    (a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`),
  )
}

export function getMeetings(parentId) {
  return getAllMeetings().filter((m) => m.parentId === parentId)
}

export function getAllMeetingsForSlot(date, time) {
  return getAllMeetings().filter((m) => m.date === date && m.time === time && m.status !== 'cancelled')
}

export function addMeeting(meeting) {
  const meetings = readList(KEYS.meetings)
  meetings.push(meeting)
  writeList(KEYS.meetings, meetings)
  return meeting
}

export function cancelMeeting(meetingId, parentId) {
  return updateMeetingStatus(meetingId, 'cancelled', parentId)
}

export function updateMeetingStatus(meetingId, status, parentId = null, adminNote = '') {
  const meetings = readList(KEYS.meetings)
  const index = meetings.findIndex((m) => {
    if (parentId) return m.id === meetingId && m.parentId === parentId
    return m.id === meetingId
  })
  if (index < 0) return null
  meetings[index] = {
    ...meetings[index],
    status,
    adminNote,
    updatedAt: new Date().toISOString(),
  }
  writeList(KEYS.meetings, meetings)
  return meetings[index]
}

export function updateMeetingPayment(meetingId, paymentPatch, parentId = null) {
  const meetings = readList(KEYS.meetings)
  const index = meetings.findIndex((m) => {
    if (parentId) return m.id === meetingId && m.parentId === parentId
    return m.id === meetingId
  })
  if (index < 0) return null
  meetings[index] = {
    ...meetings[index],
    payment: { ...(meetings[index].payment || {}), ...paymentPatch },
    updatedAt: new Date().toISOString(),
  }
  writeList(KEYS.meetings, meetings)
  return meetings[index]
}

export function findMeetingByOrderId(orderId) {
  return getAllMeetings().find((m) => m.payment?.orderId === orderId) || null
}

export function canRequestRefund(meeting, refundPolicyDays = 7) {
  const payment = meeting?.payment
  if (!payment?.paidAt || payment.refunded || payment.refundStatus === 'refunded') {
    return false
  }
  if (payment.refundStatus === 'requested' || payment.refundStatus === 'pending_manual') {
    return false
  }
  const daysSincePaid = (Date.now() - new Date(payment.paidAt).getTime()) / (1000 * 60 * 60 * 24)
  return daysSincePaid <= refundPolicyDays
}

export function savePendingPayment(data) {
  localStorage.setItem(KEYS.pendingPayment, JSON.stringify(data))
}

export function getPendingPayment() {
  try {
    const raw = localStorage.getItem(KEYS.pendingPayment)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearPendingPayment() {
  localStorage.removeItem(KEYS.pendingPayment)
}

// ——— Lesson updates ———

export function getAllLessonUpdates() {
  return readList(KEYS.lessonUpdates).sort(
    (a, b) => new Date(b.date) - new Date(a.date) || new Date(b.createdAt) - new Date(a.createdAt),
  )
}

export function getLessonUpdatesForParent(parent) {
  const grade = Number(parent.childGrade)
  return getAllLessonUpdates().filter(
    (u) =>
      u.parentId === parent.id ||
      (u.audience === 'grade' && Number(u.grade) === grade),
  )
}

export function addLessonUpdate(update) {
  const items = readList(KEYS.lessonUpdates)
  items.push(update)
  writeList(KEYS.lessonUpdates, items)
  return update
}

// ——— Tuition / homework requests ———

export function getAllTuitionRequests() {
  return readList(KEYS.tuitionRequests).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getTuitionRequests(parentId) {
  return getAllTuitionRequests().filter((r) => r.parentId === parentId)
}

export function addTuitionRequest(request) {
  const items = readList(KEYS.tuitionRequests)
  items.push(request)
  writeList(KEYS.tuitionRequests, items)
  return request
}

export function updateTuitionRequest(requestId, patch) {
  const items = readList(KEYS.tuitionRequests)
  const index = items.findIndex((r) => r.id === requestId)
  if (index < 0) return null
  items[index] = {
    ...items[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  writeList(KEYS.tuitionRequests, items)
  return items[index]
}

// ——— Schoolwork guidance ———

export function getAllSchoolworkGuidance() {
  return readList(KEYS.schoolworkGuidance).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getSchoolworkGuidance(parentId) {
  return getAllSchoolworkGuidance().filter((g) => g.parentId === parentId)
}

export function addSchoolworkGuidance(guidance) {
  const items = readList(KEYS.schoolworkGuidance)
  items.push(guidance)
  writeList(KEYS.schoolworkGuidance, items)
  return guidance
}

export function markGuidanceRead(guidanceId, parentId) {
  const items = readList(KEYS.schoolworkGuidance)
  const index = items.findIndex((g) => g.id === guidanceId && g.parentId === parentId)
  if (index < 0) return null
  items[index] = { ...items[index], read: true }
  writeList(KEYS.schoolworkGuidance, items)
  return items[index]
}

export function markAllGuidanceRead(parentId) {
  const items = readList(KEYS.schoolworkGuidance)
  const updated = items.map((g) => (g.parentId === parentId ? { ...g, read: true } : g))
  writeList(KEYS.schoolworkGuidance, updated)
}

// ——— Parent session ———

export function getParentSession() {
  try {
    const raw = sessionStorage.getItem(KEYS.parentSession)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setParentSession(parent) {
  sessionStorage.setItem(
    KEYS.parentSession,
    JSON.stringify({ parentId: parent.id, email: parent.email }),
  )
}

export function clearParentSession() {
  sessionStorage.removeItem(KEYS.parentSession)
}

export function getParentFromSession() {
  const session = getParentSession()
  if (!session) return null
  return getParentById(session.parentId) || null
}

// ——— Admin session ———

export function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(KEYS.adminSession)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setAdminSession(admin) {
  sessionStorage.setItem(KEYS.adminSession, JSON.stringify({ email: admin.email, name: admin.name }))
}

export function clearAdminSession() {
  sessionStorage.removeItem(KEYS.adminSession)
}

export function isDemoSeeded() {
  return localStorage.getItem(KEYS.seeded) === 'true'
}

export function markDemoSeeded() {
  localStorage.setItem(KEYS.seeded, 'true')
}

// ——— Super admin session ———

export function getSuperAdminSession() {
  try {
    const raw = sessionStorage.getItem(KEYS.superAdminSession)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setSuperAdminSession(superadmin) {
  sessionStorage.setItem(KEYS.superAdminSession, JSON.stringify(superadmin))
}

export function clearSuperAdminSession() {
  sessionStorage.removeItem(KEYS.superAdminSession)
}

// ——— Access codes (superadmin managed) ———

export function getAccessCodes() {
  try {
    const raw = localStorage.getItem(KEYS.accessCodes)
    if (raw) return JSON.parse(raw)
  } catch {
    /* fall through */
  }
  return null
}

export function setAccessCodes(codes) {
  localStorage.setItem(KEYS.accessCodes, JSON.stringify(codes))
}

export function getEffectiveAccessCodes(defaultCodes) {
  return getAccessCodes() || defaultCodes
}

export function addAccessCode(code) {
  const normalized = code.trim().toUpperCase()
  const current = getAccessCodes() || [...defaultCodesFromConfig()]
  if (!current.includes(normalized)) {
    setAccessCodes([...current, normalized])
  }
  return getAccessCodes()
}

function defaultCodesFromConfig() {
  return ['VFU-FAMILY-2026', 'VOICE-PARENT']
}

export function removeAccessCode(code) {
  const current = getAccessCodes() || defaultCodesFromConfig()
  setAccessCodes(current.filter((c) => c !== code))
  return getAccessCodes()
}

// ——— Activity log ———

export function logActivity({ actor, role, action, detail }) {
  const entries = readList(KEYS.activity)
  entries.unshift({
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    actor,
    role,
    action,
    detail,
    createdAt: new Date().toISOString(),
  })
  writeList(KEYS.activity, entries.slice(0, 100))
}

export function getActivityLog() {
  return readList(KEYS.activity)
}

// Legacy aliases
export const getSession = getParentSession
export const setSession = setParentSession
export const clearSession = clearParentSession
