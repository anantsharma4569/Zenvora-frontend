<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Minus, Plus, X } from '@lucide/vue'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/utils/currency'
import Button from '@/components/common/Button.vue'

const cart = useCartStore()

onMounted(() => cart.fetchCart())
</script>

<template>
  <section class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="font-display text-2xl font-semibold text-ink">Your Bag</h1>

    <p v-if="cart.loading" class="mt-8 text-stone-500">Loading…</p>
    <p v-else-if="cart.error" class="mt-8 text-red-600">{{ cart.error }}</p>

    <p v-else-if="cart.isEmpty" class="mt-8 text-stone-500">
      Your bag is empty. <RouterLink to="/shop" class="text-pine-600 underline">Continue shopping</RouterLink>
    </p>

    <div v-else class="mt-8 space-y-6">
      <div
        v-for="item in cart.items"
        :key="item.name"
        class="flex flex-wrap items-center gap-4 border-b border-stone-200 pb-6 sm:flex-nowrap"
      >
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.product_name"
          class="h-20 w-16 shrink-0 rounded object-cover"
        />
        <div class="min-w-[8rem] flex-1">
          <p class="font-medium text-ink">{{ item.product_name }}</p>
          <p v-if="item.color || item.size" class="text-xs text-stone-500">
            <span v-if="item.color">{{ item.color }}</span>
            <span v-if="item.color && item.size"> · </span>
            <span v-if="item.size">{{ item.size }}</span>
          </p>
          <p class="text-sm text-stone-500">{{ formatCurrency(item.price) }}</p>
        </div>

        <div class="flex items-center gap-2">
          <button class="rounded border border-stone-300 p-1" @click="cart.updateQty(item.name, item.qty - 1)">
            <Minus class="h-4 w-4" />
          </button>
          <span class="w-6 text-center">{{ item.qty }}</span>
          <button class="rounded border border-stone-300 p-1" @click="cart.updateQty(item.name, item.qty + 1)">
            <Plus class="h-4 w-4" />
          </button>
        </div>

        <button class="text-stone-400 hover:text-red-600" @click="cart.removeItem(item.name)">
          <X class="h-5 w-5" />
        </button>
      </div>

      <div class="flex items-center justify-between pt-4">
        <span class="text-lg font-medium text-ink">Subtotal</span>
        <span class="text-lg font-medium text-ink">{{ formatCurrency(cart.subtotal) }}</span>
      </div>

      <RouterLink to="/checkout">
        <Button class="w-full">Checkout</Button>
      </RouterLink>
    </div>
  </section>
</template>
