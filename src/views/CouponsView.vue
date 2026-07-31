<script setup>
import { ref, onMounted } from 'vue'
import { Tag } from '@lucide/vue'
import { useCoupons } from '@/composables/useCoupons'
import AccountSidebar from '@/components/account/AccountSidebar.vue'

const { listActiveCoupons } = useCoupons()

const coupons = ref([])
const loading = ref(true)
const error = ref(null)
const copied = ref(null)

async function copyCode(code) {
  try {
    await navigator.clipboard.writeText(code)
    copied.value = code
    setTimeout(() => (copied.value = null), 2000)
  } catch {
    // clipboard access denied — the code is still shown on screen to copy manually
  }
}

onMounted(async () => {
  try {
    coupons.value = await listActiveCoupons()
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
        <h1 class="font-display text-2xl font-semibold text-ink">Coupons</h1>
        <p class="mt-1 text-sm text-stone-500">Apply these at checkout.</p>

        <p v-if="loading" class="mt-8 text-stone-500">Loading…</p>
        <p v-else-if="error" class="mt-8 text-red-600">{{ error }}</p>
        <p v-else-if="!coupons.length" class="mt-8 text-stone-500">No coupons available right now.</p>

        <div v-else class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            v-for="coupon in coupons"
            :key="coupon.name"
            class="flex items-center justify-between rounded-lg border border-dashed border-pine-300 bg-pine-50/40 p-4"
          >
            <div class="flex items-center gap-3">
              <Tag class="h-5 w-5 text-pine-600" />
              <div>
                <p class="font-mono font-medium text-ink">{{ coupon.coupon_code }}</p>
                <p class="text-sm text-stone-600">{{ coupon.description }}</p>
              </div>
            </div>
            <button
              class="shrink-0 rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-ink hover:border-ink"
              @click="copyCode(coupon.coupon_code)"
            >
              {{ copied === coupon.coupon_code ? 'Copied ✓' : 'Copy' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
