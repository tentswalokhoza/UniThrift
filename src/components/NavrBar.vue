<script setup>
import { RouterLink } from 'vue-router';
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
                <router-link to="/products" class="nav-link products" > Caatalogue</router-link>
          </li>
          <li class="nav-item">
              <router-link to="/payroll" class="nav-link attendance payroll" >?</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/employee" class="nav-link attendance employee" >?</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/leave" class="nav-link leave">?</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/application" class="nav-link application">?</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<style scoped>
li{
  margin:0% 10% 0;
}
</style>