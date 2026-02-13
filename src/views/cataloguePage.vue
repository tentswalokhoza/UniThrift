<script setup>
import { ref, onMounted } from "vue";
import NavBar from '@/components/NavBar.vue'

const products = ref([])

//Fetching 
const getImage = (fileName) => {
  if (!fileName) return new URL('../assets/products/default.png', import.meta.url).href
  try {
    return new URL(`../assets/products/${fileName}`, import.meta.url).href
  } catch {
    return new URL('../assets/products/default.png', import.meta.url).href
  }
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
     <h5 class="page-title">Catlogue</h5>
  </div>
    <div class="products-row"  >
        <div
        v-for="product in products"
        :key="product.product_id"
        class="product-card">
           

        <!-- display card for catalogue -->
<div class="card">
  <div class="image_container">
    <!-- placeholder icon shown when image fails or is loading -->
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="image">
      <path
        d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"
      ></path>
    </svg>
    <img 
        :src="getImage(product.image_url)"
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
  margin-bottom: 30px;
  font-size: 1.8rem;
  color: #333;
}

.card {
  
  --bg-card: #27272a;
  --primary: #6d28d9;
  --primary-800: #4c1d95;
  --primary-shadow: #2e1065;
  --light: #d9d9d9;
  --zinc-800: #18181b;
  --bg-linear: linear-gradient(0deg, var(--primary) 50%, var(--light) 125%);

  position: relative;

  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  padding: 1rem;
  height:550px;
  width: 350px;
  background-color: var(--bg-card);

  border-radius: 1rem;
}

.description{
  height:200px;
}

.image_container {
  overflow: hidden;
  cursor: pointer;

  position: relative;
  z-index: 5;

  width: 100%;
  height: 8rem;
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
  overflow: clip;

  width: 100%;

  font-size: 1rem;
  font-weight: 600;
  color: var(--light);
  text-transform: capitalize;
  text-wrap: nowrap;
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
  color: var(--light);
  text-wrap: nowrap;

  border: 2px solid hsla(262, 83%, 58%, 0.5);
  border-radius: 0.5rem;
  box-shadow: inset 0 0 0.25rem 1px var(--light);
}

.cart-button .cart-icon {
  width: 1rem;
}

.product-id {
  font-size: 0.65rem;
  color: var(--primary);
  font-weight: 500;
}

.description {
  font-size: 0.7rem;
  color: var(--light);
  line-height: 1.3;
  max-height: 2.1em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.category {
  font-size: 0.7rem;
  color: var(--primary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stock-info {
  font-size: 0.7rem;
  color: var(--light);
}

.created-date {
  font-size: 0.65rem;
  color: #888;
  font-style: italic;
}

.products-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem;
}

</style>