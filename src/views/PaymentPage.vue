<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()

const orderId = computed(() => route.query.orderId)
const amount = computed(() => Number(route.query.amount || 0))

const paymentMethod = ref('card')
const card = ref({
  name: '',
  number: '',
  expiry: '',
  cvc: ''
})
const processing = ref(false)
const error = ref('')

const formatCurrency = (value) => {
  if (!value || isNaN(value)) return 'R0.00'
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value)
}

const submitPayment = async () => {
  if (!orderId.value) {
    error.value = 'Missing order details.'
    return
  }

  processing.value = true
  error.value = ''
  try {
    const res = await fetch('http://localhost:2006/payment/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: Number(orderId.value),
        amount: amount.value,
        method: paymentMethod.value
      })
    })
    if (!res.ok) throw new Error(res.statusText)
    const data = await res.json()
    router.push({
      name: 'confirmation',
      query: { orderId: orderId.value, transactionId: data.transactionId }
    })
  } catch (err) {
    error.value = 'Payment failed. Please try again.'
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <NavBar />

  <div class="page">
    <div class="hero">
      <p class="eyebrow">Secure Checkout</p>
      <h1>Payment</h1>
      <p>Complete your purchase securely.</p>
    </div>

    <div class="content">
      <div class="panel">
        <h2>Payment Method</h2>
        <div class="methods">
          <button :class="['method', paymentMethod === 'card' && 'active']" @click="paymentMethod = 'card'">
            Card
          </button>
          <button :class="['method', paymentMethod === 'paypal' && 'active']" @click="paymentMethod = 'paypal'">
            PayPal
          </button>
          <button :class="['method', paymentMethod === 'cash' && 'active']" @click="paymentMethod = 'cash'">
            Cash
          </button>
        </div>

        <div v-if="paymentMethod === 'card'" class="card-form">
          <input v-model="card.name" type="text" placeholder="Name on card" />
          <input v-model="card.number" type="text" placeholder="Card number" />
          <div class="row">
            <input v-model="card.expiry" type="text" placeholder="MM/YY" />
            <input v-model="card.cvc" type="text" placeholder="CVC" />
          </div>
        </div>

        <div v-else class="alt-info">
          <p v-if="paymentMethod === 'paypal'">You will be redirected to PayPal after confirmation.</p>
          <p v-else>Pay in cash when you collect your order.</p>
        </div>

        <button class="primary" @click="submitPayment" :disabled="processing">
          {{ processing ? 'Processing...' : `Pay ${formatCurrency(amount)}` }}
        </button>
        <div v-if="error" class="error">{{ error }}</div>
      </div>

      <div class="summary">
        <div class="summary-card">
          <h3>Order Total</h3>
          <div class="total">{{ formatCurrency(amount) }}</div>
          <div class="meta">Order ID: {{ orderId || 'N/A' }}</div>
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
  max-width: 1220px;
  margin: 20px auto 0;
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 48%),
    linear-gradient(125deg, #00faab 0%, #00c896 56%, #009e8f 100%);
  color: #041311;
  padding: 34px 28px;
  border: 1px solid rgba(0, 250, 171, 0.24);
  text-align: center;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.7rem;
  font-weight: 800;
  opacity: 0.9;
}

.hero h1 {
  margin: 0;
  font-size: 2.35rem;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.hero p {
  color: rgba(4, 19, 17, 0.8);
  font-weight: 600;
}

.content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.panel {
  background: linear-gradient(160deg, #1c1f26, #14161c);
  border-radius: 18px;
  border: 1px solid rgba(0, 250, 171, 0.18);
  padding: 24px;
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.36);
}

.methods {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}

.method {
  flex: 1;
  background: #111114;
  color: #d9d9d9;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
}

.method.active {
  border-color: #00faab;
  color: #00faab;
}

.card-form {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

input {
  background: #111114;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #d9d9d9;
  border-radius: 10px;
  padding: 12px;
}

.alt-info {
  margin: 16px 0;
  color: #8b8b8b;
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

.error {
  margin-top: 14px;
  color: #ff6b6b;
}

.summary-card {
  background: linear-gradient(160deg, #1b1f26, #151821);
  border-radius: 18px;
  border: 1px solid rgba(0, 250, 171, 0.2);
  padding: 24px;
  text-align: center;
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.34);
}

.total {
  font-size: 2rem;
  font-weight: 800;
  color: #00faab;
  margin: 16px 0;
}

.meta {
  color: #8b8b8b;
  font-size: 0.9rem;
}

@media (max-width: 960px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>
