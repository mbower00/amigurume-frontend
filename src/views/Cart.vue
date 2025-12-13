<script setup>
import { authCall, call } from '@/helpers/api'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const cartStore = useCartStore()
const router = useRouter()

const cartLoading = ref(true)
const placeOrderLoading = ref(false)
const errorMessage = ref(null)
const cart = ref([])

const filteredCart = computed(() => cart.value.filter((product) => cartStore.cart[product.id]))
const totalPrice = computed(() =>
  filteredCart.value.reduce(
    (price, product) => price + product.price * cartStore.cart[product.id],
    0,
  ),
)

async function loadCart() {
  cartLoading.value = true
  try {
    const ids = []
    for (let id in cartStore.cart) {
      ids.push(Number(id))
    }
    // with help from ChatGPT.
    // It said that using get was a problem.
    // https://chatgpt.com/c/691342fc-371c-832d-8eb1-71fcadf5972f
    cart.value = await call('/products/from', 'patch', { ids })
  } catch (error) {
    console.log(error)
  } finally {
    cartLoading.value = false
  }
}

onMounted(loadCart)

function addToCart(id) {
  cartStore.addToCart(id)
}
function subtractFromCart(id) {
  cartStore.subtractFromCart(id)
}

function toLogIn() {
  router.push('login')
}

async function placeOrder() {
  placeOrderLoading.value = true
  errorMessage.value = null

  const body = { ordered_products: [] }
  filteredCart.value.forEach((product) => {
    body['ordered_products'].push({
      id: product.id,
      quantity: cartStore.cart[product.id],
    })
  })

  try {
    await authCall('/order', router, 'post', body)
    cartStore.emptyCart()
  } catch (error) {
    errorMessage.value = error?.response?.data?.message
    loadCart()
  } finally {
    placeOrderLoading.value = false
  }
}
</script>

<template>
  <v-container class="container">
    <v-card v-if="filteredCart.length > 0" class="place-order-card" :loading="placeOrderLoading">
      <v-card-title class="card-title">
        Total: <span class="lilac">${{ totalPrice.toFixed(2) }}</span>
        <span class="blackberry"> ({{ cartStore.totalQuantity }} items)</span>
      </v-card-title>
      <v-expand-transition>
        <v-card-text v-show="errorMessage">
          <div>
            <v-alert class="error">{{ errorMessage }}</v-alert>
          </div>
        </v-card-text>
      </v-expand-transition>
      <v-card-actions class="card-actions">
        <v-btn
          variant="elevated"
          style="color: white"
          color="var(--dark-green)"
          class="center-block"
          v-if="userStore.isLoggedIn"
          @click="placeOrder"
          :disabled="placeOrderLoading"
          >place order</v-btn
        >
        <v-btn
          v-else
          variant="outlined"
          color="var(--dark-green)"
          class="center-block"
          @click="toLogIn"
          >log in to order</v-btn
        >
      </v-card-actions>
    </v-card>
    <div v-if="cartLoading">
      <v-skeleton-loader
        v-if="filteredCart.length === 0"
        type="image"
        style="width: 300px; margin: 0 auto"
      ></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="list-item"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="list-item"></v-skeleton-loader>
    </div>
    <div v-else>
      <p v-if="!filteredCart || filteredCart.length === 0" class="none-found">
        Empty cart. <router-link to="browse">Browse</router-link> our selection.
      </p>
      <div v-else>
        <div class="cart-card">
          <v-expansion-panels>
            <v-expansion-panel v-for="product in filteredCart">
              <v-expansion-panel-title>
                <div class="title-flex">
                  <div class="img-name">
                    <div class="small-img-container hide-small">
                      <img
                        class="small-product-img"
                        :src="product.image_url"
                        :alt="product.name"
                        v-if="product.image_url"
                      />
                    </div>
                    {{ product.name }}
                  </div>
                  <div class="price-qty">
                    <v-chip
                      class="hide-small"
                      variant="tonal"
                      :color="product.stock > 0 ? 'var(--dark-green)' : '#999'"
                      >{{
                        product.stock > 0 ? `${product.stock} in stock` : 'out of stock'
                      }}</v-chip
                    >
                    <v-chip variant="text" class="lilac price">
                      ${{ product.price.toFixed(2) }}
                    </v-chip>
                    <span>x</span>
                    <v-chip variant="text" class="blackberry">{{
                      cartStore.cart[product.id]
                    }}</v-chip>
                    <v-btn
                      @click.stop="subtractFromCart(product.id)"
                      class="math-icon"
                      density="compact"
                      color="var(--light-blackberry)"
                      variant="text"
                      icon="fa-solid fa-minus"
                      :disabled="cartStore.cart[product.id] <= 0"
                    ></v-btn>
                    <v-btn
                      @click.stop="addToCart(product.id)"
                      class="math-icon"
                      density="compact"
                      color="var(--dark-green)"
                      variant="text"
                      icon="fa-solid fa-plus"
                      :disabled="cartStore.cart[product.id] >= product.stock"
                    ></v-btn>
                  </div>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="img-description-flex">
                  <img
                    class="large-product-img"
                    :src="product.image_url"
                    :alt="product.name"
                    v-if="product.image_url"
                  />
                  <div>
                    <span>{{ product.description }}</span>
                    <br />
                    <div class="type desciption-tag lilac sm-margin-right">
                      {{ product.type }}
                    </div>
                    <br class="show-small" />
                    <div
                      class="show-small desciption-tag sm-margin-right"
                      :class="product.stock > 0 ? 'dark-green' : 'grey'"
                    >
                      {{ product.stock > 0 ? `${product.stock} in stock` : 'out of stock' }}
                    </div>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.container {
  max-width: 750px;
  margin: 0 auto;
}
.place-order-card {
  max-width: 300px;
  margin: 0 auto 16px auto;
}
.card-title {
  text-align: center;
  padding-top: 16px;
}
.error {
  background-color: var(--error-background);
  margin-top: 8px;
}
.card-actions {
  padding-bottom: 16px;
}
.center-block {
  display: block;
  margin: 0 auto;
}
.cart-title {
  margin: 0 0 15px 0;
  text-align: center;
}
.none-found {
  text-align: center;
}
.cart-card {
  margin-bottom: 15px;
}
.title-flex {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
}
.img-name {
  display: flex;
  align-items: center;
  gap: 12px;
}
.no-padding {
  padding: 0;
}
.price-qty {
  margin-left: auto;
  margin-right: 10px;
  display: flex;
  align-items: center;
}
.lilac {
  color: var(--lilac);
}
.blackberry {
  color: var(--blackberry);
}
.dark-green {
  color: var(--dark-green);
}
.grey {
  color: #999;
}
.math-icon {
  font-size: xx-small;
}
.img-description-flex {
  display: flex;
  align-items: top;
  font-size: 14px;
  gap: 15px;
}
.small-product-img {
  width: auto;
  height: auto;
  max-width: 30px;
  max-height: 30px;
}
.large-product-img {
  width: auto;
  height: auto;
  max-width: 200px;
  max-height: 200px;
}
.small-img-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
}
.sm-margin-right {
  margin-right: 5px;
}
.desciption-tag {
  display: inline-flex;
  font-weight: bold;
}
.show-small {
  display: none;
}

@media (max-width: 600px) {
  .show-small {
    display: inline-flex;
  }
  .hide-small {
    display: none;
  }
  .large-product-img {
    max-width: 50px;
    max-height: 50px;
  }
  .title-flex {
    flex-direction: column;
    align-items: start;
  }
  .price-qty {
    margin-left: 0;
  }
  .price {
    padding-left: 0;
  }
}
</style>
