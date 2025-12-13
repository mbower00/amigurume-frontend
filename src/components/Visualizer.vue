<!-- using code from:
 - https://www.youtube.com/watch?v=7PYvx8u_9Sk
 - https://www.youtube.com/watch?v=cB6paLHebb4s
 - https://vuejs.org/guide/essentials/template-refs.html#template-refs
 - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage
 - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images
 - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations
 - https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
-->

<script setup>
import { useVisualizerStore } from '@/stores/visualizer'
import { onMounted, onUnmounted, useTemplateRef, ref, watch } from 'vue'

const vStore = useVisualizerStore()
const canvasWidth = ref(288)
const canvasHeight = ref(400)
const canvas = useTemplateRef('canvas')
const ctx = ref(null)
const savedImages = ref([])
// const sprites = ref([])
const isDragging = ref(false)
const draggingSpriteIndex = ref(0)
const startX = ref(0)
const startY = ref(0)
const offsetX = ref(0)
const offsetY = ref(0)
const listenerScroll = ref(null)
const listenerResize = ref(null)

onMounted(() => {
  ctx.value = canvas.value.getContext('2d')
  canvas.value.onmousedown = mouseDown
  canvas.value.onmouseup = mouseUp
  canvas.value.onmouseleave = mouseUp
  canvas.value.onmousemove = mouseMove
  canvas.value.ontouchstart = (event) => {
    mouseDown(event, true)
  }
  canvas.value.ontouchend = mouseUp
  canvas.value.ontouchcancel = (event) => {
    mouseUp(event, true)
  }
  canvas.value.ontouchmove = (event) => {
    mouseMove(event, true)
  }
  getOffset()

  listenerScroll.value = window.addEventListener('scroll', getOffset)
  listenerResize.value = window.addEventListener('resize', getOffset)
  // TODO: Make double click flip/rotate
  // canvas.value.ondblclick = doubleClick
})

onUnmounted(() => {
  window.removeEventListener('scroll', listenerScroll.value)
  window.removeEventListener('resize', listenerResize.value)
})

watch(vStore.images, (images) => {
  const save = [...savedImages.value]
  // console.log('SAVE', save, 'IMAGES', images)
  for (let img of images) {
    const index = save.indexOf(img)
    if (index > -1) {
      // is found
      save.splice(index, 1)
    } else {
      // not found (newly added)]
      // console.log(img)
      const imgElement = new Image()
      imgElement.src = img
      imgElement.addEventListener('load', () => {
        vStore.sprites.push({
          element: imgElement,
          x: 15,
          y: 15,
          width: imgElement.width,
          height: imgElement.height,
          flip: false,
        })
        drawSprites()
      })
    }
  }
  savedImages.value = [...images]
})

function clearVisualizer() {
  vStore.images = []
  vStore.sprites = []
  drawSprites()
}

function getOffset() {
  const offsets = canvas.value.getBoundingClientRect()
  offsetX.value = offsets.left
  offsetY.value = offsets.top
}

function drawSprites() {
  ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  for (let sprite of vStore.sprites) {
    // if (sprite.flip) {
    //   ctx.value.save()
    //   ctx.value.rotate((Math.PI / 180) * )
    //   ctx.value.drawImage(sprite.element, sprite.x, sprite.y)
    //   ctx.value.restore()
    // } else {
    ctx.value.drawImage(sprite.element, sprite.x, sprite.y)
    // }
  }
}

function isMouseInSprite(x, y, sprite) {
  let left = sprite.x
  let right = sprite.x + sprite.width
  let top = sprite.y
  let bottom = sprite.y + sprite.height
  if (x > left && x < right && y > top && y < bottom) return true
  return false
}

function mouseDown(event, touching) {
  event.preventDefault()
  if (touching) {
    startX.value = event.changedTouches[0].clientX - offsetX.value
    startY.value = event.changedTouches[0].clientY - offsetY.value
  } else {
    startX.value = event.clientX - offsetX.value
    startY.value = event.clientY - offsetY.value
  }
  // reverse, so you favor the top sprite
  const reverseSprites = [...vStore.sprites].reverse()
  let index = reverseSprites.length - 1
  for (let sprite of reverseSprites) {
    if (isMouseInSprite(startX.value, startY.value, sprite)) {
      draggingSpriteIndex.value = index
      isDragging.value = true
      return
    }
    index -= 1
  }
}

function mouseUp(event) {
  if (!isDragging.value) {
    return
  }
  event.preventDefault()
  isDragging.value = false
}

function mouseMove(event, touching) {
  if (!isDragging.value) return
  event.preventDefault()
  let mouseX
  let mouseY
  if (touching) {
    mouseX = event.changedTouches[0].clientX - offsetX.value
    mouseY = event.changedTouches[0].clientY - offsetY.value
  } else {
    mouseX = event.clientX - offsetX.value
    mouseY = event.clientY - offsetY.value
  }

  let distanceX = mouseX - startX.value
  let distanceY = mouseY - startY.value

  // move the sprite and move it to top layer
  const sprite = vStore.sprites.splice(draggingSpriteIndex.value, 1)[0]
  sprite.x += distanceX
  sprite.y += distanceY
  draggingSpriteIndex.value = vStore.sprites.push(sprite) - 1

  drawSprites()

  startX.value = mouseX
  startY.value = mouseY
}

// function doubleClick(event) {
//   event.preventDefault()
//   let mouseX = event.layerX
//   let mouseY = event.layerY
//   // reverse, so you favor the top sprite
//   const reverseSprites = [...sprites.value].reverse()
//   let index = reverseSprites.length - 1
//   for (let sprite of reverseSprites) {
//     if (isMouseInSprite(mouseX, mouseY, sprite)) {
//       sprites.value[index].flip = !sprites.value[index].flip
//       drawSprites()
//       return
//     }
//     index -= 1
//   }
// }
</script>

<template>
  <v-btn
    class="clear"
    density="compact"
    variant="flat"
    icon="fa-solid fa-trash"
    @click.stop="clearVisualizer"
  >
  </v-btn>
  <canvas ref="canvas" width="288" height="400"></canvas>
</template>

<style scoped>
.clear {
  position: absolute;
  top: 10px;
  right: 10px;
  color: var(--light-blackberry);
  font-size: x-small;
}
</style>
