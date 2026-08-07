<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useCategories } from '@/composables/useCategories'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton.vue'

const route = useRoute()
const activeCategory = computed(() => route.query.category || null)
const activeSearch = computed(() => route.query.search || null)

const { products, loading, error, hasMore, fetchProducts, loadMore } = useProducts()
const { categories, fetchCategories } = useCategories()

function load() {
  fetchProducts({ category: activeCategory.value, search: activeSearch.value })
}

onMounted(() => {
  fetchCategories()
  load()
})

watch([activeCategory, activeSearch], load)
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-16">
    <h1 class="font-display text-2xl font-semibold text-ink">
      {{ activeSearch ? `Search results for "${activeSearch}"` : activeCategory || 'Shop' }}
    </h1>

    <div class="mt-4 flex flex-wrap gap-3">
      <RouterLink
        :to="{ path: '/shop' }"
        class="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
        :class="!activeCategory ? 'border-ink bg-ink text-white' : 'border-stone-300 text-ink hover:border-ink'"
      >
        All
      </RouterLink>
      <RouterLink
        v-for="cat in categories"
        :key="cat.name"
        :to="{ path: '/shop', query: { category: cat.name } }"
        class="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
        :class="activeCategory === cat.name ? 'border-ink bg-ink text-white' : 'border-stone-300 text-ink hover:border-ink'"
      >
        {{ cat.category_name }}
      </RouterLink>
    </div>

    <p v-if="error" class="mt-8 text-red-600">{{ error }}</p>
    <p v-else-if="!loading && !products.length" class="mt-8 text-stone-500">
      {{ activeSearch ? 'No products matched your search.' : 'No products in this category yet.' }}
    </p>

    <div v-else class="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
      <template v-if="loading && !products.length">
        <ProductCardSkeleton v-for="i in 8" :key="i" />
      </template>
      <ProductCard v-for="product in products" :key="product.name" :product="product" />
    </div>

    <div v-if="hasMore" class="mt-10 flex justify-center">
      <button
        class="rounded-md border border-stone-300 px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="loading"
        @click="loadMore"
      >
        {{ loading ? 'Loading…' : 'Load More' }}
      </button>
    </div>
  </section>
</template>
