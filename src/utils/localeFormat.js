const EASTERN_ARABIC = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩'

export function toWesternDigits(value) {
  if (value == null || typeof value !== 'string') return value

  return value
    .replace(/[\u06F0-\u06F9]/g, (ch) => String(EASTERN_ARABIC.indexOf(ch)))
    .replace(/[\u0660-\u0669]/g, (ch) => String(ARABIC_INDIC.indexOf(ch)))
}

export function deepWesternDigits(data) {
  if (typeof data === 'string') return toWesternDigits(data)
  if (Array.isArray(data)) return data.map(deepWesternDigits)
  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, deepWesternDigits(value)]),
    )
  }
  return data
}
