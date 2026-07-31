<script setup>
import { ref, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useOrders } from '@/composables/useOrders'
import { formatCurrency } from '@/utils/currency'
import { statusClass } from '@/utils/orderStatus'
import Button from '@/components/common/Button.vue'

const TABS = [
  { key: 'all', label: 'All Orders' },
  { key: 'to_deliver', label: 'To Deliver' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'returned', label: 'Returned' },
]
const PAGE_SIZE = 5

const { fetchOrders, buyAgain } = useOrders()

const activeTab = ref('all')
const page = ref(1)
const orders = ref([])
const totalCount = ref(0)
const loading = ref(true)
const error = ref(null)
const buyingAgain = ref(null)
const buyAgainMessage = ref(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    const result = await fetchOrders({
      status: activeTab.value,
      limitStart: (page.value - 1) * PAGE_SIZE,
      limitPageLength: PAGE_SIZE,
    })
    orders.value = result.orders
    totalCount.value = result.total_count
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleBuyAgain(order) {
  buyingAgain.value = order.name
  buyAgainMessage.value = null
  try {
    await buyAgain(order.name)
    buyAgainMessage.value = `Added ${order.name}'s items to your bag`
  } catch (e) {
    buyAgainMessage.value = e.message
  } finally {
    buyingAgain.value = null
    setTimeout(() => (buyAgainMessage.value = null), 3000)
  }
}

function totalPages() {
  return Math.max(1, Math.ceil(totalCount.value / PAGE_SIZE))
}

watch(activeTab, () => {
  page.value = 1
  load()
})
watch(page, load)
onMounted(load)
</script>

<template>
  <section class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="font-display text-2xl font-semibold text-ink">My Orders</h1>
    <p class="mt-1 text-sm text-stone-500">Track, return, or buy again.</p>

    <div class="mt-6 flex flex-wrap gap-2 border-b border-stone-200 pb-3">
      <button
        v-for="tab in TABS"
        :key="tab.key"
        class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
        :class="
          activeTab === tab.key ? 'bg-ink text-white' : 'border border-stone-300 text-ink hover:border-ink'
        "
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <p v-if="buyAgainMessage" class="mt-4 text-sm text-pine-700">{{ buyAgainMessage }}</p>

    <p v-if="loading" class="mt-8 text-stone-500">Loading…</p>
    <p v-else-if="error" class="mt-8 text-red-600">{{ error }}</p>
    <p v-else-if="!orders.length" class="mt-8 text-stone-500">
      No orders in this view. <RouterLink to="/shop" class="text-pine-600 underline">Start shopping</RouterLink>
    </p>

    <div v-else class="mt-6 space-y-4">
      <div
        v-for="order in orders"
        :key="order.name"
        class="rounded-lg border border-stone-200 p-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p class="text-xs uppercase tracking-wide text-stone-400">Order Placed {{ order.transaction_date }}</p>
            <RouterLink :to="`/orders/${order.name}`" class="font-medium text-ink hover:underline">
              {{ order.name }}
            </RouterLink>
          </div>
          <div class="flex items-center gap-3">
            <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="statusClass(order.status)">
              {{ order.status }}
            </span>
            <span class="font-medium text-ink">{{ formatCurrency(order.grand_total, order.currency) }}</span>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" @click="handleBuyAgain(order)" :disabled="buyingAgain === order.name">
            {{ buyingAgain === order.name ? 'Adding…' : 'Buy Again' }}
          </Button>
          <RouterLink :to="`/orders/${order.name}`">
            <Button variant="outline">View Details</Button>
          </RouterLink>
        </div>
      </div>
    </div>

    <div v-if="!loading && totalCount > PAGE_SIZE" class="mt-8 flex items-center justify-center gap-4">
      <button
        class="rounded-md border border-stone-300 px-3 py-1.5 text-sm disabled:opacity-40"
        :disabled="page <= 1"
        @click="page--"
      >
        ← Prev
      </button>
      <span class="text-sm text-stone-500">Page {{ page }} of {{ totalPages() }}</span>
      <button
        class="rounded-md border border-stone-300 px-3 py-1.5 text-sm disabled:opacity-40"
        :disabled="page >= totalPages()"
        @click="page++"
      >
        Next →
      </button>
    </div>
  </section>
</template>
