<script setup>
import { Check } from '@lucide/vue'

const props = defineProps({
  tracking: { type: Object, required: true },
  status: { type: String, default: '' },
})

const STEPS = [
  { key: 'confirmed_at', label: 'Confirmed' },
  { key: 'packed_at', label: 'Packed' },
  { key: 'shipped_at', label: 'Shipped' },
  { key: 'out_for_delivery_at', label: 'Out for Delivery' },
  { key: 'delivered_at', label: 'Delivered' },
]

// Each stage is marked done independently, from its own timestamp — not by
// inferring a contiguous run from whichever stage was set most recently.
// Warehouses often only log Confirmed + Delivered without the granular
// in-between stages; showing those as "done" too would be a fabrication.
function isDone(i) {
  return !!props.tracking?.[STEPS[i].key]
}
</script>

<template>
  <div v-if="status?.includes('Cancel')" class="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
    This order was cancelled.
  </div>

  <template v-else>
    <!-- Mobile: vertical timeline -->
    <div class="sm:hidden">
      <div v-for="(step, i) in STEPS" :key="step.key" class="flex gap-3">
        <div class="flex flex-col items-center">
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium"
            :class="isDone(i) ? 'border-pine-600 bg-pine-600 text-white' : 'border-stone-300 text-stone-400'"
          >
            <Check v-if="isDone(i)" class="h-4 w-4" />
            <span v-else>{{ i + 1 }}</span>
          </div>
          <div
            v-if="i < STEPS.length - 1"
            class="w-0.5 flex-1"
            :class="isDone(i) && isDone(i + 1) ? 'bg-pine-600' : 'bg-stone-200'"
          />
        </div>
        <div class="pb-6">
          <p class="text-sm font-medium" :class="isDone(i) ? 'text-ink' : 'text-stone-400'">
            {{ step.label }}
          </p>
          <p v-if="tracking?.[step.key]" class="mt-0.5 text-xs text-stone-500">
            {{ tracking[step.key] }}
          </p>
        </div>
      </div>
    </div>

    <!-- Desktop: horizontal stepper -->
    <div class="hidden sm:flex sm:items-start">
      <template v-for="(step, i) in STEPS" :key="step.key">
        <div class="flex min-w-[5.5rem] flex-1 flex-col items-center text-center">
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium"
            :class="isDone(i) ? 'border-pine-600 bg-pine-600 text-white' : 'border-stone-300 text-stone-400'"
          >
            <Check v-if="isDone(i)" class="h-4 w-4" />
            <span v-else>{{ i + 1 }}</span>
          </div>
          <p class="mt-2 text-xs font-medium" :class="isDone(i) ? 'text-ink' : 'text-stone-400'">
            {{ step.label }}
          </p>
          <p v-if="tracking?.[step.key]" class="mt-0.5 text-[11px] text-stone-500">
            {{ tracking[step.key] }}
          </p>
        </div>
        <div
          v-if="i < STEPS.length - 1"
          class="mt-4 h-0.5 flex-1"
          :class="isDone(i) && isDone(i + 1) ? 'bg-pine-600' : 'bg-stone-200'"
        />
      </template>
    </div>
  </template>
</template>
