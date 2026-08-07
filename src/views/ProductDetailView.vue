<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useInventory } from '@/composables/useInventory'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { formatCurrency } from '@/utils/currency'
import Button from '@/components/common/Button.vue'
import ReviewSection from '@/components/product/ReviewSection.vue'
import { Heart } from '@lucide/vue'

const props = defineProps({
  id: { type: String, required: true },
})

const SWATCHES = [
  { label: 'Sand', class: 'bg-stone-300' },
  { label: 'Olive', class: 'bg-pine-700' },
  { label: 'Cream', class: 'bg-stone-100' },
]

// Display-only abbreviations for the full Item Attribute values the backend
// actually deals with (must match the "Size" Item Attribute's own abbr set).
const SIZE_LABELS = { Small: 'S', Medium: 'M', Large: 'L', 'Extra Large': 'XL' }

const { fetchProduct } = useProducts()
const { getProductStock } = useInventory()
const cart = useCartStore()
const auth = useAuthStore()
const wishlist = useWishlistStore()
const router = useRouter()
const route = useRoute()

const product = ref(null)
const loading = ref(true)
const error = ref(null)
const added = ref(false)
const addError = ref(null)
const wishlistBusy = ref(false)
const activeImage = ref(null)
const selectedColor = ref(SWATCHES[0].label)
const selectedSize = ref(null)

const galleryImages = ref([])
const sizes = ref([])
const stockBySize = ref({})
const inStock = ref(true)

onMounted(async () => {
  if (auth.isAuthenticated) wishlist.ensureLoaded()

  // Guards every write below: if the user has already navigated away from
  // this product (e.g. clicked the logo before the fetch resolved), this
  // stale response should neither overwrite the new page's document.title
  // nor flash old product data into state.
  const requestedId = props.id

  try {
    const fetchedProduct = await fetchProduct(props.id)
    if (props.id !== requestedId) return
    product.value = fetchedProduct

    // Gallery Images (product manager can add as many as they like) takes
    // priority; fall back to the primary/secondary pair for older products
    // that haven't been given a full gallery yet.
    const gallery = (product.value.images || []).map((row) => row.image).filter(Boolean)
    galleryImages.value = gallery.length
      ? gallery
      : [product.value.image_1, product.value.image_2].filter(Boolean)

    activeImage.value = galleryImages.value[0] || null
    document.title = `${product.value.product_name} — Zenvora`

    const stockInfo = await getProductStock(props.id)
    if (props.id !== requestedId) return
    sizes.value = stockInfo.sizes
    stockBySize.value = stockInfo.stock
    inStock.value = stockInfo.in_stock
  } catch (e) {
    if (props.id === requestedId) error.value = e.message
  } finally {
    if (props.id === requestedId) loading.value = false
  }
})

function isSizeAvailable(size) {
  return (stockBySize.value[size] || 0) > 0
}

const buyingNow = ref(false)

function validateSelection() {
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return false
  }

  if (!selectedSize.value) {
    addError.value = 'Please select a size'
    return false
  }

  addError.value = null
  return true
}

const addingToBag = ref(false)

async function handleAddToCart() {
  if (addingToBag.value || !validateSelection()) return

  addingToBag.value = true
  try {
    await cart.addItem(product.value, 1, { color: selectedColor.value, size: selectedSize.value })
    added.value = true
    setTimeout(() => (added.value = false), 1500)
  } catch (e) {
    addError.value = e.message
  } finally {
    addingToBag.value = false
  }
}

async function handleToggleWishlist() {
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  wishlistBusy.value = true
  try {
    await wishlist.toggle(product.value.name)
  } catch (e) {
    addError.value = e.message
  } finally {
    wishlistBusy.value = false
  }
}

async function handleBuyNow() {
  if (buyingNow.value || addingToBag.value || !validateSelection()) return

  buyingNow.value = true
  try {
    await cart.addItem(product.value, 1, { color: selectedColor.value, size: selectedSize.value })
    router.push({ name: 'checkout' })
  } catch (e) {
    addError.value = e.message
    buyingNow.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-10 sm:py-16">
    <div v-if="loading" class="grid animate-pulse grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12">
      <div class="aspect-[3/4] rounded-lg bg-stone-200"></div>
      <div>
        <div class="h-7 w-2/3 rounded bg-stone-200"></div>
        <div class="mt-4 h-5 w-1/4 rounded bg-stone-200"></div>
        <div class="mt-8 h-4 w-full rounded bg-stone-200"></div>
        <div class="mt-2 h-4 w-5/6 rounded bg-stone-200"></div>
        <div class="mt-10 h-10 w-40 rounded-md bg-stone-200"></div>
      </div>
    </div>
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
        <div v-if="galleryImages.length > 1" class="mt-3 flex flex-wrap gap-3">
          <button
            v-for="img in galleryImages"
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
        <div class="flex items-start justify-between gap-4">
          <h1 class="font-display text-2xl font-semibold text-ink sm:text-3xl">{{ product.product_name }}</h1>
          <button
            type="button"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-300 text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            :class="wishlist.isWishlisted(product.name) ? 'border-red-200 text-red-500' : ''"
            :disabled="wishlistBusy"
            :aria-label="wishlist.isWishlisted(product.name) ? 'Remove from wishlist' : 'Add to wishlist'"
            @click="handleToggleWishlist"
          >
            <Heart class="h-5 w-5" :class="wishlist.isWishlisted(product.name) ? 'fill-current' : ''" />
          </button>
        </div>

        <p class="mt-2 flex items-center gap-2 text-lg">
          <span v-if="product.compare_at_price > product.price" class="text-stone-400 line-through">
            {{ formatCurrency(product.compare_at_price) }}
          </span>
          <span class="font-medium text-ink">{{ formatCurrency(product.price) }}</span>
        </p>

        <p v-if="!loading && !inStock" class="mt-2 inline-block rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
          Out of Stock
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
              v-for="size in sizes"
              :key="size"
              type="button"
              :disabled="!isSizeAvailable(size)"
              :title="isSizeAvailable(size) ? size : `${size} — out of stock`"
              class="h-10 min-w-[2.5rem] rounded-md border px-3 text-sm font-medium transition-colors"
              :class="
                !isSizeAvailable(size)
                  ? 'cursor-not-allowed border-stone-200 text-stone-300 line-through'
                  : selectedSize === size
                    ? 'border-ink bg-ink text-white'
                    : 'border-stone-300 text-ink hover:border-ink'
              "
              @click="selectedSize = size"
            >
              {{ SIZE_LABELS[size] || size }}
            </button>
          </div>
        </div>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button class="w-full sm:w-auto" :disabled="!inStock || addingToBag || buyingNow" @click="handleAddToCart">
            {{ added ? 'Added to Bag ✓' : addingToBag ? 'Adding…' : !inStock ? 'Out of Stock' : 'Add to Bag' }}
          </Button>
          <Button
            variant="outline"
            class="w-full sm:w-auto"
            :disabled="!inStock || buyingNow || addingToBag"
            @click="handleBuyNow"
          >
            {{ buyingNow ? 'Processing…' : 'Buy Now' }}
          </Button>
        </div>
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
