import { parentPortalConfig } from '../data/parentPortal'
import {
  addConcern,
  addMeeting,
  findParentByEmail,
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
