<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { Star, Heart } from '@lucide/vue'
import { formatCurrency } from '@/utils/currency'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useInventory } from '@/composables/useInventory'

const props = defineProps({
  product: { type: Object, required: true },
})

const cart = useCartStore()
const auth = useAuthStore()
const wishlist = useWishlistStore()
const { getProductStock } = useInventory()
const router = useRouter()
const route = useRoute()

const adding = ref(false)
const quickAddError = ref(null)
const wishlistBusy = ref(false)

onMounted(() => {
  if (auth.isAuthenticated) wishlist.ensureLoaded()
})

async function handleToggleWishlist(e) {
  e.preventDefault()
  e.stopPropagation()

  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  wishlistBusy.value = true
  try {
    await wishlist.toggle(props.product.name)
  } catch {
    // quiet failure — wishlist toggle isn't critical enough to block browsing
  } finally {
    wishlistBusy.value = false
  }
}

async function handleAddToCart(e) {
  e.preventDefault()
  e.stopPropagation()

  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  quickAddError.value = null
  adding.value = true
  try {
    // The card has no size picker — quick-add just grabs whichever size
    // has stock. Anyone who wants a specific size uses the product page.
    const { sizes, stock } = await getProductStock(props.product.name)
    const availableSize = sizes.find((size) => (stock[size] || 0) > 0)
    if (!availableSize) {
      quickAddError.value = 'Out of stock'
      return
    }

    await cart.addItem(props.product, 1, { size: availableSize })
  } catch (err) {
    quickAddError.value = err.message
  } finally {
    adding.value = false
  }
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

      <button
        type="button"
        class="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        :class="wishlist.isWishlisted(product.name) ? 'text-red-500' : ''"
        :disabled="wishlistBusy"
        :aria-label="wishlist.isWishlisted(product.name) ? 'Remove from wishlist' : 'Add to wishlist'"
        @click="handleToggleWishlist"
      >
        <Heart class="h-4 w-4" :class="wishlist.isWishlisted(product.name) ? 'fill-current' : ''" />
      </button>

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
      class="mt-3 w-full rounded-md border border-stone-300 py-2 text-sm font-medium text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="adding"
      @click="handleAddToCart"
    >
      {{ adding ? 'Adding…' : 'Add to Bag' }}
    </button>
    <p v-if="quickAddError" class="mt-1 text-xs text-red-600">{{ quickAddError }}</p>
  </RouterLink>
</template>
