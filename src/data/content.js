export const CONTACT_EMAIL = 'binteanayat@gmail.com'

export const siteInfo = {
  name: 'VoiceForUnheard',
  tagline: 'Giving Voice to the Unheard',
  logo: '/logo1.png',
  favicon: '/icon1.png',
  contactEmail: CONTACT_EMAIL,
  description:
    'Speech, language and listening education for deaf and hard of hearing children in Pakistan, in Urdu and English. Created by special-education teacher Maria Anayat for families and teachers.',
  educator: {
    name: 'Maria Anayat',
    photo: '/images/educator/maria-anayat.jpeg',
    title: 'Special Education Teacher (Hearing Impairment)',
    role: 'Gazetted Officer, Government of Punjab · Founder',
    location: 'Gujrat, Punjab, Pakistan',
    bio: 'Maria Anayat teaches girls with hearing impairment at the Government Secondary School of Special Education in Gujrat, where she serves as a Junior Special Education Teacher (BS-16). Before that she worked as a speech and language therapist in Lahore. She holds an MPhil in Special Education (Hearing Impairment) and a PGD in Speech and Language Therapy from the University of the Punjab, and researches AI-based speech therapy for young deaf children.',
    education: [
      { title: 'MPhil, Special Education (Hearing Impairment)', place: 'University of the Punjab', period: '2021–2023', note: 'Thesis on the impact of AI-based speech therapy on speech development of pre-primary children with hearing impairment. USAID scholarship.' },
      { title: 'PGD, Speech and Language Therapy', place: 'University of the Punjab', period: '2020–2021' },
      { title: 'MA, Special Education (Hearing Impairment)', place: 'University of the Punjab', period: '2018–2020' },
      { title: "Improving Teachers' Skills in Sign Language (government certificate)", place: 'J.S.E.T (H.I) training', period: '2026' },
    ],
    experience: [
      { title: 'Junior Special Education Teacher (BS-16)', place: 'Govt. Secondary School of Special Education for HI Girls, Gujrat', period: '2025–present' },
      { title: 'Speech and Language Therapist', place: 'My Creation Clinic, Lahore', period: '2023–2025' },
      { title: 'Research Assistant (special education)', place: 'Lahore, with Dr. Samina Ashraf', period: '2022–2024' },
    ],
    research: [
      { title: 'AI-Based Speech Therapy for Hearing-Impaired Children', place: '3rd International Conference on Research in Special Education', period: '2023' },
      { title: "Teachers' Knowledge and Strategies for Working Memory of Hearing-Impaired Students", place: 'ICORE 2022, University of the Punjab', period: '2022' },
      { title: 'Strategies Used by Hearing-Impaired Graduates to Manage Working Memory Load', place: '2nd International Conference on Research in Special Education', period: '2022' },
    ],
  },
}

export const heroStats = [
  { value: '430M+', label: 'People with disabling hearing loss globally', source: 'WHO, 2024' },
  { value: '97.8M', label: 'Children and adolescents affected worldwide', source: 'Global Burden of Disease Study' },
  { value: '34M', label: 'Children requiring rehabilitation now', source: 'WHO' },
  { value: '$1T', label: 'Annual global cost of unaddressed hearing loss', source: 'WHO' },
]

