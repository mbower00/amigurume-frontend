<!-- using code from:
 - https://www.youtube.com/watch?v=7PYvx8u_9Sk
 - https://www.youtube.com/watch?v=cB6paLHebb4s
 - https://vuejs.org/guide/essentials/template-refs.html#template-refs
 - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage
 - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images
 - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations
-->

<script setup>
import { onMounted, useTemplateRef, ref, watch } from 'vue'

const prop = defineProps(['images'])
const canvasWidth = ref(288)
const canvasHeight = ref(400)
const canvas = useTemplateRef('canvas')
const ctx = ref(null)
const savedImages = ref([])
const sprites = ref([])
const isDragging = ref(false)
const draggingSpriteIndex = ref(0)
const startX = ref(0)
const startY = ref(0)

onMounted(() => {
  ctx.value = canvas.value.getContext('2d')
  canvas.value.onmousedown = mouseDown
  canvas.value.onmouseup = mouseUp
  canvas.value.onmouseleave = mouseUp
  canvas.value.onmousemove = mouseMove
  // TODO: Make double click flip/rotate
  // canvas.value.ondblclick = doubleClick
})

watch(prop.images, (images) => {
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
        sprites.value.push({
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

function drawSprites() {
  ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  for (let sprite of sprites.value) {
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

function mouseDown(event) {
  event.preventDefault()
  startX.value = event.layerX
  startY.value = event.layerY
  // reverse, so you favor the top sprite
  const reverseSprites = [...sprites.value].reverse()
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

function mouseMove(event) {
  if (!isDragging.value) return
  event.preventDefault()
  let mouseX = event.layerX
  let mouseY = event.layerY

  let distanceX = mouseX - startX.value
  let distanceY = mouseY - startY.value

  // move the sprite and move it to top layer
  const sprite = sprites.value.splice(draggingSpriteIndex.value, 1)[0]
  sprite.x += distanceX
  sprite.y += distanceY
  draggingSpriteIndex.value = sprites.value.push(sprite) - 1

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
  <canvas ref="canvas" width="288" height="400"></canvas>
</template>

<style scoped></style>
