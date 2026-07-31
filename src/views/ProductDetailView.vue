<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { formatCurrency } from '@/utils/currency'
import Button from '@/components/common/Button.vue'
import ReviewSection from '@/components/product/ReviewSection.vue'

const props = defineProps({
  id: { type: String, required: true },
})

const SWATCHES = [
  { label: 'Sand', class: 'bg-stone-300' },
  { label: 'Olive', class: 'bg-pine-700' },
  { label: 'Cream', class: 'bg-stone-100' },
]
const SIZES = ['S', 'M', 'L', 'XL']

const { fetchProduct } = useProducts()
const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const product = ref(null)
const loading = ref(true)
const error = ref(null)
const added = ref(false)
const addError = ref(null)
const activeImage = ref(null)
const selectedColor = ref(SWATCHES[0].label)
const selectedSize = ref(null)

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

async function handleAddToCart() {
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  addError.value = null
  try {
    await cart.addItem(product.value, 1, { color: selectedColor.value, size: selectedSize.value })
    added.value = true
    setTimeout(() => (added.value = false), 1500)
  } catch (e) {
    addError.value = e.message
  }
}
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-10 sm:py-16">
    <p v-if="loading" class="text-stone-500">Loading…</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else-if="product" class="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12">
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
        <h1 class="font-display text-2xl font-semibold text-ink sm:text-3xl">{{ product.product_name }}</h1>

        <p class="mt-2 flex items-center gap-2 text-lg">
          <span v-if="product.compare_at_price > product.price" class="text-stone-400 line-through">
            {{ formatCurrency(product.compare_at_price) }}
          </span>
          <span class="font-medium text-ink">{{ formatCurrency(product.price) }}</span>
        </p>

        <div
          v-if="product.description"
          class="mt-6 space-y-3 text-stone-600 [&_a]:underline [&_li]:ml-4 [&_li]:list-disc [&_strong]:font-medium"
          v-html="product.description"
        />

        <div class="mt-8">
          <p class="text-sm font-medium text-ink">Color palette</p>
          <div class="mt-2 flex gap-2">
            <button
              v-for="swatch in SWATCHES"
              :key="swatch.label"
              type="button"
              :aria-label="swatch.label"
              :title="swatch.label"
              class="h-8 w-8 rounded-md border-2"
              :class="[swatch.class, selectedColor === swatch.label ? 'border-ink' : 'border-transparent']"
              @click="selectedColor = swatch.label"
            />
          </div>
        </div>

        <div class="mt-6">
          <p class="text-sm font-medium text-ink">Size</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="size in SIZES"
              :key="size"
              type="button"
              class="h-10 min-w-[2.5rem] rounded-md border px-3 text-sm font-medium transition-colors"
              :class="
                selectedSize === size
                  ? 'border-ink bg-ink text-white'
                  : 'border-stone-300 text-ink hover:border-ink'
              "
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <Button class="mt-8 w-full sm:w-auto" @click="handleAddToCart">
          {{ added ? 'Added to Bag ✓' : 'Add to Bag' }}
        </Button>
        <p v-if="addError" class="mt-2 text-sm text-red-600">{{ addError }}</p>

        <ul class="mt-8 space-y-1.5 border-t border-stone-200 pt-6 text-sm text-stone-600">
          <li class="flex gap-2">
            <span class="text-stone-400">•</span>
            Ethically sourced materials, certified for quality and sustainability.
          </li>
          <li class="flex gap-2">
            <span class="text-stone-400">•</span>
            Made by fair-wage artisans.
          </li>
        </ul>
      </div>
    </div>

    <ReviewSection v-if="product" :product="product.name" />
  </section>
</template>
