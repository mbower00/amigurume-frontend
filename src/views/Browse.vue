<script setup>
import { ref, onMounted } from 'vue'
import { call } from '@/helpers/api'
import ProductCard from '@/components/ProductCard.vue'

const products = ref(null)
const loadingProducts = ref(true)

onMounted(async () => {
  try {
    products.value = await call('/products?order-by=stock&direction=desc')
  } catch (error) {
    console.log(error)
  } finally {
    loadingProducts.value = false
  }
})
</script>

<template>
  <v-container class="container">
    <div v-if="loadingProducts" class="product-grid">
      <v-skeleton-loader type="card"></v-skeleton-loader>
      <v-skeleton-loader type="card"></v-skeleton-loader>
      <v-skeleton-loader type="card"></v-skeleton-loader>
      <v-skeleton-loader type="card"></v-skeleton-loader>
    </div>
    <div v-else>
      <p v-if="!products || products.length === 0" style="text-align: center">
        No products found. Come back later!
      </p>
      <div v-else class="product-grid">
        <product-card v-for="product in products" :product></product-card>
      </div>
    </div>
    <v-card class="visualizer-card"> </v-card>
  </v-container>
</template>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.container {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 30px;
  max-width: 1400px;
}

.visualizer-card {
  height: 400px;
  position: sticky;
  top: 82px;
  max-width: 600px;
  justify-self: center;
  width: 100%;
  background-color: #ddd;
  /* border: white 4px dashed; */
}

@media (max-height: 500px) {
  .visualizer-card {
    position: relative;
    top: 0;
  }
}
@media (max-width: 1120px) {
  .container {
    grid-template-columns: 1fr;
  }
  .visualizer-card {
    position: initial;
    grid-row-start: 1;
  }
  .product-grid {
    grid-template-columns: 1fr;
    justify-items: center;
  }
}
</style>
