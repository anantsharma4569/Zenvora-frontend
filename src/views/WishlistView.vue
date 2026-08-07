<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Heart } from '@lucide/vue'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/utils/currency'
import AccountSidebar from '@/components/account/AccountSidebar.vue'

const wishlist = useWishlistStore()
const cart = useCartStore()

const error = ref(null)

async function handleRemove(name) {
  await wishlist.remove(name)
}

async function handleAddToCart(item) {
  try {
    await cart.addItem({ name: item.product, product_name: item.product_name, image_1: item.image, price: item.price })
  } catch {
    // errors surface on the bag page itself; keep the wishlist card quiet
  }
}

onMounted(async () => {
  try {
    // ensureLoaded (not fetch) — a ProductCard elsewhere may have already
    // populated the store; re-fetching unconditionally here just flashes a
    // "Loading…" state over data that was already correct.
    await wishlist.ensureLoaded()
  } catch (e) {
    error.value = e.message
  }
})
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-10">
    <div class="flex flex-col gap-8 sm:flex-row">
      <AccountSidebar />

      <div class="min-w-0 flex-1">
        <h1 class="font-display text-2xl font-semibold text-ink">Wishlist</h1>

        <p v-if="wishlist.loading" class="mt-8 text-stone-500">Loading…</p>
        <p v-else-if="error" class="mt-8 text-red-600">{{ error }}</p>
        <p v-else-if="!wishlist.items.length" class="mt-8 text-stone-500">
          Nothing saved yet. <RouterLink to="/shop" class="text-pine-600 underline">Browse products</RouterLink>
        </p>

        <div v-else class="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-3">
          <div v-for="item in wishlist.items" :key="item.name" class="group relative">
            <button
              class="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow"
              :aria-label="`Remove ${item.product_name} from wishlist`"
              @click="handleRemove(item.name)"
            >
              <Heart class="h-4 w-4 fill-current" />
            </button>
            <RouterLink :to="`/product/${item.product}`" class="block">
              <div class="aspect-[3/4] overflow-hidden rounded-lg bg-stone-200">
                <img v-if="item.image" :src="item.image" :alt="item.product_name" class="h-full w-full object-cover" />
              </div>
              <h3 class="mt-3 text-sm font-medium text-ink">{{ item.product_name }}</h3>
              <p class="mt-1 text-sm font-medium text-ink">{{ formatCurrency(item.price) }}</p>
            </RouterLink>
            <button
              class="mt-2 w-full rounded-md border border-stone-300 py-2 text-sm font-medium text-ink hover:border-ink"
              @click="handleAddToCart(item)"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
