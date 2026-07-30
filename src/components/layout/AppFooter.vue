<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')
const subscribed = ref(false)

function handleSubscribe() {
  if (!email.value) return
  subscribed.value = true
  email.value = ''
  setTimeout(() => (subscribed.value = false), 3000)
}
</script>

<template>
  <footer class="mt-24 border-t border-stone-200">
    <div class="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-6 py-16 sm:grid-cols-4">
      <div class="col-span-2 sm:col-span-1">
        <p class="font-display text-lg font-semibold text-ink">ZENVORA</p>
        <p class="mt-4 text-xs font-medium uppercase tracking-widest text-stone-400">Mission</p>
        <p class="mt-2 max-w-[20ch] text-sm text-stone-600">
          Ethically sourced, crafted for adventure.
        </p>
      </div>

      <div>
        <p class="text-sm font-medium text-ink">Shop</p>
        <ul class="mt-4 space-y-2 text-sm text-stone-600">
          <li><RouterLink to="/shop" class="hover:text-ink">New Arrivals</RouterLink></li>
          <li><RouterLink to="/shop" class="hover:text-ink">All Products</RouterLink></li>
          <li><RouterLink to="/shop" class="hover:text-ink">Collections</RouterLink></li>
        </ul>
      </div>

      <div>
        <p class="text-sm font-medium text-ink">Help</p>
        <ul class="mt-4 space-y-2 text-sm text-stone-600">
          <li><a href="#" class="hover:text-ink">Contact</a></li>
          <li><a href="#" class="hover:text-ink">Shipping</a></li>
          <li><a href="#" class="hover:text-ink">Returns</a></li>
          <li><a href="#" class="hover:text-ink">FAQ</a></li>
        </ul>
      </div>

      <div class="col-span-2 sm:col-span-1">
        <p class="text-sm font-medium text-ink">Connect</p>
        <div class="mt-4 flex gap-4 text-stone-500">
          <a href="#" aria-label="Instagram" class="hover:text-ink">
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="#" aria-label="Facebook" class="hover:text-ink">
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M15 8h2V5h-2c-2.2 0-4 1.8-4 4v2H9v3h2v7h3v-7h2.5l.5-3H14V9c0-.6.4-1 1-1Z" />
            </svg>
          </a>
          <a href="#" aria-label="Pinterest" class="hover:text-ink">
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 17c1-3.5 1.8-6.2 2.3-8.2.4-1.5 2.6-1.4 3 .3.2 1-.2 2.4-.7 4-.5 1.6.7 2.9 2.2 2.4 2-.7 2.7-3.1 2.2-5-.6-2.4-3-3.7-5.5-3.3-2.8.5-4.3 3-3.7 5.6" />
            </svg>
          </a>
        </div>

        <p class="mt-6 text-xs font-medium uppercase tracking-widest text-stone-400">Newsletter</p>
        <form class="mt-2 flex gap-2" @submit.prevent="handleSubscribe">
          <input
            v-model="email"
            type="email"
            placeholder="Your email"
            class="w-full min-w-0 rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            class="shrink-0 rounded-md bg-ink px-3 py-2 text-sm font-medium text-white hover:bg-pine-700"
          >
            {{ subscribed ? '✓' : 'Join' }}
          </button>
        </form>
      </div>
    </div>

    <div class="border-t border-stone-200 py-6">
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 text-xs text-stone-500 sm:flex-row sm:justify-between">
        <p>© {{ new Date().getFullYear() }} Zenvora. All rights reserved.</p>
        <div class="flex gap-4">
          <a href="#" class="hover:text-ink">Terms & Conditions</a>
          <a href="#" class="hover:text-ink">Privacy Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>
