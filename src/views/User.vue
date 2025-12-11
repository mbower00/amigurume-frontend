<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { authCall } from '@/helpers/api'
import { formatDate } from '@/helpers/date'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const orders = ref(null)
const loadingOrders = ref(true)

onMounted(async () => {
  try {
    orders.value = await authCall('orders/my?order-by=created&direction=desc', router)
  } catch (error) {
    console.log(error)
  } finally {
    loadingOrders.value = false
  }
})

async function logout() {
  logoutLoading.value = true
  try {
    await logoutUser(router)
  } catch (error) {
    console.error(error)
  } finally {
    logoutLoading.value = false
  }
}

function getTotalQuantity(order) {
  return order.ordered_products.reduce((quantity, product) => quantity + product.quantity, 0)
}

function getTotalPrice(order) {
  return order.ordered_products.reduce((price, product) => price + product.product.price, 0)
}
</script>

<template>
  <v-container>
    <v-card class="user-info">
      <v-card-title> User Information </v-card-title>
      <v-card-text>
        <div>
          <div class="user-info-title">Username</div>
          <div>{{ userStore.username }}</div>
        </div>
        <div>
          <div class="user-info-title">Email</div>
          <div>{{ userStore.email }}</div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="logout" variant="elevated">Log out</v-btn>
      </v-card-actions>
    </v-card>

    <div class="orders-section">
      <h2 class="orders-title">Orders</h2>
      <div v-if="loadingOrders">
        <v-skeleton-loader type="heading"></v-skeleton-loader>
        <v-skeleton-loader type="list-item"></v-skeleton-loader>
        <v-skeleton-loader type="heading"></v-skeleton-loader>
        <v-skeleton-loader type="list-item"></v-skeleton-loader>
      </div>
      <div v-else>
        <p v-if="!orders || orders.orders.length === 0" class="none-found">
          No orders found. <router-link to="browse">Browse</router-link> our selection.
        </p>
        <div v-else>
          <v-card class="order-card" v-for="order in orders.orders">
            <v-card-title>
              <div class="flex">
                <div>
                  {{ formatDate(order.created) }}
                </div>
                <v-chip variant="tonal" class="total-price-qty"
                  >${{ getTotalPrice(order).toFixed(2) }} ({{
                    getTotalQuantity(order)
                  }}
                  items)</v-chip
                >
              </div>
            </v-card-title>
            <v-card-subtitle>
              <span
                :class="
                  order.fulfilled ? 'fa-solid fa-circle-check green' : 'fa-solid fa-hourglass-half'
                "
              ></span>
              {{ order.fulfilled ? formatDate(order.fulfilled) : 'Pending' }}
            </v-card-subtitle>
            <v-card-text>
              <v-expansion-panels>
                <v-expansion-panel v-for="product in order.ordered_products">
                  <v-expansion-panel-title>
                    <div class="flex">
                      <div>{{ product.product.name }}</div>
                      <v-chip variant="text" class="price-qty">
                        ${{ product.product.price.toFixed(2) }} x {{ product.quantity }}
                      </v-chip>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div class="img-description-flex">
                      <img
                        class="product-img"
                        :src="product.product.image_url"
                        :alt="product.product.name"
                        v-if="product.product.image_url"
                      />
                      <span>{{ product.product.description }}</span>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.user-info {
  max-width: 400px;
  margin: 0 auto;
}
.user-info-title {
  color: var(--steel);
  font-size: x-small;
  margin-top: 5px;
}
.orders-section {
  max-width: 700px;
  margin: 0 auto;
}
.orders-title {
  margin: 30px 0 15px 0;
  text-align: center;
}
.none-found {
  text-align: center;
}
.flex {
  display: flex;
  gap: 5px;
  align-items: center;
  width: 100%;
}
.total-price-qty {
  margin-left: auto;
  color: var(--lilac);
}
.price-qty {
  margin-left: auto;
  margin-right: 10px;
  color: var(--lilac);
}
.img-description-flex {
  display: flex;
  align-items: top;
  font-size: 14px;
  gap: 15px;
}
.product-img {
  width: 60px;
  height: 100%;
  border-radius: 4px;
}
.order-card {
  margin-bottom: 15px;
}
.green {
  color: var(--dark-green);
}
</style>
