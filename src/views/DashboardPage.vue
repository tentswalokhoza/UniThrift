<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'

const categories = ['All', 'Jackets', 'Shoes', 'Accessories', 'Pants', 'T-Shirts'];

// resolve local product images (build-time) similar to cataloguePage
const importedImages = import.meta.glob('../assets/product/*', { eager: true, as: 'url' })
const imageMap = {}
Object.entries(importedImages).forEach(([path, url]) => {
  const parts = path.split('/')
  const name = parts[parts.length - 1]
  imageMap[name] = url
})

const getImageUrl = (val) => {
  if (!val) return ''
  if (typeof val !== 'string') return ''
  if (/^https?:\/\//.test(val)) return val
  const key = val.replace(/^\//, '')
  if (imageMap[key]) return imageMap[key]
  try { if (imageMap[decodeURIComponent(val)]) return imageMap[decodeURIComponent(val)] } catch {}
  const lower = val.toLowerCase()
  for (const [name, url] of Object.entries(imageMap)) {
    if (name.toLowerCase().includes(lower) || lower.includes(name.toLowerCase())) return url
  }
  return ''
}

const allProducts = ref([])

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:2006/products')
    if (!res.ok) throw new Error(res.statusText)
    const data = await res.json()
    allProducts.value = data.map(p => ({
      ...p,
      image: getImageUrl(p.image || p.image_url || p.image_url_local || p.filename || '')
    }))
    console.debug('Dashboard fetched products:', allProducts.value)
  } catch (err) {
    console.warn('Failed to fetch products for category images', err)
  }
})

const getCategoryImage = (category) => {
  const normalize = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const catNorm = normalize(category)
  const fallbackMap = {
    Jackets: getImageUrl('varsity-jacket.png') || getImageUrl('leather jacket.png') || 'https://images.unsplash.com/photo-1520975916090-3105956dac38',
    Shoes: getImageUrl('converse.png') || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    Accessories: getImageUrl('casio.png') || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    Pants: getImageUrl('bootlegged-jeans.png') || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
    'T-Shirts': getImageUrl('graphic-tee.png') || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f'
  }

  // collect candidate products that have an image
  const candidates = allProducts.value
    .map(p => ({
      ...p,
      image: getImageUrl(p.image || p.image_url || p.image_url_local || p.filename || '')
    }))
    .filter(p => p && p.image)

  if (candidates.length && catNorm) {
    // 1) exact category match
    const exact = candidates.find(p => normalize(p.category) === catNorm)
    if (exact) return getImageUrl(exact.image) || exact.image

    // 2) partial contains match (either direction)
    const partial = candidates.find(p => normalize(p.category).includes(catNorm) || catNorm.includes(normalize(p.category)))
    if (partial) return getImageUrl(partial.image) || partial.image

    // 3) try matching by product name tokens for specific requests
    const specialTokens = {
      Shoes: ['converse', 'sneaker', 'converse shoe'],
      Pants: ['bootleg', 'jeans', 'trouser', 'pants'],
      Accessories: ['casio', 'watch', 'keychain', 'key chain', 'key-ring', 'keyring', 'accessory'],
      Jackets: ['leather jacket', 'leather', 'jacket'],
      'T-Shirts': ['t-shirt', 't shirts', 'tshirt', 'tee']
    }
    const nameIncludes = (p, toks) => toks.some(tok => (p.name || '').toString().toLowerCase().includes(tok))
    const mapTokens = specialTokens[category] || []
    if (mapTokens.length) {
      const byName = candidates.find(p => nameIncludes(p, mapTokens))
      if (byName) return getImageUrl(byName.image) || byName.image
    }

    // 4) token overlap scoring on category string
    const catTokens = new Set(catNorm.split(' ').filter(Boolean))
    let best = { score: 0, image: null }
    for (const p of candidates) {
      const tokensArr = normalize(p.category).split(' ').filter(Boolean)
      let score = 0
      for (const t of tokensArr) if (catTokens.has(t)) score++
      if (score > best.score) best = { score, image: p.image }
    }
    if (best.image) return getImageUrl(best.image) || best.image

    // 5) prefer category fallback before generic first image
    if (fallbackMap[category]) return fallbackMap[category]
    if (candidates.length) return getImageUrl(candidates[0].image) || candidates[0].image
  }

  return fallbackMap[category] || ''
}
</script>

<template>
  <NavBar/>

  <div class="dashboard-container">

    <!-- HERO -->
    <div class="hero-section">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">UniThrift Dashboard</h1>
          <h2>Your student market.</h2>
          <p class="hero-subtitle"></p>
        </div>
      </div>
    </div>

    <!-- CAMPUS MAP -->
    <div class="content-wrapper">
      <h2 class="section-title">Campus Map</h2>
    </div>

    <div class="map-container" id="map"></div>

    <!-- BROWSE SECTION -->
    <div class="content-wrapper">
      <div class="browse-section">
        <h2 class="section-title">Browse by Category</h2>

        <div class="category-grid">
          <router-link
            v-for="category in categories.filter(c => c !== 'All')"
            :key="category"
            :to="{ name: 'catalogue', query: { category } }"
            class="category-card"
          >
            <img :src="getCategoryImage(category)" />
            <div class="category-content">
              <h3>{{ category }}</h3>
            </div>
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.dashboard-container {
  width: 100%;
  background-color: #0f0f12;
  color: #d9d9d9;
}


.hero-section {
  height: 400px;
  padding: 0;
  position: relative;
  border-radius: 16px;
  margin: 20px;
}

.hero-overlay {
  background: rgba(0,0,0,0.6);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.hero-content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}


.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.section-title {
  font-size: 2rem;
  color: #00faab;
  margin-bottom: 30px;
  font-weight: 700;
}


.map-container {
  height: 400px;
  background-color: #1f1f23;
  margin: 20px;
  border-radius: 12px;
  border: 1px solid rgba(0, 250, 171, 0.1);
}


.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.category-card {
  background: #1f1f23;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s ease;
  border: 1px solid rgba(0, 250, 171, 0.1);
  text-decoration: none;
}

.category-card:hover {
  transform: translateY(-8px);
  border-color: #00faab;
  box-shadow: 0 8px 24px rgba(0, 250, 171, 0.15);
}

.category-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.category-content {
  padding: 15px;
  text-align: center;
}

.category-content h3 {
  color: #d9d9d9;
  margin: 0;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
