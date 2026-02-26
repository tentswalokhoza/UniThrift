<script setup>
import { ref, onMounted } from 'vue'
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
const processing = ref(false)

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  pickupPoint: 'Student Centre',
  notes: ''
})

const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return 'R0.00'
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount)
}

const fetchCart = async () => {
  if (!userId) {
    error.value = 'Please sign in to continue checkout.'
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
    error.value = 'Failed to load cart for checkout.'
  } finally {
    isLoading.value = false
  }
}

const submitCheckout = async () => {
  if (!items.value.length || !userId) return
  processing.value = true
  error.value = ''
  try {
    const res = await fetch('http://localhost:2006/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    if (!res.ok) {
      let message = 'Checkout failed.'
      try {
        const data = await res.json()
        message = data?.error || data?.message || message
      } catch {}
      throw new Error(message)
    }
    const data = await res.json()
    const orderId = data.orderId
    const totalAmount = data.totalAmount ?? totalPrice.value
    router.push({ name: 'payment', query: { orderId, amount: totalAmount } })
  } catch (err) {
    error.value = err.message || 'Checkout failed. Please try again.'
  } finally {
    processing.value = false
  }
}

onMounted(fetchCart)
</script>

<template>
  <NavBar />

  <div class="page">
    <div class="hero">
      <div class="hero-content">
        <h1>Checkout</h1>
        <p>Confirm details and place your order.</p>
      </div>
    </div>

    <div class="content">
      <div class="panel">
        <h2>Pickup Details</h2>
        <div class="form-grid">
          <input v-model="form.fullName" type="text" placeholder="Full name" />
          <input v-model="form.email" type="email" placeholder="Email address" />
          <input v-model="form.phone" type="tel" placeholder="Phone number" />
          <select v-model="form.pickupPoint">
            <option>Student Centre</option>
            <option>Main Library Steps</option>
            <option>Residence Gate 3</option>
          </select>
          <textarea v-model="form.notes" placeholder="Notes for pickup (optional)" rows="3"></textarea>
        </div>

        <div class="panel-footer">
          <button class="primary" @click="submitCheckout" :disabled="processing || !items.length">
            {{ processing ? 'Processing...' : 'Place Order' }}
          </button>
          <div class="hint">You will be redirected to payment.</div>
        </div>
        <div v-if="error" class="error">{{ error }}</div>
      </div>

      <div class="summary">
        <div class="summary-card">
          <h3>Order Summary</h3>
          <div v-if="isLoading" class="state">Loading items...</div>
          <div v-else-if="!items.length" class="state">No items to checkout.</div>
          <div v-else class="summary-items">
            <div v-for="item in items" :key="item.cart_id" class="summary-item">
              <img :src="getProductImage(item.image_url)" :alt="item.name || item.title" />
              <div>
                <div class="title">{{ item.name || item.title }}</div>
                <div class="meta">Qty: {{ item.quantity }}</div>
              </div>
              <div class="price">{{ formatCurrency(item.price * item.quantity) }}</div>
            </div>
          </div>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>{{ formatCurrency(totalPrice) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>{{ formatCurrency(totalPrice) }}</span>
          </div>
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
  padding: 60px 20px;
  text-align: center;
}

.hero h1 {
  margin: 0;
  font-size: 2.4rem;
  font-weight: 800;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.panel {
  background: #1a1a1d;
  border-radius: 16px;
  border: 1px solid rgba(0, 250, 171, 0.12);
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}

.form-grid {
  display: grid;
  gap: 14px;
}

input,
select,
textarea {
  background: #111114;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #d9d9d9;
  border-radius: 10px;
  padding: 12px;
}

.panel-footer {
  margin-top: 20px;
}

.primary {
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

.hint {
  margin-top: 10px;
  color: #8b8b8b;
  font-size: 0.85rem;
}

.summary-card {
  background: #1f1f23;
  border-radius: 16px;
  border: 1px solid rgba(0, 250, 171, 0.12);
  padding: 24px;
}

.summary-items {
  display: grid;
  gap: 12px;
  margin: 12px 0 16px;
}

.summary-item {
  display: grid;
  grid-template-columns: 50px 1fr auto;
  gap: 12px;
  align-items: center;
  background: #111114;
  border-radius: 10px;
  padding: 10px;
}

.summary-item img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #bdbdbd;
}

.summary-row.total {
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
}

.state {
  padding: 12px;
  border-radius: 10px;
  background: #111114;
  color: #8b8b8b;
}

.error {
  margin-top: 14px;
  color: #ff6b6b;
}

@media (max-width: 960px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>
