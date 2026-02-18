<script setup>
import { ref, onMounted, computed } from "vue";
import NavBar from '@/components/NavBar.vue'
import { searchQuery } from '@/composables/useSearch';

const products = ref([])
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q) ||
    p.category?.toLowerCase().includes(q)
  )
})

// Build a map of images found under src/assets/product at build time
const importedImages = import.meta.glob('../assets/product/*', { eager: true, as: 'url' })
const imageMap = {}
Object.entries(importedImages).forEach(([path, url]) => {
  const parts = path.split('/')
  const name = parts[parts.length - 1]
  imageMap[name] = url
})

const defaultImg = Object.values(imageMap)[0]

const normalizeName = (s) => {
  if (!s) return ''
  const noExt = s.replace(/\.(png|jpe?g|webp|gif|svg)$/i, '')
  let decoded = noExt
  try { decoded = decodeURIComponent(noExt) } catch {}
  return decoded.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

const normalizedMap = {}
for (const [name, url] of Object.entries(imageMap)) {
  normalizedMap[normalizeName(name)] = url
}

const tokens = (s) => s.split(/\s+/).filter(Boolean)

const getImage = (fileNameOrUrl) => {
  if (!fileNameOrUrl) return defaultImg
  if (/^https?:\/\//.test(fileNameOrUrl)) return fileNameOrUrl
  if (fileNameOrUrl.startsWith('/')) return fileNameOrUrl

  if (imageMap[fileNameOrUrl]) return imageMap[fileNameOrUrl]

  try {
    const decoded = decodeURIComponent(fileNameOrUrl)
    if (imageMap[decoded]) return imageMap[decoded]
  } catch {}

  const keyNorm = normalizeName(fileNameOrUrl)
  if (!keyNorm) return defaultImg
  if (normalizedMap[keyNorm]) return normalizedMap[keyNorm]

  const keyTokens = tokens(keyNorm)
  let best = { score: 0, url: null }
  for (const [imgNorm, url] of Object.entries(normalizedMap)) {
    const imgTokens = tokens(imgNorm)
    const set = new Set(imgTokens)
    let common = 0
    for (const t of keyTokens) if (set.has(t)) common++
    if (common > best.score) best = { score: common, url }
  }
  if (best.score > 0) return best.url

  const lowerKey = keyNorm
  for (const [name, url] of Object.entries(imageMap)) {
    if (name.toLowerCase().includes(lowerKey) || lowerKey.includes(name.toLowerCase())) return url
  }

  return defaultImg
}

// formatting the dollars to  rands
const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return 'R0.00'
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount)
}



// fetching products from MySQL
onMounted(async()=> {
    try{
        const res =await fetch('http://localhost:2006/products')
        if (!res.ok) throw new Error(res.statusText)

        const data=await res.json()
        products.value = data 
    } catch(err){
        console.error('Failed to fetch product catalogue from SQL ', err)
    }
})
</script>

<template>
<NavBar/>

<div>
  <div class="title">
     <h5 class="page-title">Catalogue</h5>
  </div>
    <div class="products-row"  >
        <div
        v-for="product in filteredProducts"
        :key="product.product_id"
        class="product-card">
           

        <!-- display card for catalogue -->
