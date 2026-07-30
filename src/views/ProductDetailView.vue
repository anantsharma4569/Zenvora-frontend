<script setup>
import { ref, onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/utils/currency'
import Button from '@/components/common/Button.vue'

const props = defineProps({
  id: { type: String, required: true },
})

const { fetchProduct } = useProducts()
const cart = useCartStore()

const product = ref(null)
const loading = ref(true)
const error = ref(null)
const added = ref(false)

onMounted(async () => {
  try {
    product.value = await fetchProduct(props.id)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

function handleAddToCart() {
  cart.addItem(product.value)
  added.value = true
  setTimeout(() => (added.value = false), 1500)
}
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-16">
    <p v-if="loading" class="text-stone-500">Loading…</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else-if="product" class="grid grid-cols-1 gap-12 sm:grid-cols-2">
      <div class="aspect-[3/4] overflow-hidden rounded-lg bg-stone-200">
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.item_name"
          class="h-full w-full object-cover"
        />
      </div>

      <div>
        <h1 class="font-display text-3xl font-semibold text-ink">{{ product.item_name }}</h1>
        <p class="mt-2 text-lg text-stone-600">{{ formatCurrency(product.standard_rate) }}</p>
        <p class="mt-6 text-stone-600">{{ product.description }}</p>

        <Button class="mt-8" @click="handleAddToCart">
          {{ added ? 'Added to Bag ✓' : 'Add to Bag' }}
        </Button>
      </div>
    </div>
  </section>
</template>
