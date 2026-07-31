<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Tag,
  RotateCcw,
  Bell,
  LogOut,
} from '@lucide/vue'

const NAV_ITEMS = [
  { to: '/account', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'My Orders', icon: Package },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/addresses', label: 'Saved Addresses', icon: MapPin },
  { to: '/payment-methods', label: 'Payment Methods', icon: CreditCard },
  { to: '/coupons', label: 'Coupons', icon: Tag },
  { to: '/returns', label: 'Returns & Refunds', icon: RotateCcw },
  { to: '/notifications', label: 'Notifications', icon: Bell },
]

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <nav class="w-full shrink-0 sm:w-56">
    <ul class="flex gap-1 overflow-x-auto sm:flex-col sm:overflow-visible">
      <li v-for="item in NAV_ITEMS" :key="item.to" class="shrink-0 sm:shrink">
        <RouterLink
          :to="item.to"
          class="flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="
            route.path === item.to
              ? 'bg-ink text-white'
              : 'text-stone-600 hover:bg-stone-100 hover:text-ink'
          "
        >
          <component :is="item.icon" class="h-4 w-4 shrink-0" />
          {{ item.label }}
        </RouterLink>
      </li>
      <li class="mt-2 hidden shrink-0 border-t border-stone-200 pt-2 sm:block">
        <button
          class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-ink"
          @click="handleLogout"
        >
          <LogOut class="h-4 w-4 shrink-0" />
          Log Out
        </button>
      </li>
    </ul>
  </nav>
</template>
