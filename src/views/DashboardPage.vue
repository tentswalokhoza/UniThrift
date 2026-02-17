<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'

const dashboardStats = ref([
  { icon: '📦', label: 'Total Orders', value: '12' },
  { icon: '💰', label: 'Total Spent', value: 'R1,245' },
  { icon: '❤️', label: 'Wishlist Items', value: '8' },
  { icon: '📍', label: 'Active Addresses', value: '2' }
])

const recentOrders = ref([
  { id: 1, product: 'Vintage Denim Jacket', status: 'Delivered', date: '2026-02-10', price: 'R350' },
  { id: 2, product: 'Blue Sneakers', status: 'Processing', date: '2026-02-15', price: 'R450' },
  { id: 3, product: 'Summer Dress', status: 'Shipped', date: '2026-02-16', price: 'R280' }
])
</script>

<template>
  <NavBar/>
  <div class="dashboard-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">My Dashboard</h1>
        <p class="hero-subtitle">Welcome back, Student!</p>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Stats Grid -->
      <div class="stats-grid">
        <div v-for="stat in dashboardStats" :key="stat.label" class="stat-card">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-info">
            <p class="stat-label">{{ stat.label }}</p>
            <p class="stat-value">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- Recent Orders Section -->
      <section class="orders-section">
        <h2 class="section-title">Recent Orders</h2>
        <div class="orders-table">
          <div class="table-header">
            <div class="table-cell">Product</div>
            <div class="table-cell">Status</div>
            <div class="table-cell">Date</div>
            <div class="table-cell">Price</div>
          </div>
          <div v-for="order in recentOrders" :key="order.id" class="table-row">
            <div class="table-cell">{{ order.product }}</div>
            <div class="table-cell">
              <span class="status-badge" :class="order.status.toLowerCase()">{{ order.status }}</span>
            </div>
            <div class="table-cell">{{ order.date }}</div>
            <div class="table-cell">{{ order.price }}</div>
          </div>
        </div>
      </section>
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
  margin: 0;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.stat-card {
  background: linear-gradient(135deg, #27272a 0%, #1f1f23 100%);
  padding: 30px 20px;
  border-radius: 12px;
  border: 1px solid rgba(0, 250, 171, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  animation: fadeIn 0.8s ease-in;
}

.stat-card:hover {
  border-color: #00faab;
  box-shadow: 0 8px 24px rgba(0, 250, 171, 0.15);
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #888;
  margin: 0;
}

.stat-value {
  font-size: 1.8rem;
  color: #00faab;
  margin: 5px 0 0 0;
  font-weight: 700;
}

.orders-section {
  animation: fadeIn 0.8s ease-in;
}

.section-title {
  font-size: 2rem;
  color: #00faab;
  margin-bottom: 30px;
  font-weight: 700;
}

.orders-table {
  border: 1px solid rgba(0, 250, 171, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background: linear-gradient(135deg, rgba(0, 250, 171, 0.1) 0%, rgba(0, 200, 150, 0.1) 100%);
  border-bottom: 2px solid rgba(0, 250, 171, 0.2);
  padding: 15px;
  font-weight: 600;
  color: #00faab;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  border-bottom: 1px solid rgba(0, 250, 171, 0.1);
  padding: 15px;
  align-items: center;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: rgba(0, 250, 171, 0.05);
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  font-size: 0.95rem;
  color: #d9d9d9;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.delivered {
  background-color: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-badge.processing {
  background-color: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-badge.shipped {
  background-color: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-section {
    padding: 50px 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
  }

  .content-wrapper {
    padding: 40px 20px;
  }
}
</style>