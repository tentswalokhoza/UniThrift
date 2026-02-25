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
  
      <router-link to="/dashboard">
      </router-link>
      <h4>UniThrift</h4>
      <a :src class="navbar-brand" href=""></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link active" aria-current="page" >Dashboard</router-link>
          </li>
          <li class="nav-item">
                <router-link to="/catalogue" class="nav-link catalogue">Catalogue</router-link>
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
     <li class="nav-item" v-if="isLoggedIn">
  <button @click="handleLogout" class="nav-link btn logout-button">
    Logout
  </button>
</li>
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="nav-search"
        />
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