<template>
  <div class="container">
    <div v-for="product in products" :key="product.id" class="card">
      <img v-if="product.image_url" :src="product.image_url" class="product-img" />
      <h3>{{ product.product_name }}</h3>
      <p><strong>Price:</strong> R{{ product.price }}</p>
      <pre class="negotiation">{{ product.negotiation }}</pre>

      <div class="negotiation-input">
        <input v-model="messages[product.id]" placeholder="Join negotiation..." />
        <button @click="sendMessage(product.id)">Send</button>
      </div>

      <button
        v-if="Number(product.user_id) === Number(userId)"
        @click="deleteProduct(product.id)"
        class="delete-btn"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const products = ref([]);
const messages = ref({});
const userId = localStorage.getItem("user_id");
let intervalId = null;

const fetchProducts = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:2006/api/user_product/my-products", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    products.value = data;
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");
  await fetch(`http://localhost:2006/api/user_product/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  fetchProducts();
};

const sendMessage = async (id) => {
  const token = localStorage.getItem("token");
  if (!messages.value[id]) return;

  const res = await fetch(`http://localhost:2006/api/user_product/negotiate/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message: messages.value[id] })
  });

  const updated = await res.json();
  const index = products.value.findIndex(p => p.id === id);
  products.value[index] = updated;
  messages.value[id] = "";
};

onMounted(() => {
  fetchProducts();
  intervalId = setInterval(fetchProducts, 3000);
});

onUnmounted(() => clearInterval(intervalId));
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 40px;
  background-color: #556378;
}

.card {
  background: linear-gradient(145deg, #1f1f22, #26262a);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 250, 171, 0.2);
  box-shadow: 0 6px 20px rgba(0, 250, 171, 0.2);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 25px rgba(0, 250, 171, 0.35);
}

/* Product image */
.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid rgba(0, 250, 171, 0.2);
}

/* Card content */
.card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 16px 16px 8px 16px;
  color: #00faab;
  word-break: break-word;
}

.card .price {
  font-size: 1rem;
  font-weight: bold;
  margin: 0 16px 12px 16px;
  color: #00c896;
}

.card pre.negotiation {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  color: #d9d9d9;
  margin: 0 16px 12px 16px;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Negotiation input */
.negotiation-input {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px 16px;
}

.negotiation-input input {
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #00faab;
  background: #18181b;
  color: #d9d9d9;
}

.negotiation-input button {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: #00faab;
  color: black;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.negotiation-input button:hover {
  transform: scale(1.05);
}

/* Delete button */
.delete-btn {
  margin: 0 16px 16px 16px;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: #ff4d4d;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.delete-btn:hover {
  background: #ff1a1a;
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    padding: 20px;
  }
}
</style>