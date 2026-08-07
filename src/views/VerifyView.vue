<script setup>
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useGuestCheckout } from '@/composables/useGuestCheckout'
import Button from '@/components/common/Button.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const { requestCheckoutOtp, verifyCheckoutOtp } = useGuestCheckout()

const channel = ref('Email') // 'Email' | 'SMS'
const recipient = ref('')
const code = ref('')
const step = ref('recipient') // 'recipient' | 'code'
const sending = ref(false)
const verifying = ref(false)
const error = ref(null)

async function handleSendCode() {
  if (!recipient.value) return
  sending.value = true
  error.value = null
  try {
    await requestCheckoutOtp(channel.value, recipient.value)
    step.value = 'code'
  } catch (e) {
    error.value = e.message
  } finally {
    sending.value = false
  }
}

async function handleVerify() {
  if (!code.value) return
  verifying.value = true
  error.value = null
  try {
    const data = await verifyCheckoutOtp(channel.value, recipient.value, code.value)
    await auth.completeOtpLogin(data)
    router.push(route.query.redirect || '/')
  } catch (e) {
    error.value = e.message
  } finally {
    verifying.value = false
  }
}

function changeRecipient() {
  step.value = 'recipient'
  code.value = ''
  error.value = null
}
</script>

<template>
  <section class="mx-auto max-w-sm px-6 py-24">
    <h1 class="font-display text-2xl font-semibold text-ink">Continue with a code</h1>
    <p class="mt-2 text-sm text-stone-500">
      No password needed — verify your phone or email and we'll take you straight to checkout.
    </p>

    <form v-if="step === 'recipient'" class="mt-8 space-y-5" @submit.prevent="handleSendCode">
      <div class="flex gap-2">
        <button
          type="button"
          class="flex-1 rounded-md border py-2 text-sm font-medium"
          :class="channel === 'Email' ? 'border-ink bg-ink text-white' : 'border-stone-300 text-ink'"
          @click="channel = 'Email'"
        >
          Email
        </button>
        <button
          type="button"
          class="flex-1 rounded-md border py-2 text-sm font-medium"
          :class="channel === 'SMS' ? 'border-ink bg-ink text-white' : 'border-stone-300 text-ink'"
          @click="channel = 'SMS'"
        >
          Phone
        </button>
      </div>

      <div>
        <label class="text-sm font-medium text-ink" for="recipient">
          {{ channel === 'Email' ? 'Email address' : 'Phone number' }}
        </label>
        <input
          id="recipient"
          v-model="recipient"
          :type="channel === 'Email' ? 'email' : 'tel'"
          :placeholder="channel === 'Email' ? 'you@example.com' : '+91XXXXXXXXXX'"
          required
          class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-ink focus:outline-none"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <Button class="w-full" :disabled="sending">
        {{ sending ? 'Sending…' : 'Send Code' }}
      </Button>
    </form>

    <form v-else class="mt-8 space-y-5" @submit.prevent="handleVerify">
      <p class="text-sm text-stone-600">
        We sent a code to <span class="font-medium text-ink">{{ recipient }}</span>.
        <button type="button" class="text-pine-600 underline" @click="changeRecipient">Change</button>
      </p>

      <div>
        <label class="text-sm font-medium text-ink" for="code">Verification code</label>
        <input
          id="code"
          v-model="code"
          type="text"
          inputmode="numeric"
          autocomplete="one-time-code"
          maxlength="6"
          required
          class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 tracking-widest focus:border-ink focus:outline-none"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <Button class="w-full" :disabled="verifying">
        {{ verifying ? 'Verifying…' : 'Verify & Continue' }}
      </Button>
    </form>

    <p class="mt-6 text-sm text-stone-500">
      Prefer a password?
      <RouterLink :to="{ path: '/login', query: route.query }" class="text-pine-600 underline">Log in</RouterLink>
    </p>
  </section>
</template>
