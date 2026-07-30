<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCategories } from '@/composables/useCategories'

const { categories, loading, fetchCategories } = useCategories()

onMounted(() => fetchCategories())
</script>

<template>
  <section class="mx-auto flex max-w-6xl flex-col items-start px-6 py-24">
    <p class="text-sm font-medium uppercase tracking-widest text-pine-600">New Season</p>
    <h1 class="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
      Considered clothing, made to last.
    </h1>
    <p class="mt-4 max-w-md text-stone-600">
      Zenvora is a minimalist apparel label focused on quality fabrics and quiet design.
    </p>
    <RouterLink
      to="/shop"
      class="mt-8 inline-flex items-center justify-center rounded-md bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-pine-700"
    >
      Shop the Collection
    </RouterLink>
  </section>

  <section class="mx-auto max-w-6xl px-6 pb-24">
    <h2 class="text-sm font-medium uppercase tracking-widest text-stone-500">Shop by Category</h2>

    <p v-if="loading" class="mt-4 text-stone-500">Loading categories…</p>

    <div v-else class="mt-4 flex flex-wrap gap-3">
      <RouterLink
        v-for="cat in categories"
        :key="cat.name"
        :to="{ path: '/shop', query: { category: cat.name } }"
        class="rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
      >
        {{ cat.category_name }}
      </RouterLink>
    </div>
  </section>
</template>
