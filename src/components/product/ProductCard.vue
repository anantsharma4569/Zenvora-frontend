<script setup>
import { RouterLink } from 'vue-router'
import { Star } from '@lucide/vue'
import { formatCurrency } from '@/utils/currency'
import { useCartStore } from '@/stores/cartStore'

const props = defineProps({
  product: { type: Object, required: true },
})

const cart = useCartStore()

function handleAddToCart(e) {
  e.preventDefault()
  e.stopPropagation()
  cart.addItem(props.product)
}
</script>

<template>
  <RouterLink :to="`/product/${product.name}`" class="group block">
    <div class="relative aspect-[3/4] overflow-hidden rounded-lg bg-stone-200">
      <span
        v-if="product.on_sale"
        class="absolute left-3 top-3 z-10 rounded bg-ink px-2 py-1 text-xs font-medium text-white"
      >
        Sale
      </span>

      <img
        v-if="product.image_1"
        :src="product.image_1"
        :alt="product.product_name"
        class="h-full w-full object-cover transition-opacity duration-300"
        :class="product.image_2 ? 'group-hover:opacity-0' : ''"
      />
      <img
        v-if="product.image_2"
        :src="product.image_2"
        :alt="product.product_name"
        class="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div v-if="!product.image_1" class="flex h-full w-full items-center justify-center text-stone-400">
        No Image
      </div>
    </div>

    <h3 class="mt-3 text-sm font-medium text-ink">{{ product.product_name }}</h3>

    <div v-if="product.review_count" class="mt-1 flex items-center gap-1 text-xs text-stone-500">
      <div class="flex text-pine-600">
        <Star
          v-for="i in 5"
          :key="i"
          class="h-3.5 w-3.5"
          :class="i <= Math.round(product.rating) ? 'fill-pine-600' : 'fill-none text-stone-300'"
        />
      </div>
      <span>({{ product.review_count }})</span>
    </div>

    <p class="mt-1 flex items-center gap-2 text-sm">
      <span
        v-if="product.compare_at_price > product.price"
        class="text-stone-400 line-through"
      >
        {{ formatCurrency(product.compare_at_price) }}
      </span>
      <span class="font-medium text-ink">{{ formatCurrency(product.price) }}</span>
    </p>

    <button
      class="mt-3 w-full rounded-md border border-stone-300 py-2 text-sm font-medium text-ink transition-colors hover:border-ink"
      @click="handleAddToCart"
    >
      Add to Bag
    </button>
  </RouterLink>
</template>