export const globalStatistics = {
  overview: [
    {
      title: 'Global Prevalence',
      content:
        'Over 5% of the world population, approximately 430 million people, require rehabilitation to address disabling hearing loss. This includes 34 million children. Disabling hearing loss is defined as hearing loss greater than 35 decibels in the better hearing ear.',
      source: 'World Health Organization',
    },
    {
      title: 'Projected Growth',
      content:
        'By 2050, nearly 2.5 billion people are projected to have some degree of hearing loss. More than 700 million will require hearing rehabilitation. By 2030, disabling hearing loss is expected to affect 509 million people, rising to 612 million by 2040.',
      source: 'WHO & Global Health Estimates',
    },
    {
      title: 'Children and Adolescents',
      content:
        'Approximately 97.8 million children and adolescents under age 20 live with hearing loss globally. Prevalence increased from 3,537 per 100,000 in 1990 to 3,711 per 100,000 in 2021. Around 95.1 million children aged 5 to 19 years are affected worldwide.',
      source: 'BMC Public Health, Global Burden of Disease Study 2021',
    },
    {
      title: 'Regional Impact',
      content:
        'Nearly 80% of people with disabling hearing loss live in low and middle income countries. South Asia, Southeast Asia, and Eastern Sub-Saharan Africa show the highest prevalence rates. The Western Pacific region reports 21.5% prevalence among adults.',
      source: 'WHO Regional Data',
    },
    {
      title: 'Economic Burden',
      content:
        'Unaddressed hearing loss poses an annual global cost of almost one trillion US dollars. This includes reduced productivity, increased healthcare costs, and lost educational opportunities. Investment of less than $1.40 per person annually could scale up ear and hearing care services globally.',
      source: 'WHO',
    },
    {
      title: 'Youth at Risk',
      content:
        'Over 1 billion young adults are at risk of permanent, avoidable hearing loss due to unsafe listening practices. Among adults over 60, more than 25% are affected by disabling hearing loss, with prevalence increasing significantly with age.',
      source: 'WHO',
    },
  ],
  impacts: [
    {
      icon: 'communication',
      title: 'Communication Barriers',
      description:
        'Hearing loss limits spoken language development, social interaction, and academic participation. Children may struggle with vocabulary, grammar, and speech intelligibility without early intervention.',
    },
    {
      icon: 'cognition',
      title: 'Cognitive Effects',
      description:
        'Unaddressed hearing loss adversely affects cognition and increases risk of dementia and accelerated cognitive decline. The auditory cortex requires early stimulation for optimal brain development.',
    },
    {
      icon: 'isolation',
      title: 'Social Isolation',
      description:
        'Social isolation, loneliness, and stigma affect quality of life. Limitations in access to education and employment create lifelong disadvantages without proper support systems.',
    },
    {
      icon: 'education',
      title: 'Educational Gaps',
      description:
        'Children with hearing loss face barriers in mainstream classrooms. Without specialized speech education, reading comprehension, literacy, and academic achievement lag behind hearing peers.',
    },
  ],
}

export const whySpeechTherapy = {
  introduction:
    'Speech therapy is not optional for hearing impaired learners. It is the bridge between hearing technology and meaningful communication. Research consistently shows that structured, early, and sustained speech and language intervention dramatically improves outcomes across communication, literacy, and social integration.',
  reasons: [
    {
      title: 'Early Intervention Changes Lives',
      content:
        'The auditory cortex requires stimulation ideally before three and a half years of age. Early diagnosis combined with hearing aids or cochlear implants and immediate speech therapy maximizes neuroplasticity. Studies show children who receive intervention before 12 months achieve significantly better language outcomes.',
      evidence: 'NCBI, Auditory Verbal Therapy Research',
    },
    {
      title: 'Language Development Depends on Therapy',
      content:
        'Congenital or early acquired hearing impairment poses a major barrier to spoken language development. Without therapy, children develop vocabulary deficits, grammatical challenges, and reduced speech intelligibility. Structured intervention supports linguistic parity with hearing peers.',
      evidence: 'PMC Systematic Review, 2023',
    },
    {
      title: 'Family Centered Approaches Work',
      content:
        'Parents and caregivers who participate actively in therapy sessions become primary facilitators of their child\'s communication growth. Coaching based models like Auditory Verbal Therapy show superior outcomes when families are equipped with daily strategies.',
      evidence: 'Auditory Verbal UK, NCBI Bookshelf',
    },
    {
      title: 'Technology Alone Is Not Enough',
      content:
        'Hearing aids and cochlear implants provide access to sound, but children need trained guidance to interpret auditory input and develop spoken language. Speech therapy teaches listening skills, speech production, and communication strategies that devices cannot provide alone.',
      evidence: 'MDPI Audiology Research',
    },
    {
      title: 'Literacy and Academic Success',
      content:
        'Speech and language skills form the foundation for reading and writing. Children with hearing loss who receive consistent therapy show improved reading comprehension and greater integration into mainstream education. Without therapy, literacy gaps widen over time.',
      evidence: 'PubMed, Cochlear Implant Outcomes Study',
    },
    {
      title: 'Mental Health and Confidence',
      content:
        'Effective communication reduces frustration, anxiety, and social withdrawal. Speech therapy builds self advocacy skills and confidence, helping learners participate fully in school, friendships, and future careers.',
      evidence: 'WHO Hearing Loss Fact Sheet',
    },
  ],
  marketGrowth:
    'The global speech therapy market reflects growing demand. In the United States alone, the market is projected to grow from $4.9 billion in 2024 to $8.3 billion by 2031, driven by greater awareness, technological advances, and an increasing population requiring intervention.',
}

