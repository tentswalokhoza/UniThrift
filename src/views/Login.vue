<template>
  <div class="login-wrapper">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Welcome to UniThrift</h1>
        <p class="hero-subtitle">Sign in to your account</p>
      </div>
    </div>

    <div class="auth-container">
      <div class="auth-card">
        <h2>{{ currentViewTitle }}</h2>

        <!-- LOGIN -->
        <form v-if="currentView === 'login'" @submit.prevent="handleLogin">
          <input v-model="loginForm.email" type="email" placeholder="Email" required />
          <input v-model="loginForm.password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>

          <p class="link" @click="switchView('forgot')">Forgot Password?</p>
          <p class="link" @click="switchView('register')">Don't have an account? Register</p>
        </form>

        <!-- REGISTER -->
        <form v-if="currentView === 'register'" @submit.prevent="handleRegister">
          <input v-model="registerForm.name" type="text" placeholder="Full Name" required />
          <input v-model="registerForm.email" type="email" placeholder="Email" required />
          <input v-model="registerForm.phone_number" type="text" placeholder="Phone Number" required/>
          <input v-model="registerForm.password" type="password" placeholder="Password" required />
          <input v-model="registerForm.confirmPassword" type="password" placeholder="Confirm Password" required />
          <button type="submit">Register</button>

          <p class="link" @click="switchView('login')">Already have an account? Login</p>
        </form>

        <!-- FORGOT PASSWORD -->
        <form v-if="currentView === 'forgot'" @submit.prevent="handleForgotPassword">
          <input v-model="forgotForm.email" type="email" placeholder="Enter your email" required />
          <button type="submit">Reset Password</button>
          <p class="link" @click="switchView('login')">Back to Login</p>
        </form>

        <p class="message" v-if="message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

const currentView = ref('login')
const message = ref("")
const router  = useRouter()

// Forms
const loginForm = ref({
  email: "",
  password: ""
})

const registerForm = ref({
  name: "",
  email: "",
  phone_number: "",
  password: "",
  confirmPassword: ""
})

const forgotForm = ref({
  email: ""
})

// Computed title
const currentViewTitle = computed(() => {
  switch (currentView.value) {
    case "login":
      return "Login"
    case "register":
      return "Register"
    case "forgot":
      return "Forgot Password"
  }
})

// Switch view
const switchView = (view) => {
  message.value = ""
  currentView.value = view
}

// Handlers
const handleLogin = async () => {
  try {
    const response = await axios.post(
      "http://localhost:2006/api/auth/login",
      loginForm.value
    )
    message.value = response.data.message

    // Save token
    localStorage.setItem("token", response.data.token)

    router.push({ name: "dashboard"})

  } catch (error) {
    message.value = error.response?.data?.message || "Login failed"
  }
}

const isLoading = ref(false)
const phoneError = ref(false)

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/   // 10–15 digits only
  phoneError.value = !phoneRegex.test(phone)
}

const handleRegister = async () => {
  message.value = ""

  // Password check
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    message.value = "Passwords do not match!"
    return
  }

  // Phone validation
  validatePhone(registerForm.value.phone_number)

  if (phoneError.value) {
    message.value = "Phone number must be 10–15 digits"
    return
  }

  isLoading.value = true

  try {
    const response = await axios.post(
      "http://localhost:2006/api/auth/register",
      {
        name: registerForm.value.name,
        email: registerForm.value.email,
        phone_number: registerForm.value.phone_number,
        password: registerForm.value.password
      }
    )

    message.value = response.data.message || "Registered successfully"

    // Reset form
    registerForm.value = {
      name: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: ""
    }

    // Redirect to login
    setTimeout(() => {
      message.value = ""
      switchView("login")   // ⚠ make sure it's lowercase
    }, 2000)

  } catch (error) {
    message.value =
      error.response?.data?.message ||
      error.message ||
      "Registration failed"
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  console.log("Reset Email:", forgotForm.value.email)
  message.value = "Password reset link sent"
}
</script>

<style scoped>
/* Wrapper & Hero Section */
.login-wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: #0f0f12;
  color: #d9d9d9;
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
  margin-bottom: 10px;
}

.hero-subtitle {
  font-size: 1.2rem;
  font-weight: 500;
  opacity: 0.9;
}

/* Auth Container */
.auth-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background: #0f0f12;
}

.auth-card {
  width: 400px;
  background: #1f1f23;
  border-radius: 1rem;
  box-shadow: 0 12px 32px rgba(0, 250, 171, 0.3);
  padding: 40px 30px;
  text-align: center;
  color: #d9d9d9;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 48px rgba(0, 250, 171, 0.5);
}

.auth-card h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #00faab;
}

/* Form Inputs */
input {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 0.5rem;
  border: 1px solid #00faab;
  background: #27272a;
  color: #d9d9d9;
  font-size: 1rem;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #00c896;
  box-shadow: 0 0 8px rgba(0, 250, 171, 0.6);
}

/* Buttons */
button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  border: none;
  border-radius: 0.5rem;
  color: black;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

button:hover {
  transform: scale(1.03);
  box-shadow: 0 0 12px rgba(0, 250, 171, 0.6);
}

button:active {
  transform: scale(0.97);
}

/* Links */
.link {
  color: #00faab;
  cursor: pointer;
  margin-top: 10px;
  display: block;
  font-size: 0.875rem;
}

.link:hover {
  text-decoration: underline;
}

/* Messages */
.message {
  margin-top: 15px;
  font-weight: 600;
  color: #00faab;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    width: 100%;
    padding: 30px 20px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>