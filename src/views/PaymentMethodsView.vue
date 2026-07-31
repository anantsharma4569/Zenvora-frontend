<script setup>
import { ref, onMounted } from 'vue'
import { CreditCard } from '@lucide/vue'
import { usePaymentMethods } from '@/composables/usePaymentMethods'
import AccountSidebar from '@/components/account/AccountSidebar.vue'

const { getSavedPaymentMethods, deleteSavedPaymentMethod } = usePaymentMethods()

const methods = ref([])
const loading = ref(true)
const error = ref(null)

async function load() {
  loading.value = true
  try {
    methods.value = await getSavedPaymentMethods()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleDelete(name) {
  methods.value = await deleteSavedPaymentMethod(name)
}

onMounted(load)
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-10">
    <div class="flex flex-col gap-8 sm:flex-row">
      <AccountSidebar />

      <div class="min-w-0 flex-1">
        <h1 class="font-display text-2xl font-semibold text-ink">Payment Methods</h1>
        <p class="mt-1 text-sm text-stone-500">
          Cards you chose to save during checkout, via Razorpay — we never see or store the actual card number.
        </p>

        <p v-if="loading" class="mt-8 text-stone-500">Loading…</p>
        <p v-else-if="error" class="mt-8 text-red-600">{{ error }}</p>
        <p v-else-if="!methods.length" class="mt-8 text-stone-500">
          No saved cards yet. Tick "Save card" during checkout to add one.
        </p>

        <div v-else class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            v-for="method in methods"
            :key="method.name"
            class="flex items-center justify-between rounded-lg border border-stone-200 p-4"
          >
            <div class="flex items-center gap-3">
              <CreditCard class="h-5 w-5 text-stone-500" />
              <div>
                <p class="font-medium capitalize text-ink">
                  {{ method.card_network || 'Card' }} •••• {{ method.card_last4 }}
                </p>
                <p class="text-sm text-stone-500">{{ method.card_name }}</p>
              </div>
            </div>
            <button class="text-xs font-medium text-red-600 underline" @click="handleDelete(method.name)">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
