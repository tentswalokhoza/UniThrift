<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { getProductImage } from '@/composables/useProductImages'

const route = useRoute()
const router = useRouter()

const orderId = route.query.orderId
const transactionId = route.query.transactionId

const order = ref(null)
const items = ref([])
const isLoading = ref(false)
const error = ref('')

const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return 'R0.00'
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount)
}

const fetchOrder = async () => {
  if (!orderId) {
    error.value = 'Missing order details.'
    return
  }
  isLoading.value = true
  error.value = ''
  try {
    const res = await fetch(`http://localhost:2006/orders/${orderId}`)
    if (!res.ok) throw new Error(res.statusText)
    const data = await res.json()
    order.value = data.order
    items.value = data.items || []
  } catch (err) {
    error.value = 'Failed to load order details.'
  } finally {
    isLoading.value = false
  }
}

const backToShop = () => {
  router.push({ name: 'catalogue' })
}

onMounted(fetchOrder)
</script>

<template>
  <NavBar />

  <div class="page">
    <div class="hero">
      <h1>Order Confirmed</h1>
      <p>Thanks for shopping with UniThrift.</p>
    </div>

    <div class="content">
      <div class="panel">
        <div v-if="isLoading" class="state">Loading confirmation...</div>
        <div v-else-if="error" class="state error">{{ error }}</div>
        <div v-else class="details">
          <div class="summary">
            <div>
              <h2>Order #{{ order?.id || orderId }}</h2>
              <p class="muted">Transaction: {{ transactionId || 'Pending' }}</p>
            </div>
            <div class="badge">Confirmed</div>
          </div>

          <div class="items">
            <div v-for="item in items" :key="item.id" class="item">
              <img :src="getProductImage(item.image_url)" :alt="item.name" />
              <div>
                <div class="title">{{ item.name }}</div>
                <div class="meta">Qty: {{ item.quantity }}</div>
              </div>
              <div class="price">{{ formatCurrency(item.price * item.quantity) }}</div>
            </div>
          </div>

          <div class="total-row">
            <span>Total Paid</span>
            <span>{{ formatCurrency(order?.total_amount) }}</span>
          </div>

          <button class="primary" @click="backToShop">Continue Shopping</button>
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
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px 80px;
}

.panel {
  background: #1a1a1d;
  border-radius: 16px;
  border: 1px solid rgba(0, 250, 171, 0.12);
  padding: 28px;
}

.summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.badge {
  background: rgba(0, 250, 171, 0.15);
  color: #00faab;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 700;
}

.items {
  display: grid;
  gap: 12px;
  margin-bottom: 18px;
}

.item {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 12px;
  align-items: center;
  background: #111114;
  border-radius: 10px;
  padding: 10px;
}

.item img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.title {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.meta {
  color: #8b8b8b;
  font-size: 0.85rem;
}

.price {
  font-weight: 700;
  color: #00faab;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 18px 0;
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

.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 250, 171, 0.35);
}

.state {
  padding: 12px;
  border-radius: 10px;
  background: #111114;
  color: #8b8b8b;
}

.state.error {
  color: #ff6b6b;
  border-color: rgba(255, 107, 107, 0.3);
}

.muted {
  color: #8b8b8b;
}
</style>
