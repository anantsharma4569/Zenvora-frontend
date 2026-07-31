<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useOrders } from '@/composables/useOrders'
import { formatCurrency } from '@/utils/currency'
import AccountSidebar from '@/components/account/AccountSidebar.vue'

const { listReturns } = useOrders()

const returns = ref([])
const loading = ref(true)
const error = ref(null)

function statusClass(status) {
  if (status === 'Rejected') return 'bg-red-50 text-red-600'
  if (status === 'Refunded') return 'bg-pine-50 text-pine-700'
  return 'bg-stone-100 text-stone-600'
}

onMounted(async () => {
  try {
    returns.value = await listReturns()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-10">
    <div class="flex flex-col gap-8 sm:flex-row">
      <AccountSidebar />

      <div class="min-w-0 flex-1">
        <h1 class="font-display text-2xl font-semibold text-ink">Returns & Refunds</h1>

        <p v-if="loading" class="mt-8 text-stone-500">Loading…</p>
        <p v-else-if="error" class="mt-8 text-red-600">{{ error }}</p>
        <p v-else-if="!returns.length" class="mt-8 text-stone-500">
          No returns requested. You can request one from a delivered order's details page.
        </p>

        <div v-else class="mt-6 divide-y divide-stone-200 border-y border-stone-200">
          <div v-for="ret in returns" :key="ret.name" class="flex flex-wrap items-center justify-between gap-2 py-4">
            <div>
              <RouterLink :to="`/orders/${ret.sales_order}`" class="font-medium text-ink hover:underline">
                {{ ret.sales_order }}
              </RouterLink>
              <p class="text-sm text-stone-500">{{ ret.reason || 'No reason given' }}</p>
              <p class="text-xs text-stone-400">Requested {{ ret.requested_at }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="statusClass(ret.status)">
                {{ ret.status }}
              </span>
              <span v-if="ret.refund_amount" class="text-sm font-medium text-ink">
                {{ formatCurrency(ret.refund_amount) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
