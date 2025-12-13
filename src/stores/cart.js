import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const cart = reactive({})

  const totalQuantity = computed(() => {
    let quantity = 0
    for (let id in cart) {
      quantity += cart[id]
    }
    return quantity
  })

  function addToCart(id) {
    const quantity = cart?.[id] || 0
    cart[id] = quantity + 1
  }

  function subtractFromCart(id) {
    const quantity = cart?.[id]
    if (quantity === 1) {
      delete cart[id]
    } else if (quantity > 1) {
      cart[id] = quantity - 1
    }
  }

  function emptyCart() {
    for (let id in cart) {
      delete cart[id]
    }
  }

  return { cart, totalQuantity, addToCart, emptyCart, subtractFromCart }
})
