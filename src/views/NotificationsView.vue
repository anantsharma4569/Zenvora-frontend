<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Bell } from '@lucide/vue'
import { useNotifications } from '@/composables/useNotifications'
import AccountSidebar from '@/components/account/AccountSidebar.vue'

const { getNotifications, markRead } = useNotifications()

const notifications = ref([])
const loading = ref(true)
const error = ref(null)

async function load() {
  loading.value = true
  try {
    notifications.value = await getNotifications()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleMarkRead(name) {
  notifications.value = await markRead(name)
}

async function handleMarkAllRead() {
  notifications.value = await markRead()
}

function linkFor(n) {
  if (n.reference_doctype === 'Sales Order' && n.reference_name) return `/orders/${n.reference_name}`
  return null
}

onMounted(load)
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-10">
    <div class="flex flex-col gap-8 sm:flex-row">
      <AccountSidebar />

      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between">
          <h1 class="font-display text-2xl font-semibold text-ink">Notifications</h1>
          <button
            v-if="notifications.some((n) => !n.is_read)"
            class="text-sm text-pine-600 underline"
            @click="handleMarkAllRead"
          >
            Mark all read
          </button>
        </div>

        <p v-if="loading" class="mt-8 text-stone-500">Loading…</p>
        <p v-else-if="error" class="mt-8 text-red-600">{{ error }}</p>
        <p v-else-if="!notifications.length" class="mt-8 text-stone-500">You're all caught up.</p>

        <div v-else class="mt-6 divide-y divide-stone-200 border-y border-stone-200">
          <div
            v-for="n in notifications"
            :key="n.name"
            class="flex items-start gap-3 py-4"
            :class="!n.is_read ? 'bg-stone-50' : ''"
            @click="!n.is_read && handleMarkRead(n.name)"
          >
            <Bell class="mt-0.5 h-4 w-4 shrink-0" :class="n.is_read ? 'text-stone-300' : 'text-pine-600'" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-ink">{{ n.title }}</p>
              <p class="text-sm text-stone-600">{{ n.message }}</p>
              <RouterLink v-if="linkFor(n)" :to="linkFor(n)" class="text-xs text-pine-600 underline">
                View order
              </RouterLink>
              <p class="mt-0.5 text-xs text-stone-400">{{ n.creation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
