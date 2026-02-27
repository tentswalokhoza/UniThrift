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
              <li class="nav-item" v-if="isLoggedIn">
  <button @click="handleLogout" class="nav-link btn btn-link">
    Logout
  </button>
</li>
                  <router-link to="/s2s">S2S</router-link>

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
.custom-navbar {
  background: rgba(8, 8, 10, 0.94);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.62rem 0;
}

.custom-navbar :deep(.container) {
  max-width: 1280px;
  padding-left: 1.2rem;
  padding-right: 1.2rem;
}

.navbar-brand {
  color: #00faab !important;
  font-weight: 800;
  font-size: 1.32rem;
  letter-spacing: 0.02em;
  margin-right: 1rem;
}

.navbar-brand:hover {
  color: #26ffd1 !important;
}

.navbar-nav {
  gap: 0.1rem;
}

.navbar-nav .nav-link {
  position: relative;
  color: #cfd5de !important;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 0;
  background: transparent !important;
  transition: color 0.2s ease;
}

.navbar-nav .nav-link::after {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 2px;
  height: 2px;
  background: #00faab;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.2s ease;
}

.navbar-nav .nav-link:hover,
.navbar-nav .router-link-active {
  color: #f4fffc !important;
  background: transparent !important;
}

.navbar-nav .nav-link:hover::after,
.navbar-nav .router-link-active::after {
  transform: scaleX(1);
}

.nav-search {
  min-width: 210px;
  background-color: #111317;
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e3e8ef;
  border-radius: 10px;
}

.nav-search::placeholder {
  color: #8d96a3;
}

.nav-search:focus {
  box-shadow: 0 0 0 3px rgba(0, 250, 171, 0.16);
  border-color: #00faab;
  background-color: #161b21;
}

.btn-accent {
  background: linear-gradient(135deg, #00faab, #00c896);
  border: none;
  color: #071916;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-accent:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(0, 250, 171, 0.28);
}

@media (max-width: 991px) {
  .navbar-nav {
    margin-top: 0.45rem;
    margin-bottom: 0.45rem;
  }

  .nav-search {
    min-width: 100%;
  }
}
</style>
