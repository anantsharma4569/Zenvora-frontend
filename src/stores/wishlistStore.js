import { defineStore } from 'pinia'
import { frappeCall } from '@/utils/call'

// Shared across every ProductCard's ensureLoaded() call so the second+
// concurrent caller awaits the SAME in-flight fetch instead of firing its
// own redundant request.
let inFlightFetch = null

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [],
    loaded: false,
    loading: false,
    // Sequence number of the last write applied to `items`. Every action
    // that can write `items` grabs the next number when it STARTS, and only
    // applies its result if no newer action has started since — so a slow
    // fetch() that started before a toggle() can't clobber the toggle's
    // result just because its response happens to arrive later.
    _seq: 0,
    _appliedSeq: 0,
  }),

  getters: {
    ids: (state) => new Set(state.items.map((i) => i.product)),
  },

  actions: {
    isWishlisted(product) {
      return this.ids.has(product)
    },

    _apply(id, items) {
      if (id > this._appliedSeq) {
        this.items = items
        this._appliedSeq = id
      }
    },

    async fetch() {
      const id = ++this._seq
      this.loading = true
      try {
        const items = await frappeCall.method('zenvora.api.wishlist.get_wishlist')
        this._apply(id, items)
        this.loaded = true
      } finally {
        this.loading = false
      }
    },

    // Cheap to call from every ProductCard's onMounted — only hits the
    // network once per session (or since the last reset/toggle miss), and
    // concurrent callers share one in-flight request instead of racing.
    async ensureLoaded() {
      if (this.loaded) return
      if (!inFlightFetch) {
        inFlightFetch = this.fetch().finally(() => {
          inFlightFetch = null
        })
      }
      return inFlightFetch
    },

    async toggle(product) {
      const id = ++this._seq
      const data = await frappeCall.postMethod('zenvora.api.wishlist.toggle_wishlist', { product })
      this._apply(id, data.items)
      this.loaded = true
      return data.wishlisted
    },

    async remove(name) {
      const id = ++this._seq
      const items = await frappeCall.postMethod('zenvora.api.wishlist.remove_from_wishlist', { name })
      this._apply(id, items)
    },

    // called on logout — the wishlist belongs to the account, not the browser
    reset() {
      this.items = []
      this.loaded = false
      this._seq = 0
      this._appliedSeq = 0
    },
  },
})
