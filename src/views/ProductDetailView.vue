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
const activeImage = ref(null)

onMounted(async () => {
  try {
    product.value = await fetchProduct(props.id)
    activeImage.value = product.value.image_1
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
      <div>
        <div class="aspect-[3/4] overflow-hidden rounded-lg bg-stone-200">
          <img
            v-if="activeImage"
            :src="activeImage"
            :alt="product.product_name"
            class="h-full w-full object-cover"
          />
        </div>
        <div v-if="product.image_1 && product.image_2" class="mt-3 flex gap-3">
          <button
            v-for="img in [product.image_1, product.image_2]"
            :key="img"
            class="h-20 w-16 overflow-hidden rounded border-2"
            :class="activeImage === img ? 'border-ink' : 'border-transparent'"
            @click="activeImage = img"
          >
            <img :src="img" :alt="product.product_name" class="h-full w-full object-cover" />
          </button>
        </div>
      </div>

      <div>
        <h1 class="font-display text-3xl font-semibold text-ink">{{ product.product_name }}</h1>

        <p class="mt-2 flex items-center gap-2 text-lg">
          <span v-if="product.compare_at_price > product.price" class="text-stone-400 line-through">
            {{ formatCurrency(product.compare_at_price) }}
          </span>
          <span class="font-medium text-ink">{{ formatCurrency(product.price) }}</span>
        </p>

        <p class="mt-6 text-stone-600">{{ product.description }}</p>

        <Button class="mt-8" @click="handleAddToCart">
          {{ added ? 'Added to Bag ✓' : 'Add to Bag' }}
        </Button>
      </div>
    </div>
  </section>
</template>
