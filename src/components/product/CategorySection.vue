<script setup>
import { RouterLink } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton.vue'

defineProps({
  title: { type: String, required: true },
  category: { type: String, required: true },
  products: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
</script>

<template>
  <section v-if="loading || products.length" class="mx-auto max-w-6xl px-6 py-12">
    <div class="flex items-center justify-between">
      <h2 class="font-display text-2xl font-semibold text-ink">{{ title }}</h2>
      <RouterLink
        :to="{ path: '/shop', query: { category } }"
        class="text-sm font-medium text-pine-600 hover:underline"
      >
        View All &rarr;
      </RouterLink>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      <template v-if="loading">
        <ProductCardSkeleton v-for="i in 4" :key="i" />
      </template>
      <ProductCard v-else v-for="product in products" :key="product.name" :product="product" />
    </div>
  </section>
</template>
