import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const access = ref(null)
  const username = ref(null)
  const email = ref(null)
  const authHeader = computed(() => `Bearer ${access.value}`)
  const isLoggedIn = computed(() => Boolean(access.value && username.value && email.value))
  function logout() {
    access.value = null
    username.value = null
    email.value = null
  }

  return { access, username, email, authHeader, isLoggedIn, logout }
})
