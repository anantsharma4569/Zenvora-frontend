<script setup>
import { useRouter, RouterLink } from 'vue-router'
import { ShoppingBag, User } from '@lucide/vue'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'

const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-stone-200 bg-stone-50/95 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <RouterLink to="/" class="font-display text-xl font-semibold tracking-wide text-ink">
        ZENVORA
      </RouterLink>

      <nav class="hidden gap-8 text-sm font-medium text-stone-600 sm:flex">
        <RouterLink to="/shop" class="hover:text-ink">Shop</RouterLink>
      </nav>

      <div class="flex items-center gap-5">
        <div v-if="auth.isAuthenticated" class="hidden items-center gap-3 text-sm sm:flex">
          <span class="text-stone-600">{{ auth.user?.full_name || auth.user?.email }}</span>
          <button class="font-medium text-ink hover:text-pine-700" @click="handleLogout">Log Out</button>
        </div>
        <RouterLink v-else to="/login" class="hidden items-center gap-2 text-sm font-medium text-ink hover:text-pine-700 sm:flex">
          <User class="h-4 w-4" />
          Log In
        </RouterLink>

        <RouterLink to="/cart" class="relative flex items-center gap-2 text-ink">
          <ShoppingBag class="h-5 w-5" />
          <span
            v-if="cart.itemCount"
            class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pine-600 text-xs text-white"
          >
            {{ cart.itemCount }}
          </span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>
