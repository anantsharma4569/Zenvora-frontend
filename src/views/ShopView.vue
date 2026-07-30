<script setup>
import { onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'
import ProductCard from '@/components/product/ProductCard.vue'

const { products, loading, error, fetchProducts } = useProducts()

onMounted(() => fetchProducts())
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-16">
    <h1 class="font-display text-2xl font-semibold text-ink">Shop</h1>

    <p v-if="loading" class="mt-8 text-stone-500">Loading products…</p>
    <p v-else-if="error" class="mt-8 text-red-600">{{ error }}</p>
    <p v-else-if="!products.length" class="mt-8 text-stone-500">
      No products yet — add Items in your Frappe backend to see them here.
    </p>

    <div v-else class="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
      <ProductCard v-for="product in products" :key="product.item_code" :product="product" />
    </div>
  </section>
</template>
