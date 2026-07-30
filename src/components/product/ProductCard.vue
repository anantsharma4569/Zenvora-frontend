<script setup>
import { RouterLink } from 'vue-router'
import { formatCurrency } from '@/utils/currency'

defineProps({
  product: { type: Object, required: true },
})
</script>

<template>
  <RouterLink :to="`/product/${product.item_code}`" class="group block">
    <div class="aspect-[3/4] overflow-hidden rounded-lg bg-stone-200">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.item_name"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div v-else class="flex h-full w-full items-center justify-center text-stone-400">
        No Image
      </div>
    </div>
    <h3 class="mt-3 text-sm font-medium text-ink">{{ product.item_name }}</h3>
    <p class="mt-1 text-sm text-stone-500">{{ formatCurrency(product.standard_rate) }}</p>
  </RouterLink>
</template>
