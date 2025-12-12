<script setup>
import { computed, defineProps, ref } from 'vue'
const prop = defineProps(['product'])

const inStock = computed(() => prop.product.stock > 0)

const quantity = ref(inStock.value ? 1 : 0)

console.log(prop.product.stock > 0)

function addToVisualizer() {}
function addToCart() {}
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
      <v-btn
        @click="quantity -= 1"
        class="math-icon"
        density="compact"
        color="var(--light-blackberry)"
        icon="fa-solid fa-minus"
        :disabled="!inStock || quantity <= 1"
      ></v-btn>
      <v-badge
        location="top right"
        :dot="!inStock"
        text-color="white"
        :color="inStock ? 'var(--lilac)' : 'transparent'"
        :content="quantity"
      >
        <v-btn
          @click="addToCart"
          variant="text"
          :disabled="!inStock || quantity < 1"
          icon="fa-solid fa-cart-plus"
          class="lilac"
        >
        </v-btn>
      </v-badge>
      <v-btn
        @click="quantity += 1"
        class="math-icon"
        density="compact"
        color="var(--dark-green)"
        icon="fa-solid fa-plus"
        :disabled="!inStock || quantity >= prop.product.stock"
      ></v-btn>
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
}
img {
  margin: 16px auto 8px auto;
  display: block;
  max-width: 200px;
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
.math-icon {
  font-size: xx-small;
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
