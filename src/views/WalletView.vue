<script setup>
import { ref, onMounted } from 'vue'
import { Wallet } from '@lucide/vue'
import { useWallet } from '@/composables/useWallet'
import { formatCurrency } from '@/utils/currency'
import AccountSidebar from '@/components/account/AccountSidebar.vue'

const { getWallet } = useWallet()

const wallet = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    wallet.value = await getWallet()
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
        <h1 class="font-display text-2xl font-semibold text-ink">Wallet</h1>

        <p v-if="loading" class="mt-8 text-stone-500">Loading…</p>
        <p v-else-if="error" class="mt-8 text-red-600">{{ error }}</p>

        <template v-else-if="wallet">
          <div class="mt-6 flex items-center gap-3 rounded-lg border border-stone-200 p-5">
            <Wallet class="h-6 w-6 text-pine-600" />
            <div>
              <p class="text-xs uppercase tracking-wide text-stone-400">Balance</p>
              <p class="font-display text-2xl font-semibold text-ink">{{ formatCurrency(wallet.balance) }}</p>
            </div>
          </div>

          <h2 class="mt-8 text-sm font-medium text-ink">Transaction History</h2>
          <p v-if="!wallet.transactions.length" class="mt-2 text-sm text-stone-500">No transactions yet.</p>
          <div v-else class="mt-3 divide-y divide-stone-200 border-y border-stone-200">
            <div
              v-for="txn in wallet.transactions"
              :key="txn.name"
              class="flex items-center justify-between py-3 text-sm"
            >
              <div>
                <p class="font-medium text-ink">{{ txn.reference || txn.type }}</p>
                <p class="text-xs text-stone-500">{{ txn.creation }}</p>
              </div>
              <span :class="txn.type === 'Credit' ? 'text-pine-700' : 'text-red-600'" class="font-medium">
                {{ txn.type === 'Credit' ? '+' : '-' }}{{ formatCurrency(txn.amount) }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
