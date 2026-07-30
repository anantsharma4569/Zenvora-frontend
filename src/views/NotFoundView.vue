<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="mx-auto max-w-xl px-6 py-24 text-center">
    <h1 class="font-display text-3xl font-semibold text-ink">404</h1>
    <p class="mt-2 text-stone-500">This page doesn't exist.</p>
    <RouterLink to="/" class="mt-6 inline-block text-pine-600 underline">Back to Home</RouterLink>
  </section>
</template>
