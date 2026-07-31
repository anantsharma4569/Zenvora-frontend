<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Package, Heart, Tag, Wallet, MapPin, RotateCcw } from '@lucide/vue'
import { useDashboard } from '@/composables/useDashboard'
import { useRecommendations } from '@/composables/useRecommendations'
import { formatCurrency } from '@/utils/currency'
import { statusClass } from '@/utils/orderStatus'
import AccountSidebar from '@/components/account/AccountSidebar.vue'
import ProductCard from '@/components/product/ProductCard.vue'

const { getDashboardSummary } = useDashboard()
const { getRecommendations } = useRecommendations()

const summary = ref(null)
const recommendations = ref([])
const loading = ref(true)
const error = ref(null)

const STAT_CARDS = [
  { key: 'total_orders', label: 'Total Orders', icon: Package, format: (v) => v },
  { key: 'wishlist_count', label: 'Wishlist Items', icon: Heart, format: (v) => v },
  { key: 'coupon_count', label: 'Coupons', icon: Tag, format: (v) => v },
  { key: 'wallet_balance', label: 'Wallet Balance', icon: Wallet, format: (v) => formatCurrency(v) },
  { key: 'address_count', label: 'Saved Addresses', icon: MapPin, format: (v) => v },
  { key: 'return_count', label: 'Returns', icon: RotateCcw, format: (v) => v },
]

onMounted(async () => {
  try {
    ;[summary.value, recommendations.value] = await Promise.all([
      getDashboardSummary(),
      getRecommendations({ limit: 4 }),
    ])
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
        <p v-if="loading" class="text-stone-500">Loading…</p>
        <p v-else-if="error" class="text-red-600">{{ error }}</p>

        <template v-else-if="summary">
          <h1 class="font-display text-2xl font-semibold text-ink">
            Hello, {{ summary.full_name }} 👋
          </h1>

          <div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
            <div
              v-for="card in STAT_CARDS"
              :key="card.key"
              class="rounded-lg border border-stone-200 p-4"
            >
              <component :is="card.icon" class="h-5 w-5 text-pine-600" />
              <p class="mt-3 text-xl font-semibold text-ink">{{ card.format(summary[card.key]) }}</p>
              <p class="text-sm text-stone-500">{{ card.label }}</p>
            </div>
          </div>

          <div class="mt-10">
            <div class="flex items-center justify-between">
              <h2 class="font-display text-lg font-semibold text-ink">Recent Orders</h2>
              <RouterLink to="/orders" class="text-sm text-pine-600 underline">View All</RouterLink>
            </div>

            <p v-if="!summary.recent_orders.length" class="mt-4 text-stone-500">
              No orders yet. <RouterLink to="/shop" class="text-pine-600 underline">Start shopping</RouterLink>
            </p>
            <div v-else class="mt-4 divide-y divide-stone-200 border-y border-stone-200">
              <RouterLink
                v-for="order in summary.recent_orders"
                :key="order.name"
                :to="`/orders/${order.name}`"
                class="flex flex-wrap items-center justify-between gap-2 py-3 hover:bg-stone-50"
              >
                <div>
                  <p class="text-sm font-medium text-ink">{{ order.name }}</p>
                  <p class="text-xs text-stone-500">{{ order.transaction_date }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="statusClass(order.status)">
                    {{ order.status }}
                  </span>
                  <span class="text-sm font-medium text-ink">
                    {{ formatCurrency(order.grand_total, order.currency) }}
                  </span>
                </div>
              </RouterLink>
            </div>
          </div>

          <div v-if="recommendations.length" class="mt-10">
            <div class="flex items-center justify-between">
              <h2 class="font-display text-lg font-semibold text-ink">Recommended For You</h2>
              <RouterLink to="/shop" class="text-sm text-pine-600 underline">View All</RouterLink>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-6 lg:grid-cols-4">
              <ProductCard v-for="product in recommendations" :key="product.name" :product="product" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
