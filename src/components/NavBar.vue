<script setup>
import { logoutUser } from '@/helpers/api'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const cartStore = useCartStore()
const router = useRouter()
const logoutLoading = ref(false)

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
</script>

<template>
  <div class="bar flex">
    <router-link to="/" class="title fancy-font">AmiguruMe</router-link>
    <nav class="links flex">
      <router-link to="/" active-class="active">Home</router-link>
      <router-link to="browse" active-class="active">Browse</router-link>
    </nav>
    <div class="user-area flex">
      <router-link v-if="userStore.isLoggedIn" to="user" class="username-and-btn">
        <span class="username">{{ userStore.username }}</span>
        <v-btn density="compact" class="btn" variant="text" icon="fa-solid fa-user"></v-btn>
      </router-link>
      <v-btn
        density="compact"
        class="btn"
        variant="text"
        :loading="logoutLoading"
        icon="fas fa-sign-out-alt"
        @click="logout"
        v-if="userStore.isLoggedIn"
      ></v-btn>
      <router-link to="login" v-else>
        <v-btn
          density="compact"
          class="btn"
          variant="text"
          icon="fa-solid fa-right-to-bracket"
        ></v-btn>
      </router-link>
      <router-link to="cart">
        <v-badge
          location="top right"
          :dot="!Boolean(cartStore.totalQuantity)"
          text-color="white"
          :color="cartStore.totalQuantity ? 'var(--blackberry)' : 'transparent'"
          :content="cartStore.totalQuantity"
          offset-x="2"
          offset-y="2"
        >
          <v-btn
            density="compact"
            class="btn"
            variant="text"
            icon="fa-solid fa-cart-shopping"
          ></v-btn>
        </v-badge>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
  color: white;
}
.flex {
  display: flex;
  align-items: center;
  gap: 15px;
}
.bar {
  width: 100%;
  margin-bottom: 20px;
  background-color: var(--lilac);
  padding: 5px 20px;
  color: white;
}
.title {
  font-size: x-large;
}
.links {
  font-size: small;
}
.user-area {
  margin-left: auto;
  gap: 5px;
}
.active {
  text-decoration: underline;
}
.username-and-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}
.btn {
  font-size: 10px;
}
.username {
  font-size: x-small;
}
@media (max-width: 600px) {
  .title {
    font-size: medium;
  }
  .bar {
    padding: 9px 20px;
  }
}
@media (max-width: 450px) {
  .title {
    display: none;
  }
}
</style>
