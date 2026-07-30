<script setup>
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/common/Button.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const full_name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const submitting = ref(false)
const error = ref(null)

async function handleSubmit() {
  submitting.value = true
  error.value = null
  try {
    await auth.register(email.value, full_name.value, password.value, phone.value)
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
    <h1 class="font-display text-2xl font-semibold text-ink">Create Account</h1>

    <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label class="text-sm font-medium text-ink" for="full_name">Full Name</label>
        <input
          id="full_name"
          v-model="full_name"
          type="text"
          required
          autocomplete="name"
          class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-ink focus:outline-none"
        />
      </div>

      <div>
        <label class="text-sm font-medium text-ink" for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          autocomplete="email"
          class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-ink focus:outline-none"
        />
      </div>

      <div>
        <label class="text-sm font-medium text-ink" for="phone">Phone Number <span class="text-stone-400">(optional)</span></label>
        <input
          id="phone"
          v-model="phone"
          type="tel"
          autocomplete="tel"
          class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-ink focus:outline-none"
        />
      </div>

      <div>
        <label class="text-sm font-medium text-ink" for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          minlength="8"
          autocomplete="new-password"
          class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-ink focus:outline-none"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <Button class="w-full" :disabled="submitting">
        {{ submitting ? 'Creating account…' : 'Create Account' }}
      </Button>
    </form>

    <p class="mt-6 text-sm text-stone-500">
      Already have an account?
      <RouterLink :to="{ path: '/login', query: route.query }" class="text-pine-600 underline">
        Log in
      </RouterLink>
    </p>
  </section>
</template>
