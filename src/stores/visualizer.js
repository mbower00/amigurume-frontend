import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useVisualizerStore = defineStore('visualizer', () => {
  const images = ref([])
  const sprites = ref([])

  return { images, sprites }
})
