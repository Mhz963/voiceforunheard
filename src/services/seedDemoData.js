import { parentPortalConfig } from '../data/parentPortal'
import {
  addConcern,
  addLessonUpdate,
  addMeeting,
  addSchoolworkGuidance,
  addTuitionRequest,
  findParentByEmail,
  getAllLessonUpdates,
  getParents,
  isDemoSeeded,
  logActivity,
  markDemoSeeded,
  saveParent,
} from './parentStorage'

function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function seedDemoData() {
  ensureParentGrades()
  seedAcademicDemoData()

  if (isDemoSeeded()) return

  const demoParentId = 'parent_demo_001'
  const pendingParentId = 'parent_pending_001'

  if (!findParentByEmail(parentPortalConfig.demoParent.email)) {
    saveParent({
      id: demoParentId,
      name: 'Maria Chen',
      email: parentPortalConfig.demoParent.email,
      password: parentPortalConfig.demoParent.password,
      childName: 'Ethan',
      childAge: '7 years',
      childGrade: 2,
      relationship: 'parent',
      approved: true,
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    })
  }

  if (!findParentByEmail('james.wilson@email.com')) {
    saveParent({
      id: 'parent_demo_002',
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      password: 'parent2026',
      childName: 'Sophia',
      childAge: '5 years',
      childGrade: 1,
      relationship: 'parent',
      approved: true,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    })
  }

  if (!findParentByEmail('pending.family@email.com')) {
    saveParent({
      id: pendingParentId,
      name: 'Aisha Rahman',
      email: 'pending.family@email.com',
      password: 'pending123',
      childName: 'Omar',
      childAge: '4 years',
      childGrade: 1,
      relationship: 'parent',
      approved: false,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    })
  }

  const parent = findParentByEmail(parentPortalConfig.demoParent.email)
  if (parent) {
    addConcern({
      id: 'concern_demo_001',
      parentId: parent.id,
      parentName: parent.name,
      childName: parent.childName,
      category: 'speech',
      title: 'Difficulty with /s/ and /z/ sounds at home',
      description:
        'Ethan substitutes /th/ for /s/ during homework reading. He does better in quiet rooms but struggles when the TV is on.',
      urgency: 'medium',
      status: 'reviewed',
      adminNote: 'Will focus on auditory discrimination exercises in next session.',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    })

    addConcern({
      id: 'concern_demo_002',
      parentId: parent.id,
      parentName: parent.name,
      childName: parent.childName,
      category: 'school',
      title: 'Teacher reports trouble following group instructions',
      description:
        'His classroom teacher mentioned Ethan misses multi-step directions when background noise is high.',
      urgency: 'high',
      status: 'submitted',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    })

    addMeeting({
      id: 'meeting_demo_001',
      isDemo: true,
      parentId: parent.id,
      parentName: parent.name,
      childName: parent.childName,
      email: parent.email,
      date: daysFromNow(3),
      time: '10:00',
      agenda: 'Review progress on /s/ sound practice and discuss school accommodation letter.',
      meetLink: parentPortalConfig.googleMeetLink,
      status: 'confirmed',
      adminNote: 'Confirmed — please join 5 minutes early.',
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    })

    addMeeting({
      id: 'meeting_demo_002',
      isDemo: true,
      parentId: parent.id,
      parentName: parent.name,
      childName: parent.childName,
      email: parent.email,
      date: daysFromNow(10),
      time: '14:00',
      agenda: 'Monthly check-in on listening skills and home practice routine.',
      meetLink: parentPortalConfig.googleMeetLink,
      status: 'scheduled',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    })
  }

  logActivity({
    actor: 'System',
    role: 'system',
    action: 'Demo data initialized',
    detail: 'Sample families, concerns, and meetings loaded',
  })

  markDemoSeeded()
}

function ensureParentGrades() {
  getParents().forEach((parent) => {
    if (!parent.childGrade) {
      saveParent({ ...parent, childGrade: parent.childName === 'Ethan' ? 2 : 1 })
    }
  })
}

function seedAcademicDemoData() {
  if (getAllLessonUpdates().length > 0) return

  const parent = findParentByEmail(parentPortalConfig.demoParent.email)
  if (!parent) return

  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  addLessonUpdate({
    id: 'lesson_demo_001',
    audience: 'parent',
    parentId: parent.id,
    parentName: parent.name,
    childName: parent.childName,
    grade: parent.childGrade || 2,
    date: today,
    subjects: ['Mathematics', 'Reading'],
    topics: 'Two-digit addition, reading fluency passages',
    summary:
      'Today we practiced adding two-digit numbers with regrouping and read a short story focusing on expression and pacing.',
    homework: 'Complete worksheet pages 12–13. Read aloud for 10 minutes and note any tricky words.',
    educatorName: 'Educator Admin',
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
  })

  addLessonUpdate({
    id: 'lesson_demo_002',
    audience: 'parent',
    parentId: parent.id,
    parentName: parent.name,
    childName: parent.childName,
    grade: parent.childGrade || 2,
    date: yesterday,
    subjects: ['English Language Arts', 'Science'],
    topics: 'Sentence writing, plant life cycles',
    summary:
      'We wrote complete sentences about classroom routines and introduced how seeds grow into plants.',
    homework: 'Draw and label the parts of a plant. Write two sentences about what plants need.',
    educatorName: 'Educator Admin',
    createdAt: new Date(Date.now() - 30 * 3600000).toISOString(),
  })

  addSchoolworkGuidance({
    id: 'guidance_demo_001',
    parentId: parent.id,
    parentName: parent.name,
    childName: parent.childName,
    grade: parent.childGrade || 2,
    title: 'Math quiz preparation — Friday',
    message:
      'Ethan has a short math quiz on addition with regrouping this Friday. Please review the practice sheet sent home today.',
    tips:
      'Use small objects (coins, blocks) to model regrouping. Keep practice sessions to 15 minutes and praise effort.',
    priority: 'important',
    read: false,
    educatorName: 'Educator Admin',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  })

  addSchoolworkGuidance({
    id: 'guidance_demo_002',
    parentId: parent.id,
    parentName: parent.name,
    childName: parent.childName,
    grade: parent.childGrade || 2,
    title: 'Weekly reading log reminder',
    message: 'Please sign Ethan’s reading log after each evening read-aloud session this week.',
    tips: 'Choose a quiet spot, let Ethan point to words, and ask one question about the story afterward.',
    priority: 'normal',
    read: true,
    educatorName: 'Educator Admin',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  })

  addTuitionRequest({
    id: 'tuition_demo_001',
    parentId: parent.id,
    parentName: parent.name,
    childName: parent.childName,
    grade: parent.childGrade || 2,
    subject: 'Mathematics',
    requestType: 'homework',
    description: 'Ethan needs extra help with word problems involving two-step addition.',
    preferredTimes: 'Weekday evenings after 5 PM',
    status: 'offered',
    offerNote: 'I can offer a 30-minute homework help session on Wednesdays via Google Meet.',
    offerSchedule: 'Wednesdays 5:00–5:30 PM',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  })
}
