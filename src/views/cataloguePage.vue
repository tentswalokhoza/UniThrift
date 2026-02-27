<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { searchQuery } from '@/composables/useSearch'
import { useSession } from '@/composables/useSession'

const products = ref([])
const route = useRoute()
const router = useRouter()
const { userId } = useSession()
const cartNotice = ref('')
const addedMap = ref({})
const sortOption = ref('featured')

const selectedCategory = computed(() => {
  const value = (route.query.category || 'All').toString().trim()
  return value || 'All'
})

const categories = computed(() => {
  const set = new Set(
    products.value
      .map(p => (p.category || '').toString().trim())
      .filter(Boolean)
  )
  return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
})

const filteredProducts = computed(() => {
  let list = [...products.value]

  if (selectedCategory.value !== 'All') {
    const catLower = selectedCategory.value.toLowerCase()
    list = list.filter(p => (p.category || '').toLowerCase() === catLower)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    )
  }

  switch (sortOption.value) {
    case 'price-low':
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
      break
    case 'price-high':
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
      break
    case 'newest':
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      break
    case 'name':
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      break
    default:
      list.sort((a, b) => {
        const statusRankA = a.status === 'available' ? 0 : 1
        const statusRankB = b.status === 'available' ? 0 : 1
        if (statusRankA !== statusRankB) return statusRankA - statusRankB
        return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      })
  }

  return list
})

const setCategory = async (category) => {
  const nextQuery = { ...route.query }
  if (category === 'All') {
    delete nextQuery.category
  } else {
    nextQuery.category = category
  }
  await router.push({ name: 'catalogue', query: nextQuery })
}

const expandedCards = ref(new Set())
const getCardKey = (product, index) => product.product_id ?? product.id ?? `${product.title || 'item'}-${index}`

const toggleCard = (cardKey) => {
  if (expandedCards.value.has(cardKey)) {
    expandedCards.value.delete(cardKey)
  } else {
    expandedCards.value.add(cardKey)
  }
  expandedCards.value = new Set(expandedCards.value)
}

const isExpanded = (cardKey) => expandedCards.value.has(cardKey)

const importedImages = import.meta.glob('../assets/product/*', { eager: true, as: 'url' })
const imageMap = {}
Object.entries(importedImages).forEach(([path, url]) => {
  const parts = path.split('/')
  const name = parts[parts.length - 1]
  imageMap[name] = url
})

const defaultImg = Object.values(imageMap)[0]

const normalizeName = (s) => {
  if (!s) return ''
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

const getImage = (fileNameOrUrl) => {
  if (!fileNameOrUrl) return defaultImg
  if (/^https?:\/\//.test(fileNameOrUrl)) return fileNameOrUrl
  if (fileNameOrUrl.startsWith('/')) return fileNameOrUrl

  if (imageMap[fileNameOrUrl]) return imageMap[fileNameOrUrl]

  try {
    const decoded = decodeURIComponent(fileNameOrUrl)
    if (imageMap[decoded]) return imageMap[decoded]
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

const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return 'R0.00'
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount)
}

const addToCart = async (product) => {
  if (product.status === 'sold') return

  if (!userId) {
    alert('Please sign in to add items to your cart.')
    return
  }
  try {
    const res = await fetch('http://localhost:2006/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        productId: product.product_id,
        quantity: 1
      })
    })
    if (!res.ok) throw new Error(res.statusText)
    cartNotice.value = `${product.title || 'Item'} added to cart`
    setTimeout(() => { cartNotice.value = '' }, 2000)
    addedMap.value = { ...addedMap.value, [product.product_id]: true }
    setTimeout(() => {
      const next = { ...addedMap.value }
      delete next[product.product_id]
      addedMap.value = next
    }, 2000)
  } catch (err) {
    console.error('Failed to add to cart', err)
    cartNotice.value = 'Failed to add to cart'
    setTimeout(() => { cartNotice.value = '' }, 2000)
  }
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:2006/products')
    if (!res.ok) throw new Error(res.statusText)
    products.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch product catalogue from SQL', err)
  }
})
</script>

