<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ShoppingBag, User, ChevronDown, Menu, X, Heart, Search } from '@lucide/vue'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useCategories } from '@/composables/useCategories'

const cart = useCartStore()
const auth = useAuthStore()
const { categories, fetchCategories } = useCategories()
const router = useRouter()

const categoriesOpen = ref(false)
const mobileMenuOpen = ref(false)
const headerEl = ref(null)
const searchQuery = ref('')
const mobileSearchQuery = ref('')

function submitSearch(query) {
  const trimmed = query.trim()
  if (!trimmed) return
  router.push({ path: '/shop', query: { search: trimmed } })
  mobileMenuOpen.value = false
}

onMounted(() => {
  fetchCategories()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(e) {
  if (headerEl.value && !headerEl.value.contains(e.target)) {
    categoriesOpen.value = false
  }
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header ref="headerEl" class="sticky top-0 z-20 border-b border-stone-200 bg-stone-50/95 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
      <RouterLink to="/" class="font-display text-xl font-semibold tracking-wide text-ink" @click="closeMobileMenu">
        ZENVORA
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-2 lg:flex">
        <div class="relative">
          <button
            class="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-ink"
            @click="categoriesOpen = !categoriesOpen"
          >
            Categories
            <ChevronDown class="h-4 w-4 transition-transform" :class="categoriesOpen ? 'rotate-180' : ''" />
          </button>

          <div
            v-if="categoriesOpen"
            class="absolute left-0 top-full mt-2 w-56 rounded-lg border border-stone-200 bg-stone-50 py-2 shadow-lg"
          >
            <RouterLink
              to="/shop"
              class="block px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 hover:text-ink"
              @click="categoriesOpen = false"
            >
              All Products
            </RouterLink>
            <RouterLink
              v-for="cat in categories"
              :key="cat.name"
              :to="{ path: '/shop', query: { category: cat.name } }"
              class="block px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 hover:text-ink"
              @click="categoriesOpen = false"
            >
              {{ cat.category_name }}
            </RouterLink>
          </div>
        </div>

        <RouterLink
          v-for="cat in categories.slice(0, 4)"
          :key="cat.name"
          :to="{ path: '/shop', query: { category: cat.name } }"
          class="rounded-full border border-stone-300 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-stone-600 transition-colors hover:border-ink hover:text-ink"
        >
          {{ cat.category_name }}
        </RouterLink>
      </nav>

      <form
        class="relative hidden w-full max-w-xs items-center md:flex"
        @submit.prevent="submitSearch(searchQuery)"
      >
        <Search class="pointer-events-none absolute left-3 h-4 w-4 text-stone-400" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search products…"
          class="w-full rounded-full border border-stone-300 bg-stone-50 py-1.5 pl-9 pr-3 text-sm text-ink placeholder:text-stone-400 focus:border-ink focus:outline-none"
        />
      </form>

      <div class="flex items-center gap-5">
        <RouterLink
          :to="auth.isAuthenticated ? '/account' : '/login'"
          class="flex items-center gap-2 text-ink"
        >
          <User class="h-5 w-5" />
          <span class="hidden text-sm font-medium sm:inline">
            {{ auth.isAuthenticated ? auth.user?.full_name : 'Log In' }}
          </span>
        </RouterLink>

        <RouterLink :to="auth.isAuthenticated ? '/wishlist' : '/login'" class="flex items-center gap-2 text-ink">
          <Heart class="h-5 w-5" />
        </RouterLink>

        <RouterLink to="/cart" class="relative flex items-center gap-2 text-ink">
          <ShoppingBag class="h-5 w-5" />
          <span
            v-if="cart.itemCount"
            class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pine-600 text-xs text-white"
          >
            {{ cart.itemCount }}
          </span>
        </RouterLink>

        <button class="text-ink lg:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
          <Menu v-if="!mobileMenuOpen" class="h-6 w-6" />
          <X v-else class="h-6 w-6" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="border-t border-stone-200 bg-stone-50 px-6 py-4 lg:hidden">
      <form class="relative flex items-center md:hidden" @submit.prevent="submitSearch(mobileSearchQuery)">
        <Search class="pointer-events-none absolute left-3 h-4 w-4 text-stone-400" />
        <input
          v-model="mobileSearchQuery"
          type="search"
          placeholder="Search products…"
          class="w-full rounded-full border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-stone-400 focus:border-ink focus:outline-none"
        />
      </form>

      <p class="mt-4 text-xs font-medium uppercase tracking-widest text-stone-400">Categories</p>
      <nav class="mt-3 flex flex-col gap-1">
        <RouterLink
          to="/shop"
          class="rounded-md px-2 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-ink"
          @click="closeMobileMenu"
        >
          All Products
        </RouterLink>
        <RouterLink
          v-for="cat in categories"
          :key="cat.name"
          :to="{ path: '/shop', query: { category: cat.name } }"
          class="rounded-md px-2 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-ink"
          @click="closeMobileMenu"
        >
          {{ cat.category_name }}
        </RouterLink>
      </nav>

      <div class="mt-4 border-t border-stone-200 pt-4">
        <RouterLink
          :to="auth.isAuthenticated ? '/account' : '/login'"
          class="flex items-center gap-2 text-sm font-medium text-ink hover:text-pine-700"
          @click="closeMobileMenu"
        >
          <User class="h-4 w-4" />
          {{ auth.isAuthenticated ? 'My Account' : 'Log In' }}
        </RouterLink>
      </div>
    </div>
  </header>
</template>
