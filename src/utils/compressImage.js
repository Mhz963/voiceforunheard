const MAX_BYTES = 750_000

export async function compressImageFile(file, { maxWidth = 1200, quality = 0.82 } = {}) {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Please upload an image file (JPG, PNG, or WebP).')
  }

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const width = Math.round(img.width * scale)
        const height = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not process image.'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => reject(new Error('Could not read image.'))
      img.src = reader.result
    }
    reader.onerror = () => reject(new Error('Could not read file.'))
    reader.readAsDataURL(file)
  })

  const bytes = Math.ceil((dataUrl.length * 3) / 4)
  if (bytes > MAX_BYTES) {
    throw new Error('Image is too large. Please use a smaller screenshot.')
  }

  return dataUrl
}
