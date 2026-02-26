<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { searchQuery } from '@/composables/useSearch';
import { computed } from 'vue'

const router = useRouter()

// Check if user is logged in
const isLoggedIn = computed(() => {
  return !!localStorage.getItem("token")
})

// Logout function
const handleLogout = () => {
  localStorage.removeItem("token")   // remove token
  router.push({ name: 'Login' })     // redirect to login page
}

</script>

<template>
<nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
  
      <router-link to="/dashboard" class="brand-block">
        <h4 class="brand-title">UniThrift</h4>
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link active" aria-current="page" >Dashboard</router-link>
          </li>
          <li class="nav-item">
                <router-link to="/catalogue" class="nav-link catalogue">Catalogue</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/cart" class="nav-link cart">Cart</router-link>
          </li>
          <li class="nav-item">
              <router-link to="/seller" class="nav-link sellerReview" >Seller </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact" class="nav-link contact" >Contact</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/review" class="nav-link review">Review</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link about">About</router-link>
          </li>
          
        </ul>
        <div class="nav-actions">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="nav-search"
          />
          <button v-if="isLoggedIn" @click="handleLogout" class="nav-link btn logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.navbar-nav .nav-item,
.navbar .nav-item {
  list-style: none;
}

.brand-block {
  display: inline-flex;
  align-items: center;
  margin-right: 48px;
}

.brand-title {
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.navbar-collapse {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.navbar-nav {
  flex: 1;
  justify-content: space-between;
  width: 100%;
}

.navbar-nav .nav-item {
  flex: 1 1 auto;
  text-align: center;
}

.nav-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.nav-search {
  padding: 8px 12px;
  border: 1px solid #00faab;
  border-radius: 0.5rem;
  background-color: #1a1a1a;
  color: #d9d9d9;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
  min-width: 200px;
}

.nav-search::placeholder {
  color: #888;
}

.nav-search:focus {
  border-color: #00faab;
  box-shadow: 0 0 8px rgba(0, 250, 171, 0.3);
  background-color: #222;
}


.logout-button {
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  border: none;
  color: #0f0f12; 
  font-weight: 600;
  padding: 6px 14px;
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
