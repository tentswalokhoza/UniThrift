<script setup>

import { useRouter } from 'vue-router'


const router =useRouter()

function handleSubmit() {
  router.push('/dashboard')
}

</script>

<template>

<div class="login-wrapper">
  <div class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">Welcome to UniThrift</h1>
      <p class="hero-subtitle">Sign in to your account</p>
    </div>
  </div>

  <div class="login-container">
    <form class="form" @submit.prevent="handleSubmit">
      <h2 class="form-heading">Sign In</h2>
      
      <div class="input-field">
        <input
          required=""
          autocomplete="off"
          type="text"
          name="text"
          id="username"
        />
        <label for="username">Full Name</label>
      </div>
      
      <div class="input-field">
        <input
          required=""
          autocomplete="off"
          type="email"
          name="email"
          id="email"
        />
        <label for="email">Email</label>
      </div>
      
      <div class="input-field">
        <input
          required=""
          autocomplete="off"
          type="password"
          name="text"
          id="password"
        />
        <label for="password">Password</label>
      </div>

      <div class="btn-container">
        <button class="btn">Sign In</button>
        <div class="acc-text">
          New here ?
          <span style="color : #00faab; cursor : pointer;">Create Account</span>
        </div>
      </div>

    </form>
  </div>
</div>

</template>

<style scoped>

.login-wrapper {
  width: 100%;
  background-color: #0f0f12;
  color: #d9d9d9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 60px 20px;
}

.form {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: linear-gradient(135deg, #27272a 0%, #1f1f23 100%);
  padding: 40px;
  border-radius: 12px;
  border: 1px solid rgba(0, 250, 171, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.6s ease-in;
}

.form-heading {
  font-size: 1.8rem;
  margin: 0 0 10px 0;
  color: #00faab;
  font-weight: 700;
  text-align: center;
}

.form .btn-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
}

.form .btn {
  padding: 12px 30px;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  color: black;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 250, 171, 0.2);
  width: 100%;
  cursor: pointer;
}

.form .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 250, 171, 0.3);
}

.form .btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 250, 171, 0.2);
}

.input-field {
  position: relative;
  display: flex;
  flex-direction: column;
}

.input-field label {
  position: absolute;
  color: #888;
  pointer-events: none;
  background-color: transparent;
  left: 16px;
  top: 12px;
  transform: translateY(0);
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.input-field input {
  padding: 12px 16px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 250, 171, 0.2);
  background-color: #18181b;
  color: #d9d9d9;
  letter-spacing: 0.5px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.input-field input:focus,
.input-field input:valid {
  outline: none;
  border: 1px solid #00faab;
  box-shadow: 0 0 12px rgba(0, 250, 171, 0.2);
}

.input-field input:focus ~ label,
.input-field input:valid ~ label {
  transform: translateY(-24px) translateX(-8px) scale(0.85);
  background-color: #0f0f12;
  padding: 0px 6px;
  color: #00faab;
  font-weight: 600;
}

.form .passicon {
  cursor: pointer;
  font-size: 1.3rem;
  position: absolute;
  top: 10px;
  right: 12px;
}

.form .close {
  display: none;
}

.acc-text {
  text-align: center;
  color: #888;
  font-size: 0.95rem;
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

  .login-container {
    padding: 40px 20px;
  }

  .form {
    padding: 30px 20px;
  }
}

</style>

