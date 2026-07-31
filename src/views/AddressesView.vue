<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAddresses } from '@/composables/useAddresses'
import AccountSidebar from '@/components/account/AccountSidebar.vue'
import Button from '@/components/common/Button.vue'

const { getAddresses, createAddress, deleteAddress, setDefaultAddress } = useAddresses()

const addresses = ref([])
const loading = ref(true)
const error = ref(null)
const showForm = ref(false)
const saving = ref(false)
const formError = ref(null)

const form = reactive({
  address_title: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  pincode: '',
  phone: '',
})

async function load() {
  loading.value = true
  try {
    addresses.value = await getAddresses()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  saving.value = true
  formError.value = null
  try {
    addresses.value = await createAddress({ ...form })
    Object.keys(form).forEach((k) => (form[k] = ''))
    showForm.value = false
  } catch (e) {
    formError.value = e.message
  } finally {
    saving.value = false
  }
}

async function handleDelete(name) {
  addresses.value = await deleteAddress(name)
}

async function handleSetDefault(name) {
  addresses.value = await setDefaultAddress(name)
}

onMounted(load)
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-10">
    <div class="flex flex-col gap-8 sm:flex-row">
      <AccountSidebar />

      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between">
          <h1 class="font-display text-2xl font-semibold text-ink">Saved Addresses</h1>
          <Button v-if="!showForm" @click="showForm = true">Add Address</Button>
        </div>

        <form
          v-if="showForm"
          class="mt-6 grid grid-cols-1 gap-4 rounded-lg border border-stone-200 p-4 sm:grid-cols-2"
          @submit.prevent="handleCreate"
        >
          <input v-model="form.address_title" required placeholder="Label (e.g. Home)" class="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none" />
          <input v-model="form.phone" placeholder="Phone" class="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none" />
          <input v-model="form.address_line1" required placeholder="Address Line 1" class="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none sm:col-span-2" />
          <input v-model="form.address_line2" placeholder="Address Line 2 (optional)" class="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none sm:col-span-2" />
          <input v-model="form.city" required placeholder="City" class="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none" />
          <input v-model="form.state" required placeholder="State" class="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none" />
          <input v-model="form.pincode" required placeholder="Pincode" class="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none" />

          <p v-if="formError" class="text-sm text-red-600 sm:col-span-2">{{ formError }}</p>

          <div class="flex gap-2 sm:col-span-2">
            <Button :disabled="saving">{{ saving ? 'Saving…' : 'Save Address' }}</Button>
            <Button variant="outline" type="button" @click="showForm = false">Cancel</Button>
          </div>
        </form>

        <p v-if="loading" class="mt-8 text-stone-500">Loading…</p>
        <p v-else-if="error" class="mt-8 text-red-600">{{ error }}</p>
        <p v-else-if="!addresses.length && !showForm" class="mt-8 text-stone-500">No saved addresses yet.</p>

        <div v-else class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div v-for="address in addresses" :key="address.name" class="rounded-lg border border-stone-200 p-4">
            <div class="flex items-center justify-between">
              <p class="font-medium text-ink">{{ address.address_title }}</p>
              <span v-if="address.is_primary_address" class="rounded-full bg-pine-50 px-2 py-0.5 text-xs font-medium text-pine-700">
                Default
              </span>
            </div>
            <p class="mt-1 text-sm text-stone-600">{{ address.address_line1 }}</p>
            <p v-if="address.address_line2" class="text-sm text-stone-600">{{ address.address_line2 }}</p>
            <p class="text-sm text-stone-600">{{ address.city }}, {{ address.state }} {{ address.pincode }}</p>
            <p v-if="address.phone" class="text-sm text-stone-600">{{ address.phone }}</p>

            <div class="mt-3 flex gap-2">
              <button
                v-if="!address.is_primary_address"
                class="text-xs font-medium text-pine-600 underline"
                @click="handleSetDefault(address.name)"
              >
                Set as default
              </button>
              <button class="text-xs font-medium text-red-600 underline" @click="handleDelete(address.name)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
