<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { computed } from 'vue'

const router = useRouter()

// Check if admin is logged in
const isLoggedIn = computed(() => {
  const token = localStorage.getItem("token")
  const authority = localStorage.getItem("authority") // assuming you store authority in localStorage
  return token && authority === 'admin'
})

// Logout function
const handleLogout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("authority")
  router.push({ name: 'Login' })
}
</script>

<template>
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">

    <router-link to="/admin/dashboard">
      <h4>UniThrift Admin</h4>
    </router-link>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar" aria-controls="adminNavbar" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="adminNavbar">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link to="/admin/dashboard" class="nav-link active">Dashboard</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/users" class="nav-link">Users</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/products" class="nav-link">Products</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/orders" class="nav-link">Orders</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/tickets" class="nav-link">Tickets</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/contact" class="nav-link">Contact</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/reviews" class="nav-link">Reviews</router-link>
        </li>
      </ul>

      <li class="nav-item" v-if="isLoggedIn">
        <button @click="handleLogout" class="nav-link btn logout-button">
          Logout
        </button>
      </li>
    </div>
  </div>
</nav>
</template>

<style scoped>
li{
  margin:0% 10% 0;
}

.navbar-nav .nav-item,
.navbar .nav-item {
  list-style: none;
}


.logout-button {
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  border: none;
  color: #0f0f12; 
  font-weight: 600;
  padding: 6px 14px;
  position: relative;
  right: -120px; 
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.logout-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(0, 250, 171, 0.6);
}

.logout-button:active {
  transform: scale(0.97);
}
</style>