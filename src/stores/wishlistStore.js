import { defineStore } from 'pinia'
import { frappeCall } from '@/utils/call'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [],
    loaded: false,
    loading: false,
  }),

  getters: {
    ids: (state) => new Set(state.items.map((i) => i.product)),
  },

  actions: {
    isWishlisted(product) {
      return this.ids.has(product)
    },

    async fetch() {
      this.loading = true
      try {
        this.items = await frappeCall.method('zenvora.api.wishlist.get_wishlist')
        this.loaded = true
      } finally {
        this.loading = false
      }
    },

    // Cheap to call from every ProductCard's onMounted — only hits the
    // network once per session (or since the last reset/toggle miss).
    async ensureLoaded() {
      if (this.loaded || this.loading) return
      await this.fetch()
    },

    async toggle(product) {
      const data = await frappeCall.postMethod('zenvora.api.wishlist.toggle_wishlist', { product })
      this.items = data.items
      this.loaded = true
      return data.wishlisted
    },

    async remove(name) {
      this.items = await frappeCall.postMethod('zenvora.api.wishlist.remove_from_wishlist', { name })
    },

    // called on logout — the wishlist belongs to the account, not the browser
    reset() {
      this.items = []
      this.loaded = false
    },
  },
})
