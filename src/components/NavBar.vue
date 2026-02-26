<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { searchQuery } from '@/composables/useSearch'
import { computed } from 'vue'

const router = useRouter()

const isLoggedIn = computed(() => {
  return !!localStorage.getItem("token")
})

const handleLogout = () => {
  localStorage.removeItem("token")
  router.push({ name: 'Login' })
}
</script>

<template>
<nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
  
      <router-link to="/dashboard" class="brand-block">
        <h4 class="brand-title">UniThrift</h4>
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
  <nav class="navbar navbar-expand-lg custom-navbar shadow-sm">
    <div class="container">

      <!-- Brand -->
      <RouterLink to="/dashboard" class="navbar-brand">
        UniThrift
      </RouterLink>

      <!-- Mobile Toggle -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">

        <!-- Left Links -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/catalogue" class="nav-link">Catalogue</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/cart" class="nav-link">Cart</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/seller" class="nav-link">Seller</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/contact" class="nav-link">Contact</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/review" class="nav-link">Review</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link">About</RouterLink>
          </li>
        </ul>

        <!-- Right Section -->
        <div class="d-flex align-items-center gap-3">

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="form-control form-control-sm nav-search"
          />

          <button
            v-if="isLoggedIn"
            @click="handleLogout"
            class="btn btn-sm btn-accent"
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  </nav>
</template>

<style scoped>

/* Navbar background */
.custom-navbar {
  background-color: #000000;
  padding: 0.6rem 0;
}

/* Brand */
.navbar-brand {
  color: #d3d3d3 !important;
  font-weight: 700;
  font-size: 1.2rem;
}

.navbar-brand:hover {
  color: #ffffff !important;
}

/* Nav links */
.navbar-nav .nav-link {
  color: #cfcfcf !important;
  font-size: 0.9rem;
  padding: 6px 10px;
  transition: 0.2s ease;
}

.navbar-nav .nav-link:hover {
  color: #00faab !important;
}

/* Search input */
.nav-search {
  min-width: 180px;
  background-color: #111;
  border: 1px solid #333;
  color: #d9d9d9;
}

.nav-search::placeholder {
  color: #888;
}

.nav-search:focus {
  box-shadow: 0 0 6px rgba(0, 250, 171, 0.4);
  border-color: #00faab;
  background-color: #1a1a1a;
}

/* Logout button */
.btn-accent {
  background: linear-gradient(135deg, #00faab, #00c896);
  border: none;
  color: #111;
  font-weight: 600;
  padding: 5px 14px;
  transition: 0.2s ease;
}

.btn-accent:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(0, 250, 171, 0.6);
}

</style>