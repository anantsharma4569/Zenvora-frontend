<script setup>
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/common/Button.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const usr = ref('')
const pwd = ref('')
const submitting = ref(false)
const error = ref(null)

async function handleSubmit() {
  submitting.value = true
  error.value = null
  try {
    await auth.login(usr.value, pwd.value)
    router.push(route.query.redirect || '/')
  } catch (e) {
    error.value = e.message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-sm px-6 py-24">
    <h1 class="font-display text-2xl font-semibold text-ink">Log In</h1>

    <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label class="text-sm font-medium text-ink" for="usr">Email</label>
        <input
          id="usr"
          v-model="usr"
          type="email"
          required
          autocomplete="username"
          class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-ink focus:outline-none"
        />
      </div>

      <div>
        <label class="text-sm font-medium text-ink" for="pwd">Password</label>
        <input
          id="pwd"
          v-model="pwd"
          type="password"
          required
          autocomplete="current-password"
          class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-ink focus:outline-none"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <Button class="w-full" :disabled="submitting">
        {{ submitting ? 'Logging in…' : 'Log In' }}
      </Button>
    </form>

    <p class="mt-6 text-sm text-stone-500">
      Don't have an account?
      <RouterLink :to="{ path: '/register', query: route.query }" class="text-pine-600 underline">
        Sign up
      </RouterLink>
    </p>
    <p class="mt-2 text-sm text-stone-500">
      In a hurry?
      <RouterLink :to="{ path: '/verify', query: route.query }" class="text-pine-600 underline">
        Continue with a code instead
      </RouterLink>
    </p>
  </section>
</template>
