<script setup>
import { RouterLink } from 'vue-router'
import { ShoppingBag } from '@lucide/vue'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
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
  </header>
</template>
