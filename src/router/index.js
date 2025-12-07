import LogIn from '@/views/LogIn.vue'
import Home from '@/views/Home.vue'
import Cart from '@/views/Cart.vue'
import Browse from '@/views/Browse.vue'
import User from '@/views/User.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { loginUser } from '@/helpers/api'

async function requireAuth() {
  const userStore = useUserStore()
  console.log('s')
  if (userStore.isLoggedIn) {
    // Already logged in, success
    return true
  }
  try {
    await loginUser()
    // Login refreshed, success
    return true
  } catch {
    // refresh problem, failure
    return '/login'
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    { path: '/login', name: 'login', component: LogIn },
    {
      path: '/browse',
      name: 'browse',
      component: Browse,
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      beforeEnter: requireAuth,
    },
    // using code from https://router.vuejs.org/guide/essentials/dynamic-matching.html#Catch-all-404-Not-found-Route
    { path: '/:anything(.*)', redirect: '/' },
  ],
})

export default router
