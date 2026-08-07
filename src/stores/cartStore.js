import { defineStore } from 'pinia'
import { frappeCall } from '@/utils/call'

// Per cart-item-name debounce timers for updateQty — module-scoped since the
// cart store is a singleton, so this survives fine across the whole app.
const qtyTimers = {}

export const useCartStore = defineStore('cart', {
  state: () => ({
    // { name, product, product_name, image, price, qty, color, size }
    items: [],
    loading: false,
    error: null,
    // { [itemName]: latest request sequence number } — lets a slow response
    // detect it's been superseded by a newer click and discard itself,
    // instead of a lost/duplicate request winning the race and displaying
    // the wrong quantity.
    pendingQty: {},
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, i) => sum + i.qty, 0),
    subtotal: (state) => state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    async fetchCart() {
      this.loading = true
      this.error = null
      try {
        this.items = await frappeCall.method('zenvora.api.cart.get_cart')
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    // product: the Product doc (needs .name); variant: { color, size }
    async addItem(product, qty = 1, variant = {}) {
      this.items = await frappeCall.postMethod('zenvora.api.cart.add_to_cart', {
        product: product.name,
        qty,
        color: variant.color || undefined,
        size: variant.size || undefined,
      })
    },

    // Instant, optimistic, debounced — a Blinkit-style stepper: every +/-
    // click updates the displayed qty immediately, and only the LAST qty the
    // user settles on for a given line actually goes over the network, so
    // rapid clicking never loses a click waiting on a round trip.
    updateQty(name, qty) {
      const item = this.items.find((i) => i.name === name)
      if (!item) return

      if (qty <= 0) {
        this.removeItem(name)
        return
      }

      item.qty = qty

      const requestId = (this.pendingQty[name] || 0) + 1
      this.pendingQty[name] = requestId

      clearTimeout(qtyTimers[name])
      qtyTimers[name] = setTimeout(async () => {
        try {
          const items = await frappeCall.postMethod('zenvora.api.cart.update_cart_item', { name, qty })
          // discard a response superseded by a newer click on this same line
          if (this.pendingQty[name] === requestId) this.items = items
        } catch (e) {
          if (this.pendingQty[name] === requestId) {
            this.error = e.message
            this.fetchCart() // optimistic qty may be wrong (e.g. out of stock) — resync with the server
          }
        }
      }, 400)
    },

    async removeItem(name) {
      delete this.pendingQty[name]
      clearTimeout(qtyTimers[name])
      const removed = this.items
      this.items = this.items.filter((i) => i.name !== name) // optimistic
      try {
        this.items = await frappeCall.postMethod('zenvora.api.cart.remove_from_cart', { name })
      } catch (e) {
        this.items = removed // roll back — the item wasn't actually removed
        this.error = e.message
      }
    },

    async clearCart() {
      this.items = await frappeCall.postMethod('zenvora.api.cart.clear_cart')
    },

    // called on logout — the bag belongs to the account, not the browser
    reset() {
      this.items = []
      this.error = null
    },
  },
})
