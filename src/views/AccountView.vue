<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { User } from '@lucide/vue'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <section class="mx-auto max-w-md px-6 py-16">
    <h1 class="font-display text-2xl font-semibold text-ink">My Account</h1>

    <div class="mt-8 flex items-center gap-4">
      <img
        v-if="auth.user?.user_image"
        :src="auth.user.user_image"
        alt=""
        class="h-16 w-16 rounded-full object-cover"
      />
      <div v-else class="flex h-16 w-16 items-center justify-center rounded-full bg-stone-200 text-stone-500">
        <User class="h-7 w-7" />
      </div>
      <div>
        <p class="font-medium text-ink">{{ auth.user?.full_name }}</p>
        <p class="text-sm text-stone-500">{{ auth.user?.email }}</p>
      </div>
    </div>

    <dl class="mt-8 divide-y divide-stone-200 border-y border-stone-200">
      <div class="flex justify-between py-3 text-sm">
        <dt class="text-stone-500">Full Name</dt>
        <dd class="font-medium text-ink">{{ auth.user?.full_name || '—' }}</dd>
      </div>
      <div class="flex justify-between py-3 text-sm">
        <dt class="text-stone-500">Email</dt>
        <dd class="font-medium text-ink">{{ auth.user?.email || '—' }}</dd>
      </div>
      <div class="flex justify-between py-3 text-sm">
        <dt class="text-stone-500">Phone Number</dt>
        <dd class="font-medium text-ink">{{ auth.user?.phone || '—' }}</dd>
      </div>
    </dl>

    <button
      class="mt-8 w-full rounded-md border border-stone-300 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
      @click="handleLogout"
    >
      Log Out
    </button>
  </section>
</template>
