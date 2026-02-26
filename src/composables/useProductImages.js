const importedImages = import.meta.glob('../assets/product/*', {
  eager: true,
  query: '?url',
  import: 'default'
})

const imageMap = {}
Object.entries(importedImages).forEach(([path, url]) => {
  const parts = path.split('/')
  const name = parts[parts.length - 1]
  imageMap[name] = typeof url === 'string' ? url : url?.default || ''
})

const defaultImg = imageMap['bootlegged-jeans.png'] || Object.values(imageMap)[0] || ''

const normalizeName = (s) => {
  if (!s) return ''
  const base = s.replace(/\\/g, '/').split('/').pop()
  if (base) s = base
  const noExt = s.replace(/\.(png|jpe?g|webp|gif|svg)$/i, '')
  let decoded = noExt
  try { decoded = decodeURIComponent(noExt) } catch {}
  return decoded.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

const normalizedMap = {}
for (const [name, url] of Object.entries(imageMap)) {
  normalizedMap[normalizeName(name)] = url
}

const tokens = (s) => s.split(/\s+/).filter(Boolean)

export const getProductImage = (fileNameOrUrl) => {
  if (!fileNameOrUrl) return defaultImg
  if (/^https?:\/\//.test(fileNameOrUrl)) return fileNameOrUrl

  const cleaned = fileNameOrUrl.replace(/^\\+|^\/+/, '').replace(/\\/g, '/')
  const base = cleaned.split('/').pop() || cleaned
  if (imageMap[base]) return imageMap[base]
  if (imageMap[cleaned]) return imageMap[cleaned]

  if (imageMap[fileNameOrUrl]) return imageMap[fileNameOrUrl]

  try {
    const decoded = decodeURIComponent(fileNameOrUrl)
    if (imageMap[decoded]) return imageMap[decoded]
    const decodedClean = decoded.replace(/^\\+|^\/+/, '').replace(/\\/g, '/')
    const decodedBase = decodedClean.split('/').pop() || decodedClean
    if (imageMap[decodedBase]) return imageMap[decodedBase]
    if (imageMap[decodedClean]) return imageMap[decodedClean]
  } catch {}

  const keyNorm = normalizeName(fileNameOrUrl)
  if (!keyNorm) return defaultImg
  if (normalizedMap[keyNorm]) return normalizedMap[keyNorm]

  const keyTokens = tokens(keyNorm)
  let best = { score: 0, url: null }
  for (const [imgNorm, url] of Object.entries(normalizedMap)) {
    const imgTokens = tokens(imgNorm)
    const set = new Set(imgTokens)
    let common = 0
    for (const t of keyTokens) if (set.has(t)) common++
    if (common > best.score) best = { score: common, url }
  }
  if (best.score > 0) return best.url

  for (const [name, url] of Object.entries(imageMap)) {
    if (name.toLowerCase().includes(keyNorm) || keyNorm.includes(name.toLowerCase())) return url
  }

  return defaultImg
}
