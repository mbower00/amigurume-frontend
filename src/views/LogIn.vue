<!-- using code from https://vuetifyjs.com/en/components/text-fields/-->
<!-- using code from https://vuetifyjs.com/en/components/tabs/ -->

<script setup>
import { ref } from 'vue'
import { noWhiteSpace, required, emailFormat } from '@/helpers/rules'
import { loginUser, signUpUser } from '@/helpers/api'
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
const option = ref('login')
const username = ref(null)
const password = ref(null)
const email = ref(null)
const isValid = ref(null)
const isLoading = ref(null)
const errorMessage = ref(null)
const viewPassword = ref(false)
const router = useRouter()
const route = useRoute()

async function login() {
  if (!isValid.value || isLoading.value) return
  isLoading.value = true
  errorMessage.value = null
  try {
    if (option.value === 'login') {
      await loginUser(username.value, password.value)
    } else {
      await signUpUser(username.value, email.value, password.value)
    }
    if (route.redirectedFrom) {
      router.push(route.redirectedFrom)
    } else {
      router.push('/')
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-container class="login-container">
    <v-card :loading="isLoading">
      <v-tabs v-model="option" color="var(--blackberry)">
        <v-tab :disabled="isLoading" value="login">log in</v-tab>
        <v-tab :disabled="isLoading" value="signup">sign up</v-tab>
      </v-tabs>
      <v-container>
        <v-form class="login-form" v-model="isValid" @submit.prevent="login">
          <v-text-field
            v-model="username"
            label="Username"
            :rules="[required, noWhiteSpace]"
            variant="filled"
            :disabled="isLoading"
          ></v-text-field>
          <v-expand-transition>
            <v-text-field
              v-show="option === 'signup'"
              v-model="email"
              label="Email"
              :rules="option === 'signup' ? [required, noWhiteSpace, emailFormat] : []"
              variant="filled"
              type="email"
              placeholder="example@gmail.com"
              :disabled="isLoading"
            ></v-text-field>
          </v-expand-transition>
          <v-text-field
            v-model="password"
            label="Password"
            :rules="[required, noWhiteSpace]"
            variant="filled"
            :type="viewPassword ? 'text' : 'password'"
            :append-inner-icon="viewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            @click:append-inner="viewPassword = !viewPassword"
            :disabled="isLoading"
          ></v-text-field>
          <v-btn
            type="submit"
            :disabled="!isValid || isLoading"
            variant="outlined"
            class="login-btn"
            >{{ option === 'login' ? 'log in' : 'sign up' }}</v-btn
          >
          <v-expand-transition>
            <div v-show="errorMessage">
              <v-alert class="error">{{ errorMessage }}</v-alert>
            </div>
          </v-expand-transition>
        </v-form>
      </v-container>
    </v-card>
  </v-container>
</template>

<style scoped>
.login-container {
  margin-top: 10vh;
  max-width: 500px;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.login-btn {
  width: fit-content;
  margin: 0 auto;
}
.error {
  background-color: var(--error-background);
  margin-top: 16px;
}
</style>