<div class="card">
  <div class="image_container">
    <img 
      :src="getImage(product.image_url || product.image)"
        class="card-img-top"
        :alt="`Photo of ${product.name}`"
        />
  </div>
  
  <div class="product-id"><span>ID: {{ product.product_id }}</span></div>
  
  <div class="title">
    <span>{{ product.name }}</span>
  </div>

  <div class="description">
    <span>{{ product.description || 'No description' }}</span>
  </div>

  <div class="category">
    <span>{{ product.category || 'Uncategorized' }}</span>
  </div>

  <div class="size">
    <span>Size: {{ product.size || 'N/A' }}</span>
  </div>

  <div class="stock-info">
    <span>Stock: {{ product.stock_quantity }}</span>
  </div>

  <div class="created-date">
    <span>Listed: {{ product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A' }}</span>
  </div>

  <div class="action">
    <div class="price">
      <span>{{ formatCurrency(product.price) }}</span>
    </div>
    <button class="cart-button">
      <svg
        class="cart-icon"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          stroke-linejoin="round"
          stroke-linecap="round"
        ></path>
      </svg>
      <span>Add to cart</span>
    </button>
  </div>
</div>











        </div>
    </div>
</div>






</template>


<style>
.container {
  padding: 20px;
  max-width: 100%;
}

.page-title {
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.8rem;
  color: #333;
  font-weight: 700;
}

.card {
  
  --bg-card: #27272a;
  --primary: #00faabaa;
  --primary-800: #00faabaa;
  --primary-shadow: #00faabaa;
  --light: #d9d9d9;
  --zinc-800: #18181b;
  --bg-linear: linear-gradient(0deg, var(--primary) 50%, var(--light) 125%);

  position: relative;

  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  padding: 1rem;
  min-height: 28rem;
  width: 340px;
  background-color: var(--bg-card);

  border-radius: 1rem;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 250, 171, 0.25);
  background-color: #2a2a2d;
}

.product-card {
  flex: 0 1 340px;
}

.image_container {
  overflow: hidden;
  cursor: pointer;

  position: relative;
  z-index: 5;

  width: 100%;
  height: 25rem;
  background-color: var(--primary-800);

  border-radius: 0.5rem;
}

.image_container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
  z-index: 1;
  transition: transform 0.4s ease;
}

.card:hover .image_container img {
  transform: scale(1.08);
}

.image_container .image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 3rem;
  fill: var(--light);
  z-index: 2;
}

.title {
  overflow: hidden;

  width: 100%;

  font-size: 1rem;
  font-weight: 600;
  color: var(--light);
  text-transform: capitalize;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.size {
  font-size: 0.75rem;
  color: var(--light);
}

.list-size {
  display: flex;
  align-items: center;
  gap: 0.25rem;

  margin-top: 0.25rem;
}

.list-size .item-list {
  list-style: none;
}

.list-size .item-list-button {
  cursor: pointer;

  padding: 0.5rem;
  background-color: var(--zinc-800);

  font-size: 0.75rem;
  color: var(--light);

  border: 2px solid var(--zinc-800);
  border-radius: 0.25rem;

  transition: all 0.3s ease-in-out;
}

.item-list-button:hover {
  border: 2px solid var(--light);
}
.item-list-button:focus {
  background-color: var(--primary);

  border: 2px solid var(--primary-shadow);

  box-shadow: inset 0px 1px 4px var(--primary-shadow);
}

.action {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--light);
}

.cart-button {
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;

  padding: 0.5rem;
  width: 100%;
  background-image: var(--bg-linear);

  font-size: 0.75rem;
  font-weight: 500;
  color:black;
  text-wrap: nowrap;

  border: 2px solid hsla(262, 83%, 58%, 0.5);
  border-radius: 0.5rem;
  box-shadow: inset 0 0 0.25rem 1px var(--light);
  transition: all 0.3s ease;
}

.cart-button:hover {
  transform: scale(1.05);
  box-shadow: inset 0 0 0.5rem 1px var(--light), 0 0 12px rgba(0, 250, 171, 0.6);
}

.cart-button:active {
  transform: scale(0.98);
}

.cart-button .cart-icon {
  width: 1rem;
}

.product-id {
  font-size: 0.9rem;
  color: var(--primary);
  font-weight: 500;
}

.description {
  font-size: 0.95rem;
  color: var(--light);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category {
  font-size: 0.7rem;
  color: var(--primary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stock-info {
  font-size: 1.5rem;
  color: var(--light);
}

.created-date {
  font-size: 1rem;
  color: #888;
  font-style: italic;
}

.products-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem;
  animation: fadeIn 0.6s ease-in;
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

.product-card {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>