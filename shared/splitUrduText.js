export const MAX_URDU_CHUNK_LENGTH = 380

export function splitUrduText(text, maxLen = MAX_URDU_CHUNK_LENGTH) {
  const chunks = []
  const sentences = text.split(/(?<=[.!?۔])\s+/u).filter(Boolean)
  let current = ''

  for (const sentence of sentences) {
    if (sentence.length > maxLen) {
      if (current) {
        chunks.push(current.trim())
        current = ''
      }
      for (let i = 0; i < sentence.length; i += maxLen) {
        chunks.push(sentence.slice(i, i + maxLen).trim())
      }
      continue
    }

    const next = current ? `${current} ${sentence}` : sentence
    if (next.length > maxLen) {
      if (current) chunks.push(current.trim())
      current = sentence
    } else {
      current = next
    }
  }

  if (current.trim()) chunks.push(current.trim())
  return chunks.length ? chunks : [text.slice(0, maxLen)]
}
