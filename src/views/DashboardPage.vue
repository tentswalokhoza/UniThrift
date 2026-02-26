<script setup>
import { ref, onMounted, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getProductImage } from '@/composables/useProductImages'
const mapDiv = ref(null)


const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=marker`
    script.async = true
    script.defer = true

    script.onload = () => resolve(window.google)
    script.onerror = (err) => reject(err)

    document.head.appendChild(script)
  })
}

onMounted(async () => {
  try {
    const google = await loadGoogleMaps()

    const map = new google.maps.Map(mapDiv.value, {
      center: { lat: -33.9335, lng: 18.6280 },
      zoom: 16,
      mapId: 'DEMO_MAP_ID' 
    })

    //  maarker styling
    const makeMarkerEl = (label, sublabel, color, border, textColor) => {
      const el = document.createElement('div')
      el.style.cssText = 'display:flex; flex-direction:column; align-items:center; cursor:pointer;'
      el.innerHTML = `
        <div style="
          background:${color};
          color:${textColor};
          padding:6px 12px;
          border-radius:10px;
          font-weight:700;
          font-size:13px;
          font-family:sans-serif;
          text-align:center;
          box-shadow:0 4px 12px rgba(0,0,0,0.4);
          border:2px solid ${border};
          white-space:nowrap;
          line-height:1.3;
        ">
          ${label}
          ${sublabel ? `<div style="font-size:10px;font-weight:500;opacity:0.85;margin-top:2px;">${sublabel}</div>` : ''}
        </div>
        <div style="
          width:0; height:0;
          border-left:7px solid transparent;
          border-right:7px solid transparent;
          border-top:10px solid ${border};
        "></div>
      `
      return el
    }

    // UWC campus pin
    new google.maps.marker.AdvancedMarkerElement({
      position: { lat: -33.9335, lng: 18.6280 },
      map,
      title: 'UWC Campus',
      content: makeMarkerEl('🏫 UWC Campus', null, '#ffffff', '#cccccc', '#0f0f12')
    })

    const dropOffPoints = [
      {
        position: { lat: -33.9318, lng: 18.6295 },
        label: '📦 Drop-off A',
        sublabel: 'Student Centre Entrance',
        color: '#00faab',
        border: '#00b87a',
        textColor: '#0f0f12'
      },
      {
        position: { lat: -33.9352, lng: 18.6261 },
        label: '📦 Drop-off B',
        sublabel: 'Main Library Steps',
        color: '#7c3aed',
        border: '#5b21b6',
        textColor: '#ffffff'
      },
      {
        position: { lat: -33.9345, lng: 18.6312 },
        label: '📦 Drop-off C',
        sublabel: 'Residence Gate 3',
        color: '#f59e0b',
        border: '#b45309',
        textColor: '#0f0f12'
      }
    ]

    dropOffPoints.forEach(({ position, label, sublabel, color, border, textColor }) => {
      new google.maps.marker.AdvancedMarkerElement({
        position,
        map,
        title: label,
        content: makeMarkerEl(label, sublabel, color, border, textColor)
      })
    })

  } catch (err) {
    console.error('Failed to load Google Maps:', err)
  }
})


// category tabs
const categories = ['All', 'Jackets', 'Shoes', 'Accessories', 'Pants', 'T-Shirts'];

const getImageUrl = (val) => getProductImage(val) || ''

const allProducts = ref([])
const productCount = computed(() => allProducts.value.length)
const categoryCount = computed(() => {
  const set = new Set(allProducts.value.map(p => (p.category || '').toString().toLowerCase()).filter(Boolean))
  return set.size
})
const featuredCount = computed(() => allProducts.value.filter(p => p.status === 'available').length)

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

  const candidates = allProducts.value
    .map(p => ({
      ...p,
      image: getImageUrl(p.image || p.image_url || p.image_url_local || p.filename || '')
    }))
    .filter(p => p && p.image)

  if (candidates.length && catNorm) {
    const exact = candidates.find(p => normalize(p.category) === catNorm)
    if (exact) return getImageUrl(exact.image) || exact.image

    const partial = candidates.find(p => normalize(p.category).includes(catNorm) || catNorm.includes(normalize(p.category)))
    if (partial) return getImageUrl(partial.image) || partial.image

    const specialTokens = {
      Shoes: ['converse', 'sneaker', 'converse shoe'],
      Pants: ['bootleg', 'jeans', 'trouser', 'pants'],
      Accessories: ['casio', 'watch', 'keychain', 'key chain', 'key-ring', 'keyring', 'accessory'],
      Jackets: ['leather jacket', 'leather', 'jacket'],
      'T-Shirts': ['t-shirt', 't shirts', 'tshirt', 'tee']
    }
    const nameIncludes = (p, toks) => toks.some(tok => (p.title || p.name || '').toString().toLowerCase().includes(tok))
    const mapTokens = specialTokens[category] || []
    if (mapTokens.length) {
      const byName = candidates.find(p => nameIncludes(p, mapTokens))
      if (byName) return getImageUrl(byName.image) || byName.image
    }

    const catTokens = new Set(catNorm.split(' ').filter(Boolean))
    let best = { score: 0, image: null }
    for (const p of candidates) {
      const tokensArr = normalize(p.category).split(' ').filter(Boolean)
      let score = 0
      for (const t of tokensArr) if (catTokens.has(t)) score++
      if (score > best.score) best = { score, image: p.image }
    }
    if (best.image) return getImageUrl(best.image) || best.image

    if (fallbackMap[category]) return fallbackMap[category]
    if (candidates.length) return getImageUrl(candidates[0].image) || candidates[0].image
  }

  return fallbackMap[category] || ''
}
</script>

<template>
  <NavBar/>

  <div class="dashboard-container">
    <div class="hero-section">
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">UniThrift Dashboard</p>
          <h1>Curate the campus marketplace in one place.</h1>
          <p class="hero-subtitle">
            Track product activity, drop-off points, and browse the latest categories with a clean, focused workflow.
          </p>
          <div class="hero-actions">
            <router-link class="cta primary" to="/catalogue">Browse Catalogue</router-link>
            <router-link class="cta ghost" to="/cart">View Cart</router-link>
          </div>
        </div>
        <div class="hero-panel">
          <div class="stat-card">
            <div class="stat-label">Products</div>
            <div class="stat-value">{{ productCount }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Categories</div>
            <div class="stat-value">{{ categoryCount }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Available</div>
            <div class="stat-value">{{ featuredCount }}</div>
          </div>
          <div class="stat-cta">
            <router-link class="cta primary full" to="/seller">Manage Listings</router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="section-header">
        <h2 class="section-title">Campus Drop-Off Map</h2>
        <p class="section-subtitle">Pinpoint the nearest exchange location for quick, safe handoffs.</p>
      </div>
      <div class="map-shell">
        <div ref="mapDiv" class="map-container"></div>
        <div class="map-details">
          <h3>Drop-Off Locations</h3>
          <p class="muted">
            Use the map to plan a pickup. Staffed points open weekdays 09:00–17:00.
          </p>
          <div class="location-card">
            <div>
              <div class="location-title">Student Centre</div>
              <div class="location-meta">Main entrance pickup counter</div>
            </div>
            <span class="pill">Primary</span>
          </div>
          <div class="location-card">
            <div>
              <div class="location-title">Main Library Steps</div>
              <div class="location-meta">Covered kiosk near entrance</div>
            </div>
            <span class="pill alt">Secondary</span>
          </div>
          <div class="location-card">
            <div>
              <div class="location-title">Residence Gate 3</div>
              <div class="location-meta">Evening collection slot</div>
            </div>
            <span class="pill soft">After Hours</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="section-header">
        <h2 class="section-title">Browse by Category</h2>
        <p class="section-subtitle">Jump directly to the most popular product clusters.</p>
      </div>
      <div class="category-grid">
        <router-link
          v-for="category in categories.filter(c => c !== 'All')"
          :key="category"
          :to="{ name: 'catalogue', query: { category } }"
          class="category-card"
        >
          <img :src="getCategoryImage(category)" />
          <div class="category-overlay">
            <h3>{{ category }}</h3>
            <span>Explore now</span>
          </div>
        </router-link>
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
  margin: 20px;
  border-radius: 22px;
  padding: 40px 48px;
  background:
    radial-gradient(circle at top right, rgba(0, 250, 171, 0.24), transparent 45%),
    linear-gradient(130deg, rgba(0, 250, 171, 0.15), rgba(15, 15, 18, 0.8));
  border: 1px solid rgba(0, 250, 171, 0.2);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 28px;
  align-items: center;
}

.hero-copy h1 {
  font-size: 2.8rem;
  font-weight: 800;
  margin: 12px 0;
  color: #f5f5f5;
}

.hero-subtitle {
  color: #c8c8c8;
  font-size: 1rem;
  max-width: 520px;
}

.eyebrow {
  color: #00faab;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.7rem;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.hero-panel {
  background: rgba(15, 15, 18, 0.7);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: grid;
  gap: 12px;
}

.stat-card {
  background: #121216;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-label {
  color: #8b8b8b;
  font-size: 0.8rem;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #00faab;
  margin-top: 6px;
}

.stat-cta {
  margin-top: 6px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 22px;
}

.section-title {
  font-size: 2rem;
  color: #00faab;
  font-weight: 700;
}

.section-subtitle {
  color: #8f8f8f;
  font-size: 0.95rem;
}

.map-shell {
  display: grid;
  grid-template-columns: 1.5fr 0.8fr;
  gap: 20px;
  background: #141418;
  border-radius: 18px;
  padding: 18px;
  border: 1px solid rgba(0, 250, 171, 0.12);
  box-shadow: 0 24px 40px rgba(0, 0, 0, 0.35);
}

.map-container {
  height: 520px;
  background-color: #1f1f23;
  border-radius: 14px;
  border: 1px solid rgba(0, 250, 171, 0.1);
}

.map-details {
  display: grid;
  gap: 14px;
}

.location-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #111114;
  border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.location-title {
  font-weight: 700;
}

.location-meta {
  color: #8b8b8b;
  font-size: 0.85rem;
  margin-top: 4px;
}

.pill {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #0f0f12;
  background: #00faab;
}

.pill.alt {
  background: #8b5cf6;
  color: white;
}

.pill.soft {
  background: #fbbf24;
  color: #0f0f12;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 22px;
}

.category-card {
  background: #1f1f23;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s ease;
  border: 1px solid rgba(0, 250, 171, 0.12);
  text-decoration: none;
  position: relative;
}

.category-card:hover {
  transform: translateY(-8px);
  border-color: #00faab;
  box-shadow: 0 8px 24px rgba(0, 250, 171, 0.15);
}

.category-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.category-overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 16px;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category-overlay h3 {
  color: #d9d9d9;
  margin: 0;
}

.category-overlay span {
  color: #00faab;
  font-size: 0.85rem;
  font-weight: 600;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 700;
  border: 1px solid transparent;
}

.cta.primary {
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  color: #0f0f12;
}

.cta.ghost {
  border-color: rgba(255, 255, 255, 0.2);
  color: #d9d9d9;
  background: rgba(255, 255, 255, 0.04);
}

.cta.full {
  width: 100%;
}

.muted {
  color: #8b8b8b;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 28px 20px;
  }

  .hero-grid {
    grid-template-columns: 1fr;
  }

  .hero-copy h1 {
    font-size: 2rem;
  }

  .map-shell {
    grid-template-columns: 1fr;
  }

  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
