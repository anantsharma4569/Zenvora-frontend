<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Truck, RefreshCw, ShieldCheck, Tag, Leaf, MapPin, Heart } from '@lucide/vue'
import { useCategories } from '@/composables/useCategories'
import { useProducts } from '@/composables/useProducts'
import { useSiteSettings } from '@/composables/useSiteSettings'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton.vue'
import CategorySection from '@/components/product/CategorySection.vue'

const { categories, fetchCategories } = useCategories()
const { products, loading: productsLoading, fetchProducts } = useProducts()
const { settings, fetchSettings } = useSiteSettings()

const kurtis = useProducts()
const sarees = useProducts()
const tops = useProducts()

onMounted(() => {
  fetchCategories()
  fetchProducts({ limit: 12 })
  fetchSettings()
  kurtis.fetchProducts({ category: 'Kurtis', limit: 4 })
  sarees.fetchProducts({ category: 'Sarees', limit: 4 })
  tops.fetchProducts({ category: 'Tops', limit: 4 })
})
</script>

<template>
  <div>
    <div
      class="flex flex-wrap items-center justify-center gap-x-10 gap-y-1 bg-ink px-4 py-2 text-center text-xs text-white"
    >
      <span>Free Shipping on orders above ₹999</span>
      <span>Easy 14-day returns</span>
      <span>Get 10% off your first order – Use code: WELCOME10</span>
    </div>

    <section class="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-6 py-16 lg:flex-row lg:py-24">
      <div class="flex-1">
        <p class="text-sm font-medium uppercase tracking-widest text-pine-600">New Season</p>
        <h1 class="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Considered clothing, made to last.
        </h1>
        <p class="mt-4 max-w-md text-stone-600">
          Zenvora is a minimalist apparel label focused on quality fabrics and quiet design.
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink
            to="/shop"
            class="inline-flex items-center justify-center rounded-md bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-pine-700"
          >
            Shop the Collection
          </RouterLink>
          <RouterLink
            to="/shop"
            class="inline-flex items-center justify-center rounded-md border border-stone-300 px-6 py-3 text-sm font-medium text-ink hover:border-ink"
          >
            Explore New Arrivals
          </RouterLink>
        </div>

        <div class="mt-10 flex flex-wrap gap-x-8 gap-y-4">
          <div class="flex items-center gap-2">
            <Truck class="h-5 w-5 shrink-0 text-pine-600" />
            <div>
              <p class="text-sm font-semibold text-ink">Free Shipping</p>
              <p class="text-xs text-stone-500">on orders above ₹999</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <RefreshCw class="h-5 w-5 shrink-0 text-pine-600" />
            <div>
              <p class="text-sm font-semibold text-ink">Easy Returns</p>
              <p class="text-xs text-stone-500">14-day return policy</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <ShieldCheck class="h-5 w-5 shrink-0 text-pine-600" />
            <div>
              <p class="text-sm font-semibold text-ink">Secure Payments</p>
              <p class="text-xs text-stone-500">100% protected checkout</p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full flex-1">
        <div class="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-200">
          <img
            v-if="settings?.home_hero_image"
            :src="settings.home_hero_image"
            :alt="settings.home_hero_image_alt_text || 'Zenvora'"
            class="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>

    <section v-if="categories.length" class="mx-auto max-w-6xl px-6 pb-16">
      <h2 class="text-center text-sm font-medium uppercase tracking-widest text-stone-500">Shop by Category</h2>
      <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <RouterLink
          v-for="cat in categories"
          :key="cat.name"
          :to="{ path: '/shop', query: { category: cat.name } }"
          class="group block"
        >
          <div class="aspect-[3/4] overflow-hidden rounded-lg bg-stone-200">
            <img
              v-if="cat.image"
              :src="cat.image"
              :alt="cat.category_name"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <p class="mt-2 text-sm font-semibold text-ink">{{ cat.category_name }}</p>
          <p class="text-xs text-stone-500">Explore Now &rarr;</p>
        </RouterLink>

        <RouterLink to="/shop" class="group block">
          <div class="aspect-[3/4] overflow-hidden rounded-lg bg-ink"></div>
          <p class="mt-2 text-sm font-semibold text-ink">New Arrivals</p>
          <p class="text-xs text-stone-500">Explore Now &rarr;</p>
        </RouterLink>
      </div>
    </section>

    <CategorySection title="Kurtis" category="Kurtis" :products="kurtis.products.value" :loading="kurtis.loading.value" />
    <CategorySection title="Sarees" category="Sarees" :products="sarees.products.value" :loading="sarees.loading.value" />
    <CategorySection title="Tops" category="Tops" :products="tops.products.value" :loading="tops.loading.value" />

    <section class="border-y border-stone-200">
      <div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex items-center gap-3">
          <Tag class="h-6 w-6 shrink-0 text-pine-600" />
          <div>
            <p class="text-sm font-semibold text-ink">Premium Quality</p>
            <p class="text-xs text-stone-500">Carefully selected fabrics</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Leaf class="h-6 w-6 shrink-0 text-pine-600" />
          <div>
            <p class="text-sm font-semibold text-ink">Sustainable Fashion</p>
            <p class="text-xs text-stone-500">Eco-friendly practices</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <MapPin class="h-6 w-6 shrink-0 text-pine-600" />
          <div>
            <p class="text-sm font-semibold text-ink">Designed in India</p>
            <p class="text-xs text-stone-500">Thoughtfully crafted</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Heart class="h-6 w-6 shrink-0 text-pine-600" />
          <div>
            <p class="text-sm font-semibold text-ink">Loved by 10K+ Customers</p>
            <p class="text-xs text-stone-500">Trust and style combined</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-16">
      <h2 class="font-display text-2xl font-semibold text-ink">New Arrivals</h2>

      <p v-if="productsLoading" class="mt-6 text-stone-500">Loading products…</p>

      <div v-else class="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        <ProductCard v-for="product in products" :key="product.name" :product="product" />
      </div>

      <p v-if="!productsLoading && !products.length" class="mt-6 text-stone-500">
        New arrivals are on their way — check back soon.
      </p>
    </section>
  </div>
</template>
