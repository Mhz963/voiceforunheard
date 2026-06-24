/**
 * Replace Latin-script terms in Urdu UI with everyday Urdu-script transliterations.
 * Longest phrases first to avoid partial replacements.
 */
const URDU_TERM_REPLACEMENTS = [
  ['VoiceForUnheard', 'وائس فار اناہیرڈ'],
  ['Auditory Verbal Therapy', 'آڈیٹری وربل تھراپی'],
  ['American Speech Language Hearing Association', 'امریکی گفتار زبان سننے کی تنظیم'],
  ['Global Burden of Disease Study', 'عالمی بیماری بوجھ کا مطالعہ'],
  ['World Health Organization', 'عالمی ادارہ صحت'],
  ['Cochlear Implant Outcomes Study', 'کوکلیر امپلانٹ نتائج کا مطالعہ'],
  ['Hearing Level Simulator', 'سننے کی سطح ماڈل'],
  ['NCBI Auditory Verbal Therapy', 'این سی بی آئی آڈیٹری وربل تھراپی'],
  ['MDPI Audiology Research', 'ایم ڈی پی آئی آڈیولوجی تحقیق'],
  ['WHO Hearing Loss Fact Sheet', 'عالمی ادارہ صحت سننے کے نقصان کا حقائق نامہ'],
  ['WHO Regional Data', 'عالمی ادارہ صحت علاقائی اعداد'],
  ['WHO & Global Health Estimates', 'عالمی ادارہ صحت اور عالمی صحت کے تخمینے'],
  ['BMC Public Health', 'بی ایم سی عوامی صحت'],
  ['PMC Cochrane Reviews', 'پی ایم سی کوکرین جائزے'],
  ['PMC Systematic Review', 'پی ایم سی منظم جائزہ'],
  ['Auditory Verbal UK', 'آڈیٹری وربل یوکے'],
  ['NCBI Bookshelf', 'این سی بی آئی بک شیلف'],
  ['Home Practice Library', 'گھر کی مشق کا مجموعہ'],
  ['Milestone Tracker', 'ترقی کا ٹریکر'],
  ['Device Care Guides', 'آلات کی دیکھ بھال گائیڈ'],
  ['Hands & Voices', 'ہینڈز اینڈ وائسز'],
  ['Cochlear Implant', 'کوکلیر امپلانٹ'],
  ['Auditory Verbal', 'آڈیٹری وربل'],
  ['Coming soon', 'جلد آ رہا ہے'],
  ['Access Codes', 'رسائی کوڈ'],
  ['Data Export', 'ڈیٹا برآمد'],
  ['Activity Log', 'سرگرمی کا ریکارڈ'],
  ['Portal Accounts', 'پورٹل اکاؤنٹس'],
  ['Reset to defaults', 'پہلے والے پر واپس'],
  ['Export Platform Data', 'سائٹ کا ڈیٹا برآمد کریں'],
  ['Evidence:', 'ثبوت:'],
  ['Source:', 'ماخذ:'],
  ['Re:', 'بابت:'],
  ['SuperAdmin', 'سپر منتظم'],
  ['Super Admin', 'سپر منتظم'],
  ['WHO', 'عالمی ادارہ صحت'],
  ['ASHA', 'اے ایس ایچ اے'],
  ['NCBI', 'این سی بی آئی'],
  ['PubMed', 'پب میڈ'],
  ['MDPI', 'ایم ڈی پی آئی'],
  ['PMC', 'پی ایم سی'],
  ['AG Bell', 'اے جی بیل'],
  ['Google', 'گوگل'],
  ['Meet', 'میٹ'],
  ['Admin', 'منتظم'],
  ['Demo', 'ڈیمو'],
  ['implant', 'امپلانٹ'],
  ['mapping', 'میپنگ'],
  ['IEP', 'انفرادی تعلیمی منصوبہ'],
  ['504 plan', '504 منصوبہ'],
  ['504', '504'],
  ['FM system', 'ایف ایم نظام'],
  ['FM', 'ایف ایم'],
  ['ASL', 'امریکی اشاراتی زبان'],
  ['AVT', 'آڈیٹری وربل تھراپی'],
  ['Sarah M.', 'سارہ ایم'],
  ['James T.', 'جیمز ٹی'],
  ['Priya K.', 'پریا کے'],
]

export function localizeLatinTermsForUrdu(value) {
  if (value == null || typeof value !== 'string') return value

  let text = value
  for (const [from, to] of URDU_TERM_REPLACEMENTS) {
    text = text.split(from).join(to)
  }
  return text
}

export function deepLocalizeLatinTermsForUrdu(data) {
  if (typeof data === 'string') return localizeLatinTermsForUrdu(data)
  if (Array.isArray(data)) return data.map(deepLocalizeLatinTermsForUrdu)
  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, deepLocalizeLatinTermsForUrdu(value)]),
    )
  }
  return data
}
