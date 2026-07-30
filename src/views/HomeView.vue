<script setup>
import { RouterLink } from 'vue-router'
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
</template>