<template>
  <NavBar />

  <div class="catalogue-container">
    <div v-if="cartNotice" class="toast">{{ cartNotice }}</div>

    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Catalogue</h1>
        <p class="hero-subtitle">Browse Our Fashion Collection</p>
      </div>
    </div>

    <section class="content-wrapper">
      <div class="toolbar">
        <div class="category-chips">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            class="chip"
            :class="{ active: selectedCategory === category }"
            @click="setCategory(category)"
          >
            {{ category }}
          </button>
        </div>

        <div class="toolbar-actions">
          <label for="sort" class="sort-label">Sort by</label>
          <select id="sort" v-model="sortOption" class="sort-select">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div class="result-header">
        <p>{{ filteredProducts.length }} products found</p>
      </div>

      <div class="products-grid">
        <article
          v-for="(product, index) in filteredProducts"
          :key="getCardKey(product, index)"
          class="product-card"
        >
          <div
            class="card"
            :class="{ expanded: isExpanded(getCardKey(product, index)) }"
            @click="toggleCard(getCardKey(product, index))"
          >
            <div class="image_container">
              <img
                :src="getImage(product.image_url || product.image)"
                :alt="`Photo of ${product.title}`"
              />
              <span class="status-pill" :class="`status-${product.status}`">{{ product.status || 'unknown' }}</span>
            </div>

            <div class="card-minimal">
              <div class="title">{{ product.title }}</div>
              <div class="price">{{ formatCurrency(product.price) }}</div>
            </div>

            <div class="card-details-wrapper" :class="{ visible: isExpanded(getCardKey(product, index)) }">
              <div class="card-details-inner">
                <div class="details-grid">
                  <div class="detail-item">
                    <span class="detail-label">Seller</span>
                    <span class="detail-value">{{ product.seller_name || 'Unknown' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Category</span>
                    <span class="detail-value category-tag">{{ product.category || 'Uncategorized' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Size</span>
                    <span class="detail-value">{{ product.size || 'N/A' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Stock</span>
                    <span class="detail-value">{{ product.quantity ?? 0 }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Listed</span>
                    <span class="detail-value">{{ product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A' }}</span>
                  </div>
                </div>

                <p v-if="product.description" class="description">{{ product.description }}</p>

                <div class="action" @click.stop>
                  <button
                    class="cart-button"
                    :disabled="product.status === 'sold'"
                    @click.stop="addToCart(product)"
                  >
                    {{ product.status === 'sold' ? 'Sold Out' : addedMap[product.product_id] ? 'Added' : 'Add to Cart' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="expand-hint">
              <span class="chevron" :class="{ flipped: isExpanded(getCardKey(product, index)) }">&#8964;</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.catalogue-container {
  width: 100%;
  color: #e4e7eb;
}

.toast {
  position: fixed;
  top: 84px;
  right: 20px;
  z-index: 60;
  background: rgba(0, 250, 171, 0.14);
  color: #00faab;
  border: 1px solid rgba(0, 250, 171, 0.4);
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  backdrop-filter: blur(8px);
}

.hero-section {
  max-width: 1220px;
  margin: 20px auto 0;
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 48%),
    linear-gradient(125deg, #00faab 0%, #00c896 56%, #009e8f 100%);
  color: #041311;
  padding: 34px 28px;
  border: 1px solid rgba(0, 250, 171, 0.24);
}

.hero-content {
  text-align: center;
}

.hero-title {
  margin: 0;
  font-size: 2.4rem;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  margin: 8px 0 0;
  color: rgba(4, 19, 17, 0.8);
  font-weight: 600;
}

.content-wrapper {
  max-width: 1320px;
  margin: 0 auto;
  padding: 30px 20px 60px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  padding: 14px;
  background: #15171d;
  border: 1px solid rgba(0, 250, 171, 0.14);
  border-radius: 14px;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  background: #101218;
  color: #c8cfd8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.chip:hover {
  border-color: rgba(0, 250, 171, 0.45);
  color: #efffff;
}

.chip.active {
  background: linear-gradient(135deg, #00faab, #00c896);
  color: #062320;
  border-color: transparent;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-label {
  font-size: 0.84rem;
  color: #95a0ad;
  font-weight: 600;
}

.sort-select {
  background: #11141a;
  color: #dbe2ea;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 8px 12px;
  min-width: 190px;
}

.sort-select:focus {
  outline: none;
  border-color: rgba(0, 250, 171, 0.6);
  box-shadow: 0 0 0 3px rgba(0, 250, 171, 0.14);
}

.result-header {
  margin-top: 14px;
  color: #9da8b3;
  font-size: 0.9rem;
}

.products-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  align-items: start;
}

.product-card {
  align-self: start;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #1a1d24, #14161c);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(0, 250, 171, 0.08);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.45);
  border-color: rgba(0, 250, 171, 0.35);
}

.image_container {
  width: 100%;
  height: 300px;
  overflow: hidden;
  position: relative;
}

.image_container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s ease;
}

.card:hover .image_container img {
  transform: scale(1.05);
}

.status-pill {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(0, 109, 74, 0.92);
  color: #e9fff7;
}

.status-sold {
  background: rgba(122, 20, 20, 0.92);
  color: #ffe5e5;
}

.status-removed {
  background: rgba(68, 74, 83, 0.92);
  color: #eef2f6;
}

.card-minimal {
  padding: 0.95rem 1rem 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.card-minimal .title {
  font-size: 0.92rem;
  font-weight: 800;
  color: #f3f6f8;
  letter-spacing: 0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-minimal .price {
  font-size: 1rem;
  font-weight: 700;
  color: #00faab;
}

.card-details-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-details-wrapper.visible {
  grid-template-rows: 1fr;
}

.card-details-inner {
  overflow: hidden;
  padding: 0 1rem;
  transition: padding 0.35s ease;
}

.card-details-wrapper.visible .card-details-inner {
  padding: 0.3rem 1rem 1rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem 0.9rem;
  margin-bottom: 0.7rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
}

.detail-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #66707b;
  font-weight: 700;
}

.detail-value {
  font-size: 0.82rem;
  color: #c7d0da;
  font-weight: 600;
}

.category-tag {
  color: #00faab;
}

.description {
  font-size: 0.82rem;
  color: #8f9aa6;
  line-height: 1.45;
  margin-bottom: 0.85rem;
}

.cart-button {
  width: 100%;
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  color: #071916;
  border: none;
  border-radius: 9px;
  padding: 9px 12px;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.cart-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 250, 171, 0.28);
}

.cart-button:disabled {
  background: #2c3038;
  color: #8d97a3;
  cursor: not-allowed;
  box-shadow: none;
}

.expand-hint {
  text-align: center;
  padding: 0.25rem 0 0.5rem;
  color: #4f5762;
}

.chevron {
  display: inline-block;
  font-size: 1.2rem;
  line-height: 1;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.chevron.flipped {
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .hero-section {
    margin: 14px 12px 0;
    padding: 28px 18px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .content-wrapper {
    padding: 24px 14px 48px;
  }

  .toolbar {
    padding: 12px;
  }

  .toolbar-actions {
    width: 100%;
  }

  .sort-select {
    flex: 1;
    min-width: 0;
  }

  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .image_container {
    height: 220px;
  }
}

@media (max-width: 540px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