export const systemAdvantages = [
  {
    title: 'Created by a qualified special-education teacher',
    description:
      'Maria Anayat holds an MPhil in Special Education (Hearing Impairment) and a PGD in Speech and Language Therapy, and teaches deaf and hard of hearing girls in a Punjab government school.',
    icon: 'educator',
  },
  {
    title: 'Urdu and English, with read-aloud',
    description:
      'Every page works in Urdu and English. Tap Listen to hear any section read aloud, or Speak to fill in a form with your voice.',
    icon: 'accessibility',
  },
  {
    title: 'Free practice tools for home',
    description:
      'The Ling Six Sound check and age-based milestone checklists, free to use and print. More activities are on the way.',
    icon: 'ages',
  },
  {
    title: "Your family's communication choice",
    description:
      'Listening and spoken language, Pakistan Sign Language, or both. We support the path your family chooses.',
    icon: 'inclusive',
  },
  {
    title: 'Talk to the educator directly',
    description:
      'Request a consultation by WhatsApp or email. No account, no payment and no access code needed.',
    icon: 'family',
  },
  {
    title: 'Grounded in research',
    description:
      "Based on WHO guidance, auditory-verbal principles and Maria's own research on AI-assisted speech therapy for young deaf children.",
    icon: 'evidence',
  },
]

