<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { searchQuery } from '@/composables/useSearch';
import { getProductImage } from '@/composables/useProductImages'
import { useSession } from '@/composables/useSession'

const products = ref([])
const route = useRoute()
const { userId } = useSession()
const cartNotice = ref('')
const addedMap = ref({})

const filteredProducts = computed(() => {
  let list = products.value

  const cat = (route.query.category || '').toString().trim()
  if (cat) {
    const catLower = cat.toLowerCase()
    list = list.filter(p => (p.category || '').toLowerCase() === catLower)
  }

  if (!searchQuery.value) return list
  const q = searchQuery.value.toLowerCase()
  return list.filter(p => 
    p.title.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q) ||
    p.category?.toLowerCase().includes(q)
  )
})

// Expand/collapse state
const expandedCards = ref(new Set())

const toggleCard = (id) => {
  if (expandedCards.value.has(id)) {
    expandedCards.value.delete(id)
  } else {
    expandedCards.value.add(id)
  }
  expandedCards.value = new Set(expandedCards.value)
}

const isExpanded = (id) => expandedCards.value.has(id)

const getImage = (fileNameOrUrl) => getProductImage(fileNameOrUrl)

const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return 'R0.00'
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount)
}

const addToCart = async (product) => {
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
    const data = await res.json()
    products.value = data
  } catch (err) {
    console.error('Failed to fetch product catalogue from SQL ', err)
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

    <div class="content-wrapper">
      <div class="products-row">
        <div
          v-for="product in filteredProducts"
          :key="product.product_id"
          class="product-card"
        >
          <div
            class="card"
            :class="{ expanded: isExpanded(product.product_id) }"
            @click="toggleCard(product.product_id)"
          >
            <!-- Product Image -->
            <div class="image_container">
               <img
                :src="getImage(product.image_url || product.image)"
                :alt="`Photo of ${product.title}`"
              />
            </div>

            <!-- Always visible: title + price -->
            <div class="card-minimal">
              <div class="title">{{ product.title }}</div>
              <div class="price">{{ formatCurrency(product.price) }}</div>
            </div>

            <!-- Expanded details -->
            <div class="card-details-wrapper" :class="{ visible: isExpanded(product.product_id) }">
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
                    <span class="detail-value">{{ product.quantity }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span class="detail-value" :class="`status-${product.status}`">{{ product.status }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Listed</span>
                    <span class="detail-value">{{ product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A' }}</span>
                  </div>
                </div>

                <div v-if="product.description" class="description">
                  {{ product.description }}
                </div>

                <div class="action" @click.stop>
                  <button class="cart-button" @click.stop="addToCart(product)">
                    <svg
                      class="cart-icon"
                      stroke="currentColor"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                      />
                    </svg>
                    <span>{{ addedMap[product.product_id] ? 'Added' : 'Add to cart' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Expand chevron -->
            <div class="expand-hint">
              <span class="chevron" :class="{ flipped: isExpanded(product.product_id) }">&#8964;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalogue-container {
  width: 100%;
  background-color: #0f0f12;
  color: #d9d9d9;
}

.toast {
  position: fixed;
  top: 90px;
  right: 24px;
  z-index: 50;
  background: rgba(0, 250, 171, 0.12);
  color: #00faab;
  border: 1px solid rgba(0, 250, 171, 0.4);
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 600;
  backdrop-filter: blur(6px);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  padding: 80px 20px;
  text-align: center;
  color: black;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
}

/* Content Wrapper */
.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
}

/* Products Grid */
.products-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem;
  animation: fadeIn 0.6s ease-in;
}

.product-card {
  flex: 0 1 320px;
}

/* Card */
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 320px;
  background-color: #1a1a1d;
  border-radius: 0.85rem;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(0, 250, 171, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 36px rgba(0, 250, 171, 0.18);
  border-color: rgba(0, 250, 171, 0.35);
}

/* Image */
.image_container {
  width: 100%;
  height: 22rem;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.image_container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s ease;
}

.card:hover .image_container img {
  transform: scale(1.06);
}

/* Minimal info - always visible */
.card-minimal {
  padding: 0.85rem 1rem 0.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.card-minimal .title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #e8e8e8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-minimal .price {
  font-size: 0.95rem;
  font-weight: 500;
  color: #b0b0b0;
}

/* Expand/collapse slide using grid trick */
.card-details-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-details-wrapper.visible {
  grid-template-rows: 1fr;
}

.card-details-inner {
  overflow: hidden;
  padding: 0 1rem;
  transition: padding 0.4s ease;
}

.card-details-wrapper.visible .card-details-inner {
  padding: 0.25rem 1rem 1rem;
}

/* Details grid */
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;
  margin-bottom: 0.75rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.detail-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #555;
  font-weight: 600;
}

.detail-value {
  font-size: 0.82rem;
  color: #c0c0c0;
  font-weight: 500;
}

.category-tag {
  color: #00faab;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.description {
  font-size: 0.82rem;
  color: #888;
  line-height: 1.5;
  margin-bottom: 0.85rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

/* Status colours */
.status-available {
  color: #00faab;
  font-weight: 600;
}

.status-sold {
  color: #ff4d4f;
  font-weight: 600;
}

.status-removed {
  color: #666;
  font-weight: 600;
}

/* Cart button */
.action {
  margin-top: 0.25rem;
}

.cart-button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem;
  width: 100%;
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  font-size: 0.78rem;
  font-weight: 600;
  color: black;
  border: none;
  border-radius: 0.5rem;
  transition: all 0.25s ease;
  box-shadow: 0 2px 10px rgba(0, 250, 171, 0.25);
}

.cart-button:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 18px rgba(0, 250, 171, 0.45);
}

.cart-button:active {
  transform: scale(0.97);
}

.cart-icon {
  width: 1rem;
  flex-shrink: 0;
}

/* Chevron expand hint */
.expand-hint {
  text-align: center;
  padding: 0.3rem 0 0.45rem;
  color: #444;
  transition: color 0.2s ease;
}

.card:hover .expand-hint {
  color: #00faab;
}

.chevron {
  display: inline-block;
  font-size: 1.2rem;
  line-height: 1;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease;
}

.chevron.flipped {
  transform: rotate(180deg);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title    { font-size: 2rem; }
  .hero-subtitle { font-size: 1rem; }
  .hero-section  { padding: 50px 20px; }
  .content-wrapper { padding: 40px 20px; }
  .card { width: 100%; }
  .product-card { flex: 0 1 100%; }
}
</style>
