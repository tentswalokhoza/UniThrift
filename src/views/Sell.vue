<template>
  <div class="contact-container">
    <NavBar />

    <div class="content-wrapper">
      <div class="hero-section">
        <h1 class="hero-title">Sell Your Product</h1>
        <p class="hero-subtitle">Upload your product and join the marketplace</p>
      </div>

      <form class="contact-form" @submit="submitSell" enctype="multipart/form-data">
        <div class="form-group">
          <label>Product Name</label>
          <input v-model="product_name" type="text" required />
        </div>

        <div class="form-group">
          <label>Price</label>
          <input v-model="price" type="number" required />
        </div>

        <div class="form-group">
          <label>Negotiation Message</label>
          <textarea v-model="negotiation"></textarea>
        </div>

        <div class="form-group">
          <label>Product Image</label>
          <input type="file" ref="imageFile" />
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? "Submitting..." : "Submit Product" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import NavBar from "@/components/NavBar.vue";

const router = useRouter();
const product_name = ref("");
const price = ref("");
const negotiation = ref("");
const loading = ref(false);
const imageFile = ref(null);

const submitSell = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) return alert("You must be logged in to sell.");

  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("product_name", product_name.value.trim());
    formData.append("price", price.value);
    formData.append("negotiation", negotiation.value.trim());
    if (imageFile.value?.files[0]) formData.append("image", imageFile.value.files[0]);

    const res = await fetch("http://localhost:2006/api/user_product/create", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    product_name.value = "";
    price.value = "";
    negotiation.value = "";
    if (imageFile.value) imageFile.value.value = "";

    alert("Product submitted successfully!");
    router.push("/s2s");
  } catch (err) {
    alert(err.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.contact-container {
  width: 100%;
  background-color: #0f0f12;
  color: #d9d9d9;
}

.hero-section {
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  padding: 80px 20px;
  text-align: center;
  color: black;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.hero-subtitle {
  font-size: 1.2rem;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.contact-info h2 {
  font-size: 2rem;
  color: #00faab;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #00faab;
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  background-color: #18181b;
  border: 1px solid rgba(0, 250, 171, 0.2);
  border-radius: 8px;
  color: #d9d9d9;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #00faab;
  box-shadow: 0 0 12px rgba(0, 250, 171, 0.2);
}

.submit-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  color: black;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 250, 171, 0.3);
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>