import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // { item_code, item_name, image, rate, qty }
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, i) => sum + i.qty, 0),
    subtotal: (state) => state.items.reduce((sum, i) => sum + i.rate * i.qty, 0),
    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    addItem(product, qty = 1) {
      const existing = this.items.find((i) => i.item_code === product.name)
      if (existing) {
        existing.qty += qty
      } else {
        this.items.push({
          item_code: product.name,
          item_name: product.product_name,
          image: product.image_1,
          rate: product.price,
          qty,
        })
      }
      this.persist()
    },

    updateQty(item_code, qty) {
      const item = this.items.find((i) => i.item_code === item_code)
      if (!item) return
      if (qty <= 0) return this.removeItem(item_code)
      item.qty = qty
      this.persist()
    },

    removeItem(item_code) {
      this.items = this.items.filter((i) => i.item_code !== item_code)
      this.persist()
    },

    clearCart() {
      this.items = []
      this.persist()
    },

    persist() {
      localStorage.setItem('zenvora_cart', JSON.stringify(this.items))
    },

    hydrate() {
      const saved = localStorage.getItem('zenvora_cart')
      if (saved) this.items = JSON.parse(saved)
    },
  },
})
