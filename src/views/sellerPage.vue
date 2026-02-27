<script setup>
import { ref } from "vue";
import NavBar from "@/components/NavBar.vue";

const sellerStats = ref([
  { icon: '📊', label: 'Total Sales', value: 'R5,420' },
  { icon: '📦', label: 'Products Listed', value: '24' },
  { icon: '⭐', label: 'Average Rating', value: '4.8' },
  { icon: '👁️', label: 'Total Views', value: '1,240' }
])

const sellerProducts = ref([
  { id: 1, name: 'Vintage Jacket', status: 'Active', sales: 12, price: 'R350' },
  { id: 2, name: 'Designer Shoes', status: 'Active', sales: 8, price: 'R450' },
  { id: 3, name: 'Summer Collection', status: 'Pending', sales: 0, price: 'R285' }
])
</script>

<template>
<NavBar/>
<div class="seller-container">
  <div class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">Seller Dashboard</h1>
      <p class="hero-subtitle">Manage Your Fashion Store</p>
    </div>
  </div>

  <div class="content-wrapper">
    <!-- Stats Grid -->
    <div class="stats-grid">
      <div v-for="stat in sellerStats" :key="stat.label" class="stat-card">
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-info">
          <p class="stat-label">{{ stat.label }}</p>
          <p class="stat-value">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <section class="products-section">
      <div class="section-header">
        <h2 class="section-title">Your Products</h2>
        <RouterLink to="/sell" class="add-product-btn"> + Sell New Old Product</RouterLink></div>

      <div class="products-table">
        <div class="table-header">
          <div class="table-cell">Product Name</div>
          <div class="table-cell">Status</div>
          <div class="table-cell">Sales</div>
          <div class="table-cell">Price</div>
          <div class="table-cell">Actions</div>
        </div>
        <div v-for="product in sellerProducts" :key="product.id" class="table-row">
          <div class="table-cell">{{ product.name }}</div>
          <div class="table-cell">
            <span class="status-badge" :class="product.status.toLowerCase()">{{ product.status }}</span>
          </div>
          <div class="table-cell">{{ product.sales }}</div>
          <div class="table-cell">{{ product.price }}</div>
          <div class="table-cell">
            <button class="action-btn edit">Edit</button>
            <button class="action-btn delete">Delete</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</div>
</template>

<style scoped>
.seller-container {
  width: 100%;
  background-color: #0f0f12;
  color: #d9d9d9;
}

.hero-section {
  max-width: 1220px;
  margin: 20px auto 0;
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 48%),
    linear-gradient(125deg, #00faab 0%, #00c896 56%, #009e8f 100%);
  color: #041311;
  padding: 36px 28px;
  border: 1px solid rgba(0, 250, 171, 0.24);
}

.hero-content {
  text-align: center;
}

.hero-title {
  font-size: 2.45rem;
  font-weight: 900;
  margin: 0;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: rgba(4, 19, 17, 0.8);
}

.content-wrapper {
  max-width: 1180px;
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
  background: linear-gradient(160deg, #1b1f26, #151821);
  padding: 30px 20px;
  border-radius: 14px;
  border: 1px solid rgba(0, 250, 171, 0.16);
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

.products-section {
  animation: fadeIn 0.8s ease-in;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 2rem;
  color: #00faab;
  margin: 0;
  font-weight: 700;
}

.add-product-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  color: black;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-product-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 250, 171, 0.3);
}

.products-table {
  background: linear-gradient(160deg, #1b1f26, #14161c);
  border: 1px solid rgba(0, 250, 171, 0.2);
  border-radius: 14px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.32);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  background: linear-gradient(135deg, rgba(0, 250, 171, 0.15) 0%, rgba(0, 200, 150, 0.12) 100%);
  border-bottom: 2px solid rgba(0, 250, 171, 0.2);
  padding: 15px;
  font-weight: 600;
  color: #00faab;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  border-bottom: 1px solid rgba(0, 250, 171, 0.1);
  padding: 15px;
  align-items: center;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: rgba(0, 250, 171, 0.08);
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

.status-badge.active {
  background-color: rgba(19, 86, 55, 0.9);
  color: #e8fff2;
  border: 1px solid rgba(34, 197, 94, 0.45);
}

.status-badge.pending {
  background-color: rgba(119, 61, 12, 0.9);
  color: #ffeedc;
  border: 1px solid rgba(251, 146, 60, 0.42);
}

.action-btn {
  padding: 6px 12px;
  margin: 0 4px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.edit {
  background-color: rgba(0, 250, 171, 0.2);
  color: #00faab;
  border: 1px solid rgba(0, 250, 171, 0.3);
}

.action-btn.edit:hover {
  background-color: rgba(0, 250, 171, 0.3);
  border-color: #00faab;
}

.action-btn.delete {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.action-btn.delete:hover {
  background-color: rgba(239, 68, 68, 0.3);
  border-color: #ef4444;
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

  .section-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
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
