export const portalConfig = {
  accessCodes: ['VFU-FAMILY-2026', 'VOICE-PARENT'],

  googleMeetLink: 'https://meet.google.com/lookup/voiceforunheard-demo',

  meetingDays: [1, 2, 3, 4, 5],
  timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
  sessionDurationMinutes: 45,
  maxDaysAhead: 28,

  roles: {
    parent: {
      label: 'Parent',
      email: 'parent@demo.com',
      password: 'demo123',
      dashboard: '/portal/parent',
      color: '#2a9d8f',
    },
    admin: {
      label: 'Educator Admin',
      email: 'admin@voiceforunheard.org',
      password: 'admin123',
      dashboard: '/portal/admin',
      color: '#1a4d6d',
    },
    superadmin: {
      label: 'Super Admin',
      email: 'super@voiceforunheard.org',
      password: 'super123',
      dashboard: '/portal/superadmin',
      color: '#0f3349',
    },
  },

  concernCategories: [
    { id: 'speech', label: 'Speech & Articulation' },
    { id: 'hearing', label: 'Hearing Technology & Listening' },
    { id: 'language', label: 'Language Development' },
    { id: 'school', label: 'School & Classroom Support' },
    { id: 'behavior', label: 'Behavior & Social Communication' },
    { id: 'home', label: 'Home Practice & Daily Routine' },
    { id: 'other', label: 'Other Concern' },
  ],

  urgencyLevels: [
    { id: 'low', label: 'General question' },
    { id: 'medium', label: 'Needs attention soon' },
    { id: 'high', label: 'Urgent — please respond quickly' },
  ],

  concernStatuses: [
    { id: 'submitted', label: 'Submitted' },
    { id: 'reviewed', label: 'Under Review' },
    { id: 'resolved', label: 'Resolved' },
  ],

  meetingStatuses: [
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ],
}

// Legacy aliases used by seed data and existing portals
export const parentPortalConfig = {
  ...portalConfig,
  demoParent: {
    email: portalConfig.roles.parent.email,
    password: portalConfig.roles.parent.password,
  },
  demoAdmin: {
    email: portalConfig.roles.admin.email,
    password: portalConfig.roles.admin.password,
  },
}
