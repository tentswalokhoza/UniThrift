<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>{{ currentViewTitle }}</h2>

      <!-- LOGIN -->
      <form v-if="currentView === 'login'" @submit.prevent="handleLogin">
        <input v-model="loginForm.email" type="email" placeholder="Email" required />
        <input v-model="loginForm.password" type="password" placeholder="Password" required />

        <button type="submit">Login</button>

        <p class="link" @click="switchView('forgot')">Forgot Password?</p>
        <p class="link" @click="switchView('register')">
          Don't have an account? Register
        </p>
      </form>

      <!-- REGISTER -->
      <form v-if="currentView === 'register'" @submit.prevent="handleRegister">
        <input v-model="registerForm.name" type="text" placeholder="Full Name" required />
        <input v-model="registerForm.email" type="email" placeholder="Email" required />
        <input v-model="registerForm.phone_number" type="text" placeholder="Phone Number" required/>
        <input v-model="registerForm.password" type="password" placeholder="Password" required />
        <input v-model="registerForm.confirmPassword" type="password" placeholder="Confirm Password" required />

        <button type="submit">Register</button>

        <p class="link" @click="switchView('login')">
          Already have an account? Login
        </p>
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
.auth-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f9;
}

.auth-card {
  width: 350px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  background: #42b883;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background: #369870;
}

.link {
  text-align: center;
  color: #42b883;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
}

.link:hover {
  text-decoration: underline;
}

.message {
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
}
</style>
