<script>
import { ref, onMounted } from "vue";
import NavBar from '@/components/NavrBar.vue'

const products = ref([])

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

</template>


<style>


</style>