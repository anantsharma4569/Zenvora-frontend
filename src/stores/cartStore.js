import { defineStore } from 'pinia'
import { frappeCall } from '@/utils/call'

export const useCartStore = defineStore('cart', {
  state: () => ({
    // { name, product, product_name, image, price, qty, color, size }
    items: [],
    loading: false,
    error: null,
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

    async updateQty(name, qty) {
      this.items = await frappeCall.postMethod('zenvora.api.cart.update_cart_item', { name, qty })
    },

    async removeItem(name) {
      this.items = await frappeCall.postMethod('zenvora.api.cart.remove_from_cart', { name })
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
