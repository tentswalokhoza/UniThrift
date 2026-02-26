<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useSession } from '@/composables/useSession'
import { getProductImage } from '@/composables/useProductImages'

const router = useRouter()
const { userId } = useSession()

const items = ref([])
const totalPrice = ref(0)
const isLoading = ref(false)
const error = ref('')

const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return 'R0.00'
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount)
}

const fetchCart = async () => {
  if (!userId) {
    error.value = 'Please sign in to view your cart.'
    return
  }
  isLoading.value = true
  error.value = ''
  try {
    const res = await fetch(`http://localhost:2006/cart/${userId}`)
    if (!res.ok) throw new Error(res.statusText)
    const data = await res.json()
    items.value = data.items || []
    totalPrice.value = data.totalPrice || 0
  } catch (err) {
    error.value = 'Failed to load your cart.'
  } finally {
    isLoading.value = false
  }
}

const removeItem = async (cartId) => {
  if (!userId) return
  try {
    const res = await fetch(`http://localhost:2006/cart/${cartId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    if (!res.ok) throw new Error(res.statusText)
    const data = await res.json()
    items.value = data.cart || []
    totalPrice.value = data.totalPrice || 0
  } catch {
    error.value = 'Failed to remove item.'
  }
}

const clearCart = async () => {
  if (!userId) return
  try {
    const res = await fetch(`http://localhost:2006/cart-clear/${userId}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(res.statusText)
    items.value = []
    totalPrice.value = 0
  } catch {
    error.value = 'Failed to clear cart.'
  }
}

const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

const proceedToCheckout = () => {
  if (!items.value.length) return
  router.push({ name: 'checkout' })
}

onMounted(fetchCart)
</script>

<template>
  <NavBar />

  <div class="page">
    <div class="hero">
      <div class="hero-content">
        <h1>Your Cart</h1>
        <p>Review your picks before checkout.</p>
      </div>
    </div>

    <div class="content">
      <div class="panel">
        <div class="panel-header">
          <h2>Cart Items</h2>
          <div class="muted">{{ itemCount }} items</div>
        </div>

        <div v-if="isLoading" class="state">Loading your cart...</div>
        <div v-else-if="error" class="state error">{{ error }}</div>
        <div v-else-if="!items.length" class="state">Your cart is empty.</div>

        <div v-else class="items">
          <div v-for="item in items" :key="item.cart_id" class="item">
            <img :src="getProductImage(item.image_url)" :alt="item.name || item.title" />
            <div class="info">
              <div class="title">{{ item.name || item.title }}</div>
              <div class="meta">
                <span>Qty: {{ item.quantity }}</span>
                <span>{{ formatCurrency(item.price) }}</span>
              </div>
            </div>
            <div class="price">
              {{ formatCurrency(item.price * item.quantity) }}
            </div>
            <button class="ghost" @click="removeItem(item.cart_id)">Remove</button>
          </div>
        </div>
      </div>

      <div class="summary">
        <div class="summary-card">
          <h3>Order Summary</h3>
          <div class="summary-row">
            <span>Items</span>
            <span>{{ itemCount }}</span>
          </div>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>{{ formatCurrency(totalPrice) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>{{ formatCurrency(totalPrice) }}</span>
          </div>
          <button class="primary" @click="proceedToCheckout" :disabled="!items.length">
            Proceed to Checkout
          </button>
          <button class="ghost full" @click="clearCart" :disabled="!items.length">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #0f0f12;
  color: #d9d9d9;
}

.hero {
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  color: #0f0f12;
  padding: 64px 20px;
  text-align: center;
}

.hero h1 {
  margin: 0;
  font-size: 2.6rem;
  font-weight: 800;
}

.hero p {
  margin-top: 8px;
  font-weight: 500;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  display: grid;
  grid-template-columns: 2.2fr 1fr;
  gap: 24px;
}

.panel {
  background: #1a1a1d;
  border-radius: 16px;
  border: 1px solid rgba(0, 250, 171, 0.12);
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}

.panel-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item {
  display: grid;
  grid-template-columns: 90px 1fr auto auto;
  gap: 16px;
  align-items: center;
  background: #111114;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 12px;
}

.item img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 10px;
}

.info .title {
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
}

.meta {
  display: flex;
  gap: 12px;
  color: #8b8b8b;
  font-size: 0.85rem;
  margin-top: 6px;
}

.price {
  font-weight: 700;
  color: #00faab;
}

.summary {
  position: sticky;
  top: 24px;
  height: fit-content;
}

.summary-card {
  background: #1f1f23;
  border-radius: 16px;
  border: 1px solid rgba(0, 250, 171, 0.12);
  padding: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  color: #bdbdbd;
}

.summary-row.total {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
}

.primary {
  margin-top: 18px;
  width: 100%;
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  color: #0f0f12;
  border: none;
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 250, 171, 0.35);
}

.ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #d9d9d9;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.ghost.full {
  width: 100%;
  margin-top: 12px;
}

.state {
  padding: 18px;
  background: #111114;
  border-radius: 12px;
  color: #a5a5a5;
  border: 1px dashed rgba(255, 255, 255, 0.12);
}

.state.error {
  color: #ff6b6b;
  border-color: rgba(255, 107, 107, 0.3);
}

.muted {
  color: #8b8b8b;
}

@media (max-width: 960px) {
  .content {
    grid-template-columns: 1fr;
  }

  .summary {
    position: static;
  }

  .item {
    grid-template-columns: 70px 1fr;
  }
}
</style>
