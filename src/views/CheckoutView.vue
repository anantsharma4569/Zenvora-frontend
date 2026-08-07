<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useOrders } from '@/composables/useOrders'
import { useRazorpay } from '@/composables/useRazorpay'
import { useAddresses } from '@/composables/useAddresses'
import { useCoupons } from '@/composables/useCoupons'
import { formatCurrency } from '@/utils/currency'
import Button from '@/components/common/Button.vue'

const cart = useCartStore()
const auth = useAuthStore()
const { createSalesOrder } = useOrders()
const { initiateRazorpayPayment } = useRazorpay()
const { getAddresses } = useAddresses()
const { validateCoupon } = useCoupons()
const router = useRouter()

const addresses = ref([])
const selectedAddress = ref(null)
const couponInput = ref('')
const appliedCoupon = ref(null)
const couponError = ref(null)
const validatingCoupon = ref(false)

const placing = ref(false)
const error = ref(null)

onMounted(async () => {
  try {
    addresses.value = await getAddresses()
    const primary = addresses.value.find((a) => a.is_primary_address) || addresses.value[0]
    selectedAddress.value = primary?.name || null
  } catch {
    // address list is optional at checkout — order can still be placed without one
  }
})

async function handleApplyCoupon() {
  if (!couponInput.value) return
  validatingCoupon.value = true
  couponError.value = null
  try {
    appliedCoupon.value = await validateCoupon(couponInput.value)
  } catch (e) {
    appliedCoupon.value = null
    couponError.value = e.message
  } finally {
    validatingCoupon.value = false
  }
}

function estimatedDiscount() {
  if (!appliedCoupon.value) return 0
  if (appliedCoupon.value.discount_percentage) {
    return (cart.subtotal * appliedCoupon.value.discount_percentage) / 100
  }
  return appliedCoupon.value.discount_amount || 0
}

async function placeOrder() {
  placing.value = true
  error.value = null
  try {
    const items = cart.items.map((i) => ({ item_code: i.product, qty: i.qty, rate: i.price, size: i.size }))
    const salesOrder = await createSalesOrder(
      items,
      selectedAddress.value,
      appliedCoupon.value?.coupon_code,
    )

    await initiateRazorpayPayment(salesOrder.name, {
      name: auth.user?.full_name,
      email: auth.user?.email,
      contact: auth.user?.phone,
    })

    await cart.clearCart()
    router.push({ path: '/', query: { order: salesOrder.name } })
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

    <div class="mt-8 space-y-8">
      <div class="space-y-3">
        <div v-for="item in cart.items" :key="item.name" class="flex items-center justify-between text-sm">
          <span class="text-stone-600">
            {{ item.product_name }}
            <span v-if="item.color || item.size" class="text-stone-400">
              ({{ [item.color, item.size].filter(Boolean).join(' · ') }})
            </span>
            × {{ item.qty }}
          </span>
          <span class="font-medium text-ink">{{ formatCurrency(item.price * item.qty) }}</span>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-ink">Shipping Address</p>
          <RouterLink to="/addresses" class="text-xs text-pine-600 underline">Manage addresses</RouterLink>
        </div>
        <p v-if="!addresses.length" class="mt-2 text-sm text-stone-500">
          No saved address — <RouterLink to="/addresses" class="text-pine-600 underline">add one</RouterLink> or
          continue without.
        </p>
        <div v-else class="mt-2 space-y-2">
          <label
            v-for="address in addresses"
            :key="address.name"
            class="flex cursor-pointer items-start gap-2 rounded-md border p-3 text-sm"
            :class="selectedAddress === address.name ? 'border-ink' : 'border-stone-300'"
          >
            <input v-model="selectedAddress" type="radio" :value="address.name" class="mt-1" />
            <span>
              <span class="font-medium text-ink">{{ address.address_title }}</span> —
              {{ address.address_line1 }}, {{ address.city }}, {{ address.state }} {{ address.pincode }}
            </span>
          </label>
        </div>
      </div>

      <div>
        <p class="text-sm font-medium text-ink">Coupon Code</p>
        <div class="mt-2 flex gap-2">
          <input
            v-model="couponInput"
            placeholder="Enter code"
            class="w-full rounded-md border border-stone-300 px-3 py-2 text-sm uppercase focus:border-ink focus:outline-none"
          />
          <button
            type="button"
            class="shrink-0 rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-ink hover:border-ink"
            :disabled="validatingCoupon"
            @click="handleApplyCoupon"
          >
            {{ validatingCoupon ? 'Checking…' : 'Apply' }}
          </button>
        </div>
        <p v-if="appliedCoupon" class="mt-1 text-sm text-pine-700">
          {{ appliedCoupon.coupon_code }} applied — {{ appliedCoupon.description }}
        </p>
        <p v-if="couponError" class="mt-1 text-sm text-red-600">{{ couponError }}</p>
      </div>

      <div class="space-y-1.5 border-t border-stone-200 pt-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-stone-500">Subtotal</span>
          <span class="text-ink">{{ formatCurrency(cart.subtotal) }}</span>
        </div>
        <div v-if="appliedCoupon" class="flex items-center justify-between text-sm">
          <span class="text-stone-500">Discount</span>
          <span class="text-pine-700">-{{ formatCurrency(estimatedDiscount()) }}</span>
        </div>
        <p class="text-xs text-stone-400">Final total (incl. GST) is confirmed on the payment screen.</p>
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <Button class="w-full" :disabled="placing || cart.isEmpty" @click="placeOrder">
        {{ placing ? 'Processing…' : `Pay ${formatCurrency(cart.subtotal - estimatedDiscount())}` }}
      </Button>
    </div>
  </section>
</template>
