<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useProducts } from '@/composables/useProducts'
import { formatCurrency } from '@/utils/currency'
import Button from '@/components/common/Button.vue'

const cart = useCartStore()
const auth = useAuthStore()
const { createSalesOrder } = useProducts()
const router = useRouter()

const customer = ref(auth.user?.full_name || '')
const placing = ref(false)
const error = ref(null)

async function placeOrder() {
  placing.value = true
  error.value = null
  try {
    await createSalesOrder({
      customer: customer.value,
      items: cart.items.map((i) => ({ item_code: i.item_code, qty: i.qty, rate: i.rate })),
    })
    cart.clearCart()
    router.push('/')
  } catch (e) {
    error.value = e.message
  } finally {
    placing.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-2xl px-6 py-16">
    <h1 class="font-display text-2xl font-semibold text-ink">Checkout</h1>

    <form class="mt-8 space-y-6" @submit.prevent="placeOrder">
      <div>
        <label class="text-sm font-medium text-ink" for="customer">Customer Name</label>
        <input
          id="customer"
          v-model="customer"
          required
          type="text"
          class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-ink focus:outline-none"
        />
      </div>

      <div class="flex items-center justify-between border-t border-stone-200 pt-4">
        <span class="font-medium text-ink">Total</span>
        <span class="font-medium text-ink">{{ formatCurrency(cart.subtotal) }}</span>
      </div>

      <p v-if="error" class="text-red-600">{{ error }}</p>

      <Button class="w-full" :disabled="placing || cart.isEmpty">
        {{ placing ? 'Placing Order…' : 'Place Order' }}
      </Button>
    </form>
  </section>
</template>
