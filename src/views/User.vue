<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <v-card
    >user
    <p>{{ userStore.username }}</p>
    <p>{{ userStore.email }}</p>
    <p>{{ userStore.access }}</p>
  </v-card>
</template>

<style scoped></style>