export const programCategories = [
  {
    id: 'auditory-verbal',
    title: 'Auditory Verbal Therapy',
    summary: 'Develop spoken language exclusively through listening with optimized hearing technology.',
    description:
      'Auditory Verbal Therapy is a family centered habilitation approach that helps deaf and hard of hearing children develop spoken language through listening. Sessions focus on audition, technological management, and caregiver coaching. The goal is age appropriate spoken language used as the primary communication method.',
    features: [
      'Listening first communication strategies',
      'Hearing technology optimization training',
      'Play based parent coaching sessions',
      'Auditory attention and discrimination exercises',
      'Natural conversation development',
    ],
    ages: 'Birth to 5 years',
    duration: 'Often 1 to 2 years of regular sessions; varies by child',
  },
  {
    id: 'articulation',
    title: 'Articulation and Speech Production',
    summary: 'Build clear, intelligible speech through targeted sound production training.',
    description:
      'Many hearing impaired learners develop speech patterns affected by limited auditory feedback. This program uses visual, tactile, and auditory cues to teach correct placement, manner, and voicing for speech sounds from early babbling through complex multisyllabic words.',
    features: [
      'Phoneme isolation and blending',
      'Visual and tactile cue systems',
      'Speech intelligibility scoring',
      'Carryover to conversational speech',
      'Recording and playback analysis',
    ],
    ages: '2 years to adult',
    duration: '8 to 16 week modules per sound group',
  },
  {
    id: 'language-development',
    title: 'Language Development',
    summary: 'Expand vocabulary, grammar, and narrative skills for academic and social success.',
    description:
      'Structured language intervention addresses receptive and expressive language gaps. Activities target vocabulary building, sentence structure, question answering, storytelling, and pragmatic language skills essential for classroom participation.',
    features: [
      'Receptive language comprehension',
      'Expressive vocabulary expansion',
      'Grammar and syntax training',
      'Narrative and storytelling skills',
      'Academic language preparation',
    ],
    ages: '18 months to 18 years',
    duration: 'Ongoing with quarterly assessments',
  },
  {
    id: 'sign-language',
    title: 'Sign Language and Visual Communication',
    summary: 'Master sign language as a primary or supporting communication mode.',
    description:
      'For families choosing sign language, this program offers Pakistan Sign Language (PSL) alongside spoken Urdu development, using free PSL resources from Deaf Reach where helpful. Bilingual bimodal approaches support children who use both signing and spoken language.',
    features: [
      'Pakistan Sign Language (PSL) vocabulary',
      'Fingerspelling and classifier skills',
      'Sign supported speech techniques',
      'Deaf culture and community connection',
      'Visual grammar and facial expression',
    ],
    ages: 'All ages',
    duration: 'Progressive levels from beginner to fluent',
  },
  {
    id: 'listening-skills',
    title: 'Auditory Training and Listening Skills',
    summary: 'Strengthen the ability to detect, discriminate, and understand sounds and speech.',
    description:
      'Listening is a learned skill. This program trains learners to use residual hearing and hearing technology effectively through environmental sound awareness, speech discrimination tasks, and auditory memory exercises.',
    features: [
      'Detection and discrimination tasks',
      'Auditory memory and sequencing',
      'Speech in noise training',
      'Localization and sound awareness',
      'Music and rhythm perception',
    ],
    ages: '6 months to adult',
    duration: '10 to 20 week structured modules',
  },
  {
    id: 'literacy',
    title: 'Literacy and Reading Support',
    summary: 'Bridge the gap between spoken language and reading comprehension.',
    description:
      'Reading skills are often the greatest challenge for hearing impaired learners. This program connects phonological awareness, decoding, fluency, and comprehension with the learner\'s communication mode and language level.',
    features: [
      'Phonological awareness training',
      'Decoding and sight word development',
      'Reading fluency practice',
      'Comprehension strategies',
      'Written expression support',
    ],
    ages: '4 years to adult',
    duration: 'School year aligned curriculum',
  },
  {
    id: 'social-communication',
    title: 'Social Communication and Pragmatics',
    summary: 'Navigate conversations, friendships, and social situations with confidence.',
    description:
      'Understanding social rules, turn taking, topic maintenance, and nonverbal cues is essential for inclusion. This program uses role play, video modeling, and group activities to build pragmatic language skills.',
    features: [
      'Conversation turn taking',
      'Topic initiation and maintenance',
      'Understanding humor and idioms',
      'Self advocacy and disclosure',
      'Conflict resolution skills',
    ],
    ages: '5 years to adult',
    duration: 'Individual sessions; group sessions planned',
  },
  {
    id: 'early-intervention',
    title: 'Early Intervention',
    summary: 'Critical first steps for infants and toddlers diagnosed with hearing loss.',
    description:
      'The first three years are the most critical window for language development. This intensive program supports families from diagnosis through device fitting, therapy initiation, and transition to preschool programs.',
    features: [
      'Newborn to toddler focused activities',
      'Parent coaching and home visits',
      'Device management training',
      'Developmental milestone tracking',
      'Transition planning for school',
    ],
    ages: 'Birth to 3 years',
    duration: 'Continuous until age 3, then transition',
  },
  {
    id: 'cochlear-implant',
    title: 'Cochlear Implant Rehabilitation',
    summary: 'Specialized habilitation for before and after cochlear implant activation.',
    description:
      'Cochlear implant recipients need structured mapping support and auditory rehabilitation. This program guides families through candidacy, surgery preparation, activation, and long term listening and speech development.',
    features: [
      'Pre implant expectation setting',
      'Activation and initial stimulation',
      'Mapping appointment preparation',
      'Auditory skill hierarchy progression',
      'Long term outcome monitoring',
    ],
    ages: '12 months to adult',
    duration: '3 to 5 year rehabilitation pathway',
  },
  {
    id: 'hearing-aid',
    title: 'Hearing Aid Orientation',
    summary: 'Maximize benefit from hearing aids through proper use and auditory training.',
    description:
      'Hearing aids require consistent wear, maintenance, and auditory learning. This program teaches device care, troubleshooting, and progressive auditory training to help learners extract maximum benefit from amplification.',
    features: [
      'Device insertion and care training',
      'Troubleshooting common issues',
      'Auditory acclimatization exercises',
      'Classroom FM system integration',
      'Annual hearing review preparation',
    ],
    ages: 'All ages',
    duration: '6 to 12 week orientation plus ongoing',
  },
  {
    id: 'transition',
    title: 'School Transition and Advocacy',
    summary: 'Prepare learners for mainstream classrooms and self advocacy.',
    description:
      'Moving from early intervention to school requires planning. This program supports IEP development, classroom accommodations, teacher training, and student self advocacy skills for successful inclusion.',
    features: [
      'IEP and 504 plan support',
      'Classroom accommodation guides',
      'Teacher in service training materials',
      'Peer awareness activities',
      'Self advocacy skill building',
    ],
    ages: '3 years to 18 years',
    duration: 'Annual review cycles',
  },
  {
    id: 'adult-rehab',
    title: 'Adult Rehabilitation',
    summary: 'Communication support for adults with acquired or late identified hearing loss.',
    description:
      'Adults who lose hearing or receive implants later in life face unique challenges. This program addresses workplace communication, assistive technology, lip reading, and counseling for adjustment.',
    features: [
      'Workplace communication strategies',
      'Assistive listening device training',
      'Speech reading skill development',
      'Counseling and adjustment support',
      'Tinnitus management resources',
    ],
    ages: '18 years and older',
    duration: 'Customized based on goals',
  },
]

