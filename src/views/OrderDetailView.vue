<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useOrders } from '@/composables/useOrders'
import { useRecommendations } from '@/composables/useRecommendations'
import { formatCurrency } from '@/utils/currency'
import { statusClass } from '@/utils/orderStatus'
import TrackingStepper from '@/components/account/TrackingStepper.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import Button from '@/components/common/Button.vue'

const props = defineProps({
  id: { type: String, required: true },
})

const PAYMENT_METHOD_LABELS = { upi: 'UPI', card: 'Card', netbanking: 'Netbanking', wallet: 'Wallet', emi: 'EMI' }
function paymentMethodLabel(method) {
  if (!method) return '—'
  return PAYMENT_METHOD_LABELS[method] || method.charAt(0).toUpperCase() + method.slice(1)
}

const { getOrderDetail, requestReturn } = useOrders()
const { getRecommendations } = useRecommendations()

const order = ref(null)
const recommendations = ref([])
const loading = ref(true)
const error = ref(null)
const returning = ref(false)
const returnMessage = ref(null)

const canReturn = computed(() => order.value?.status === 'Completed' && !order.value?.return_request)

async function load() {
  loading.value = true
  error.value = null
  try {
    order.value = await getOrderDetail(props.id)
    if (order.value.items[0]) {
      recommendations.value = await getRecommendations({
        excludeProduct: order.value.items[0].item_code,
        limit: 4,
      })
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleRequestReturn() {
  returning.value = true
  returnMessage.value = null
  try {
    await requestReturn(props.id)
    await load()
  } catch (e) {
    returnMessage.value = e.message
  } finally {
    returning.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 py-16">
    <RouterLink to="/orders" class="text-sm text-pine-600 underline">← Back to Orders</RouterLink>

    <p v-if="loading" class="mt-8 text-stone-500">Loading…</p>
    <p v-else-if="error" class="mt-8 text-red-600">{{ error }}</p>

    <div v-else-if="order" class="mt-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 class="font-display text-2xl font-semibold text-ink">Order Details</h1>
          <p class="mt-1 text-sm text-stone-500">
            Order ID: <span class="font-medium text-ink">{{ order.name }}</span> · Placed
            {{ order.transaction_date }}
          </p>
        </div>
        <span class="rounded-full px-3 py-1 text-xs font-medium" :class="statusClass(order.status)">
          {{ order.status }}
        </span>
      </div>

      <div class="mt-8 rounded-lg border border-stone-200 p-4 sm:p-6">
        <p class="text-sm font-medium text-ink">Order Tracking</p>
        <TrackingStepper class="mt-4" :tracking="order.tracking" :status="order.status" />
      </div>

      <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div class="rounded-lg border border-stone-200 p-4">
          <p class="text-sm font-medium text-ink">Order Items ({{ order.items.length }})</p>
          <div class="mt-3 space-y-3">
            <div v-for="item in order.items" :key="item.item_code" class="flex items-center justify-between text-sm">
              <span class="text-stone-600">{{ item.item_name }} × {{ item.qty }}</span>
              <span class="font-medium text-ink">{{ formatCurrency(item.amount, order.currency) }}</span>
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-stone-200 p-4">
          <p class="text-sm font-medium text-ink">Shipping Address</p>
          <div v-if="order.address" class="mt-3 text-sm text-stone-600">
            <p class="font-medium text-ink">{{ order.address.address_title }}</p>
            <p>{{ order.address.address_line1 }}</p>
            <p v-if="order.address.address_line2">{{ order.address.address_line2 }}</p>
            <p>{{ order.address.city }}, {{ order.address.state }} {{ order.address.pincode }}</p>
            <p>{{ order.address.country }}</p>
            <p v-if="order.address.phone" class="mt-1">{{ order.address.phone }}</p>
          </div>
          <p v-else class="mt-3 text-sm text-stone-500">No address on file for this order.</p>
        </div>

        <div class="rounded-lg border border-stone-200 p-4">
          <p class="text-sm font-medium text-ink">Payment Details</p>
          <div v-if="order.payment" class="mt-3 space-y-1.5 text-sm">
            <div class="flex justify-between">
              <span class="text-stone-500">Payment Method</span>
              <span class="font-medium text-ink">{{ paymentMethodLabel(order.payment.method) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500">Payment Status</span>
              <span class="font-medium text-ink">{{ order.payment.status }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500">Transaction ID</span>
              <span class="font-medium text-ink">{{ order.payment.razorpay_payment_id || '—' }}</span>
            </div>
          </div>
          <p v-else class="mt-3 text-sm text-stone-500">No payment recorded yet.</p>
        </div>

        <div class="rounded-lg border border-stone-200 p-4">
          <p class="text-sm font-medium text-ink">Price Details</p>
          <div class="mt-3 space-y-1.5 text-sm">
            <div class="flex justify-between">
              <span class="text-stone-500">Subtotal</span>
              <span class="text-ink">{{ formatCurrency(order.total, order.currency) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500">GST</span>
              <span class="text-ink">{{ formatCurrency(order.total_taxes_and_charges, order.currency) }}</span>
            </div>
            <div v-if="order.discount_amount" class="flex justify-between">
              <span class="text-stone-500">Discount</span>
              <span class="text-pine-700">-{{ formatCurrency(order.discount_amount, order.currency) }}</span>
            </div>
            <div class="flex justify-between border-t border-stone-200 pt-1.5 font-medium">
              <span class="text-ink">Total</span>
              <span class="text-ink">{{ formatCurrency(order.grand_total, order.currency) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <p v-if="order.return_request" class="text-sm text-stone-600">
          Return status: <span class="font-medium text-ink">{{ order.return_request.status }}</span>
        </p>
        <template v-else-if="canReturn">
          <Button variant="outline" :disabled="returning" @click="handleRequestReturn">
            {{ returning ? 'Requesting…' : 'Request Return' }}
          </Button>
        </template>
        <p v-if="returnMessage" class="mt-2 text-sm text-red-600">{{ returnMessage }}</p>
      </div>

      <div v-if="recommendations.length" class="mt-10">
        <h2 class="font-display text-lg font-semibold text-ink">You may also like</h2>
        <div class="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <ProductCard v-for="product in recommendations" :key="product.name" :product="product" />
        </div>
      </div>
    </div>
  </section>
</template>
