<script setup>
import { ref, onMounted } from 'vue'
import { call } from '@/helpers/api'
import ProductCard from '@/components/ProductCard.vue'
import Visualizer from '@/components/Visualizer.vue'

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
      <v-skeleton-loader class="skele" type="card"></v-skeleton-loader>
      <v-skeleton-loader class="skele" type="card"></v-skeleton-loader>
      <v-skeleton-loader class="skele" type="card"></v-skeleton-loader>
      <v-skeleton-loader class="skele" type="card"></v-skeleton-loader>
    </div>
    <div v-else>
      <p v-if="!products || products.length === 0" style="text-align: center">
        No products found. Come back later!
      </p>
      <div v-else class="product-grid">
        <product-card v-for="product in products" :product></product-card>
      </div>
    </div>
    <v-card class="visualizer-card">
      <div class="relative">
        <visualizer></visualizer>
      </div>
    </v-card>
  </v-container>
</template>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  justify-items: center;
  width: 100%;
}

.container {
  display: grid;
  grid-template-columns: 1fr 318px;
  /* width: max-content; */
  max-width: 1300px;
  /* justify-items: center; */
}

.relative {
  position: relative;
}

.visualizer-card {
  height: 400px;
  width: 288px;
  position: sticky;
  top: 82px;
  max-width: 600px;
  margin: 0 0 30px 30px;
  /* background-color: #ddd; */
}
.skele {
  max-width: 400px;
  width: 100%;
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
    margin: 0 0 30px 0;
    justify-self: center;
  }
  .product-grid {
    grid-template-columns: 1fr;
    justify-items: center;
  }
}
</style>