export const ageGroups = [
  {
    id: 'infants',
    title: 'Infants',
    range: 'Birth to 12 months',
    focus: 'Detection, device fitting, parent coaching, and auditory stimulation',
    milestones: [
      'Consistent response to sound',
      'Early vocalization and babbling',
      'Parent confidence with device management',
      'Establishment of daily listening routines',
    ],
  },
  {
    id: 'toddlers',
    title: 'Toddlers',
    range: '1 to 3 years',
    focus: 'First words, auditory discrimination, and play based language',
    milestones: [
      '10 to 50 expressive words',
      'Following simple directions',
      'Auditory identification of familiar sounds',
      'Joint attention during play',
    ],
  },
  {
    id: 'preschool',
    title: 'Preschoolers',
    range: '3 to 5 years',
    focus: 'Sentence development, phonological awareness, and social play',
    milestones: [
      '3 to 5 word sentences',
      'Answering who, what, where questions',
      'Rhyming and sound awareness',
      'Peer interaction in group settings',
    ],
  },
  {
    id: 'school-age',
    title: 'School Age',
    range: '6 to 12 years',
    focus: 'Academic language, reading, and classroom communication',
    milestones: [
      'Grade level reading comprehension',
      'Complex sentence production',
      'Classroom participation',
      'Written language development',
    ],
  },
  {
    id: 'adolescents',
    title: 'Adolescents',
    range: '13 to 18 years',
    focus: 'Self advocacy, advanced literacy, and social identity',
    milestones: [
      'Independent device management',
      'Self advocacy in educational settings',
      'Abstract language and figurative speech',
      'Career and college preparation',
    ],
  },
  {
    id: 'adults',
    title: 'Adults',
    range: '18 years and older',
    focus: 'Workplace communication, technology, and life long learning',
    milestones: [
      'Workplace accommodation utilization',
      'Effective use of assistive technology',
      'Confident communication in diverse settings',
      'Ongoing auditory rehabilitation',
    ],
  },
]

export const methodology = {
  pillars: [
    {
      title: 'Assess',
      description:
        'Comprehensive evaluation of hearing status, communication mode, language level, speech intelligibility, and learning style. Baseline data drives individualized goal setting.',
      steps: ['Hearing history review', 'Language sampling', 'Standardized assessments', 'Family interview', 'Goal prioritization'],
    },
    {
      title: 'Plan',
      description:
        'Custom learning pathways aligned with family goals, communication philosophy, and developmental stage. SMART goals with clear milestones and timelines.',
      steps: ['Individualized education plan', 'Session frequency planning', 'Home practice design', 'Technology integration', 'Progress benchmarks'],
    },
    {
      title: 'Teach',
      description:
        'Evidence based instruction using multi sensory techniques, play based learning for young children, and structured drills for skill acquisition.',
      steps: ['Interactive lessons', 'Modelling and demonstration', 'Parent coaching', 'Peer group activities', 'Real world application'],
    },
    {
      title: 'Practice',
      description:
        'Daily home activities, printable practice tools, and everyday routines reinforce session goals. Consistency accelerates progress.',
      steps: ['Home activity ideas', 'Printable practice sheets', 'Community outings', 'School collaboration', 'Sibling involvement'],
    },
    {
      title: 'Measure',
      description:
        'Regular progress monitoring through session notes, reassessment and goal adjustment. What we observe informs every decision.',
      steps: ['Weekly session notes', 'Monthly progress reports', 'Quarterly reassessment', 'Annual review meetings', 'Outcome documentation'],
    },
  ],
  principles: [
    'Every child can communicate when given the right tools and support',
    'Families are partners, not spectators, in the therapy process',
    'Communication mode choice is respected and supported without bias',
    'Early and intensive intervention produces the best long term outcomes',
    'Technology must be optimized before therapy can succeed',
    'Inclusion in mainstream settings is an achievable goal with proper preparation',
    'Cultural and linguistic diversity enriches our approach',
    'Continuous professional development keeps our methods current',
  ],
}

