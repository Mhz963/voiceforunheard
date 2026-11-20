// Per-page titles and descriptions. Plain JS (no Vite-only APIs) so the build
// step in vite.config.js can import it to pre-render each page's <head>.

export const SITE_NAME = 'VoiceForUnheard'
export const OG_IMAGE = '/og-image.png'

export const routeMeta = {
  '/': {
    en: {
      title: 'VoiceForUnheard | Speech education for deaf and hard of hearing children in Pakistan',
      description: 'Urdu and English speech, language and listening support for deaf and hard of hearing children, created by special-education teacher Maria Anayat. Free home practice tools.',
    },
    ur: {
      title: 'وائس فار اناہیرڈ | پاکستان کے سماعت سے محروم بچوں کے لیے گفتار کی تعلیم',
      description: 'بہرے اور کم سننے والے بچوں کے لیے اردو اور انگریزی میں گفتار، زبان اور سننے کی مدد۔ خصوصی تعلیم کی معلمہ ماریہ عنایت کی طرف سے۔',
    },
  },
  '/statistics': {
    en: { title: 'Hearing loss statistics', description: 'Global hearing loss data from WHO and the Global Burden of Disease Study, and what it means for children.' },
    ur: { title: 'سننے کی کمی کے اعداد و شمار', description: 'عالمی ادارہ صحت اور عالمی تحقیق سے سننے کی کمی کے اعداد، اور بچوں کے لیے ان کا مطلب۔' },
  },
  '/why-therapy': {
    en: { title: 'Why speech therapy matters', description: 'Why early speech and language support matters for deaf and hard of hearing children, and how to get help in Pakistan.' },
    ur: { title: 'گفتار کا علاج کیوں ضروری ہے', description: 'سماعت سے محروم بچوں کے لیے جلد گفتار و زبان کی مدد کیوں ضروری ہے، اور پاکستان میں مدد کیسے حاصل کریں۔' },
  },
  '/programs': {
    en: { title: 'Program areas', description: '12 areas of support, from auditory-verbal therapy and articulation to Pakistan Sign Language, literacy and school transition.' },
    ur: { title: 'پروگرام', description: 'مدد کے ۱۲ شعبے — آڈیٹری وربل تھراپی اور تلفظ سے پاکستانی اشاراتی زبان، پڑھائی اور اسکول تک۔' },
  },
  '/age-groups': {
    en: { title: 'Learning paths by age', description: 'Communication goals and milestones for every stage, from infants to adults.' },
    ur: { title: 'عمر کے حساب سے سیکھنا', description: 'شیر خوار سے بڑوں تک ہر مرحلے کے لیے بات چیت کے مقاصد اور سنگِ میل۔' },
  },
  '/methodology': {
    en: { title: 'Our approach', description: 'The five-pillar method: Assess, Plan, Teach, Practice, Measure.' },
    ur: { title: 'ہمارا طریقہ', description: 'پانچ ستونوں والا طریقہ: جانچنا، منصوبہ، سکھانا، مشق، پیمائش۔' },
  },
  '/educator': {
    en: { title: 'Meet Maria Anayat', description: 'Maria Anayat: MPhil Special Education (Hearing Impairment), PGD Speech and Language Therapy, Gazetted special-education teacher in Gujrat, Punjab.' },
    ur: { title: 'ماریہ عنایت سے ملیں', description: 'ماریہ عنایت: ایم فل خصوصی تعلیم (سماعت)، پی جی ڈی گفتار و زبان کی تھراپی، گجرات پنجاب میں گزیٹڈ خصوصی تعلیم کی معلمہ۔' },
  },
  '/resources': {
    en: { title: 'Resources', description: 'Free tools, Pakistan Sign Language resources, and trusted organisations and research.' },
    ur: { title: 'وسائل', description: 'مفت اوزار، پاکستانی اشاراتی زبان کے وسائل، اور قابلِ بھروسہ تنظیمیں اور تحقیق۔' },
  },
  '/practice': {
    en: { title: 'Free home practice: Ling Six Sound check and milestone checklist', description: 'A two-minute daily Ling Six Sound check and age-based communication milestone checklists, in Urdu and English.' },
    ur: { title: 'گھر پر مفت مشق: لِنگ چھ آوازوں کی جانچ اور سنگِ میل', description: 'روزانہ دو منٹ کی لِنگ چھ آوازوں کی جانچ اور عمر کے حساب سے بات چیت کے سنگِ میل، اردو اور انگریزی میں۔' },
  },
  '/faq': {
    en: { title: 'Frequently asked questions', description: 'Answers for families, teachers and clinicians about speech education for deaf and hard of hearing children.' },
    ur: { title: 'عام سوالات', description: 'سماعت سے محروم بچوں کی گفتار کی تعلیم کے بارے میں گھر والوں، اساتذہ اور معالجین کے سوالات کے جواب۔' },
  },
  '/contact': {
    en: { title: 'Contact', description: 'Get in touch with VoiceForUnheard and educator Maria Anayat.' },
    ur: { title: 'رابطہ', description: 'وائس فار اناہیرڈ اور معلمہ ماریہ عنایت سے رابطہ کریں۔' },
  },
  '/consultation': {
    en: { title: 'Request a consultation', description: 'Tell us about your child and Maria Anayat will reply on WhatsApp, phone or email. No account needed.' },
    ur: { title: 'مشورے کی درخواست', description: 'اپنے بچے کے بارے میں بتائیں، ماریہ عنایت واٹس ایپ، فون یا ای میل پر جواب دیں گی۔ اکاؤنٹ کی ضرورت نہیں۔' },
  },
  '/privacy': {
    en: { title: 'Privacy policy', description: 'How VoiceForUnheard handles information about you and your child.' },
    ur: { title: 'رازداری کی پالیسی', description: 'وائس فار اناہیرڈ آپ اور آپ کے بچے کی معلومات کو کیسے سنبھالتا ہے۔' },
  },
  '/terms': {
    en: { title: 'Terms of use', description: 'The rules for using the VoiceForUnheard website.' },
    ur: { title: 'استعمال کی شرائط', description: 'وائس فار اناہیرڈ ویب سائٹ استعمال کرنے کے اصول۔' },
  },
}

export function fullTitle(title, locale = 'en') {
  if (!title) return SITE_NAME
  if (title.startsWith(SITE_NAME) || title.startsWith('وائس فار اناہیرڈ')) return title
  return `${title} | ${locale === 'ur' ? 'وائس فار اناہیرڈ' : SITE_NAME}`
}

export function metaForPath(pathname, locale = 'en', programs = []) {
  const path = pathname.replace(/\/+$/, '') || '/'
  const entry = routeMeta[path]
  if (entry) return { ...entry[locale] ?? entry.en, indexable: true }

  const programMatch = path.match(/^\/programs\/([^/]+)$/)
  if (programMatch) {
    const program = programs.find((p) => p.id === programMatch[1])
    if (program) return { title: program.title, description: program.summary, indexable: true }
  }
  return null
}
