<script setup>
import { computed, defineProps, ref, watch } from 'vue'
import { useCartStore } from '@/stores/cart'

const prop = defineProps(['product'])
const emit = defineEmits(['addToVisualizer'])

const cartStore = useCartStore()

const quantity = computed(() => cartStore.cart?.[prop.product.id] || 0)

const inStock = computed(() => prop.product.stock > 0)

function addToVisualizer() {
  emit('addToVisualizer', prop.product.image_url)
}
function addToCart() {
  cartStore.addToCart(prop.product.id)
}
function subtractFromCart() {
  cartStore.subtractFromCart(prop.product.id)
}
</script>

<template>
  <v-card class="card">
    <v-chip class="type-chip" variant="elevated" color="var(--lilac)">{{
      prop.product.type
    }}</v-chip>
    <v-btn
      v-if="prop.product.image_url"
      @click="addToVisualizer"
      icon="fa-solid fa-object-group"
      class="lilac canvas-btn"
      variant="elevated"
    ></v-btn>
    <div v-if="prop.product.image_url">
      <img :src="prop.product.image_url" :alt="prop.product.name" />
    </div>
    <div v-else class="img-placeholder"></div>
    <v-card-title>
      {{ prop.product.name }}
    </v-card-title>
    <v-card-text>
      {{ prop.product.description }}
    </v-card-text>
    <v-card-actions class="flex center">
      <v-chip class="stock-chip" variant="text" :color="inStock ? 'var(--dark-green)' : '#999'">{{
        inStock ? `${prop.product.stock} in stock` : 'out of stock'
      }}</v-chip>

      <div class="add-container">
        <v-btn
          @click="subtractFromCart"
          class="math-icon"
          density="compact"
          color="var(--light-blackberry)"
          icon="fa-solid fa-minus"
          :disabled="quantity <= 0"
          variant="text"
          v-if="quantity"
        ></v-btn>

        <v-badge
          location="top right"
          :dot="!Boolean(quantity)"
          text-color="white"
          :color="quantity ? 'var(--blackberry)' : 'transparent'"
          :content="quantity"
        >
          <v-btn
            @click="addToCart"
            variant="text"
            :disabled="!inStock || quantity >= prop.product.stock"
            icon="fa-solid fa-cart-plus"
            class="lilac"
          >
          </v-btn>
        </v-badge>
      </div>

      <v-chip class="price-chip" variant="text" color="var(--lilac)"
        >${{ prop.product.price.toFixed(2) }}</v-chip
      >
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.card {
  /* padding: 15px; */
  height: min-content;
  position: relative;
  max-width: 400px;
  width: 100%;
}
img {
  margin: 16px auto 8px auto;
  display: block;
  max-width: 200px;
  height: auto;
  width: auto;
  max-height: 200px;
}
.img-placeholder {
  width: 150px;
  height: 75px;
}
.flex {
  display: flex;
  gap: 10px;
  align-items: center;
  position: relative;
}
.center {
  justify-content: center;
}
.right {
  margin-left: auto;
}
.lilac {
  color: var(--lilac);
}
.add-container {
  position: relative;
  width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.math-icon {
  position: absolute;
  font-size: xx-small;
  left: 0px;
}
.price-chip,
.stock-chip,
.canvas-btn,
.type-chip {
  position: absolute;
  z-index: 2;
}
.price-chip {
  right: 4px;
}
.stock-chip {
  left: 4px;
}
.canvas-btn {
  right: 16px;
  top: 16px;
}
.type-chip {
  left: 16px;
  top: 16px;
}
</style>
