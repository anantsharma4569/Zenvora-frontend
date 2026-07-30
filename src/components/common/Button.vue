<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | outline
})
</script>

<template>
  <button
    class="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    :class="variant === 'primary'
      ? 'bg-ink text-white hover:bg-pine-700'
      : 'border border-stone-300 text-ink hover:border-ink'"
  >
    <slot />
  </button>
</template>