export const resources = [
  {
    category: 'Free tools',
    items: [
      { name: 'Ling Six Sound Check', description: 'A two-minute daily check that your child can hear the full range of speech sounds', url: '/practice' },
      { name: 'Milestone Checklist', description: 'Age-based communication milestones you can tick and print', url: '/practice#milestones' },
    ],
  },
  {
    category: 'Pakistan',
    items: [
      { name: 'Pakistan Sign Language (Deaf Reach)', description: 'Free PSL resources, including a video dictionary of signs', url: 'https://new.psl.org.pk/resources' },
      { name: 'Family Educational Services Foundation', description: 'Deaf Reach schools and programs across Pakistan', url: 'https://fesf.org.pk/programs/' },
    ],
  },
  {
    category: 'Organizations',
    items: [
      { name: 'World Health Organization', description: 'Global hearing loss data and policy guidance', url: 'https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss' },
      { name: 'Hands & Voices', description: 'Parent driven support for families of deaf children', url: 'https://www.handsandvoices.org' },
      { name: 'AG Bell', description: 'Listening and spoken language resources and advocacy', url: 'https://www.agbell.org' },
    ],
  },
  {
    category: 'Research',
    items: [
      { name: 'NCBI Auditory Verbal Therapy', description: 'Clinical evidence on AVT effectiveness', url: 'https://www.ncbi.nlm.nih.gov/books/NBK606541/' },
      { name: 'Global Burden of Disease Study', description: 'Epidemiological data on childhood hearing loss', url: 'https://www.healthdata.org' },
      { name: 'PMC Cochrane Reviews', description: 'Systematic reviews on speech therapy interventions', url: 'https://www.ncbi.nlm.nih.gov/pmc/' },
    ],
  },
]

export const faqItems = [
  {
    question: 'When should my child start speech therapy after a hearing loss diagnosis?',
    answer:
      "As soon as possible. Research shows that support beginning before 12 months of age leads to much better language outcomes, because the brain's hearing pathways are most receptive in the first three years. If your child has just been diagnosed, request a consultation and we will help you plan the first steps.",
  },
  {
    question: 'Does VoiceForUnheard support families who use sign language?',
    answer:
      "Yes. We respect every family's communication choice. For signing families we focus on Pakistan Sign Language (PSL), alongside spoken Urdu if you wish, and we point you to the free PSL video dictionary from Deaf Reach. There is no single right path, only the right path for your family.",
  },
  {
    question: 'How is VoiceForUnheard different from clinic based speech therapy?',
    answer:
      'VoiceForUnheard was created by a teacher who works in a government special-education school and has also worked as a clinical speech and language therapist. The focus is on what helps at home and in the classroom: daily practice, school support and literacy, not only session-by-session goals.',
  },
  {
    question: 'Can my child use VoiceForUnheard alongside their current therapist?',
    answer:
      'Yes. The free practice tools, such as the Ling Six Sound check and milestone checklist, are designed to support the work you already do with your therapist or school.',
  },
  {
    question: 'What do we need to get started?',
    answer:
      'A phone with WhatsApp or email is enough to request a consultation, and the practice tools work on any phone. Hearing aids or cochlear implants should be fitted and programmed by your audiologist.',
  },
  {
    question: 'How is progress measured?',
    answer:
      'In consultations, progress is followed through observation, session notes and what parents report, across listening, speech, language and social communication. At home, the milestone checklist helps you see what your child can already do and what to work on next.',
  },
  {
    question: 'Is my information kept private?',
    answer:
      'Yes. The website does not store what you type in its forms. Your message goes directly to the educator through your own WhatsApp or email app. See the privacy policy for details.',
  },
]
