import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVisualizerStore = defineStore('visualizer', () => {
  const images = ref([])
  const sprites = ref([])

  function empty() {
    images.value.splice(0, images.value.length)
    sprites.value.splice(0, sprites.value.length)
  }

  return { images, sprites, empty }
})
