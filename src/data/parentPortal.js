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
      email: 'binteanayat@gmail.com',
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

  grades: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    label: `Grade ${i + 1}`,
  })),

  subjects: [
    'Mathematics',
    'English Language Arts',
    'Science',
    'Social Studies',
    'Reading',
    'Writing',
    'Homework Support',
    'General Study Skills',
  ],

  tuitionRequestTypes: [
    { id: 'homework', label: 'Homework help' },
    { id: 'tuition', label: 'Tuition / tutoring' },
    { id: 'both', label: 'Homework & tuition' },
  ],

  tuitionStatuses: [
    { id: 'pending', label: 'Pending review' },
    { id: 'offered', label: 'Offer arranged' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'completed', label: 'Completed' },
    { id: 'declined', label: 'Declined' },
  ],

  guidancePriorities: [
    { id: 'normal', label: 'General guidance' },
    { id: 'important', label: 'Important — action needed' },
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
