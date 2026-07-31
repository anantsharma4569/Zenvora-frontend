<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Star, BadgeCheck } from '@lucide/vue'
import { useAuthStore } from '@/stores/authStore'
import { useReviews } from '@/composables/useReviews'
import WriteReviewModal from '@/components/product/WriteReviewModal.vue'

const props = defineProps({
  product: { type: String, required: true },
})

const auth = useAuthStore()
const route = useRoute()

const {
  reviews, averageRating, totalReviews, ratingBreakdown, loading,
  canReview, alreadyReviewed, isVerifiedBuyer,
  fetchReviews, fetchCanReview,
} = useReviews()

const modalOpen = ref(false)
const lightboxImage = ref(null)

const photos = computed(() => reviews.value.filter((r) => r.review_image))

function breakdownPct(star) {
  const count = ratingBreakdown.value[String(star)] || 0
  return totalReviews.value ? Math.round((count / totalReviews.value) * 100) : 0
}

function formatDate(dt) {
  return new Date(dt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function load() {
  fetchReviews(props.product)
  if (auth.isAuthenticated) fetchCanReview(props.product)
}

onMounted(load)
</script>

<template>
  <section class="mx-auto mt-16 max-w-6xl border-t border-stone-200 px-6 py-16">
    <h2 class="font-display text-2xl font-semibold text-ink">Customer Reviews</h2>

    <div class="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-3">
      <!-- Summary -->
      <div>
        <p class="text-4xl font-semibold text-ink">{{ averageRating || '—' }}</p>
        <div class="mt-2 flex text-amber-400">
          <Star
            v-for="i in 5"
            :key="i"
            class="h-5 w-5"
            :class="i <= Math.round(averageRating) ? 'fill-amber-400' : 'fill-none text-stone-300'"
          />
        </div>
        <p class="mt-1 text-sm text-stone-500">{{ totalReviews }} review{{ totalReviews === 1 ? '' : 's' }}</p>

        <div class="mt-4 space-y-1.5">
          <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-2 text-xs text-stone-500">
            <span class="w-2">{{ star }}</span>
            <div class="h-1.5 flex-1 rounded-full bg-stone-200">
              <div class="h-full rounded-full bg-amber-400" :style="{ width: breakdownPct(star) + '%' }" />
            </div>
          </div>
        </div>

        <div class="mt-6">
          <button
            v-if="canReview"
            class="w-full rounded-md border border-stone-300 py-2 text-sm font-medium text-ink transition-colors hover:border-ink"
            @click="modalOpen = true"
          >
            Write a Review
          </button>
          <p v-else-if="alreadyReviewed" class="text-sm text-stone-500">You've already reviewed this product.</p>
          <p v-else-if="!auth.isAuthenticated" class="text-sm text-stone-500">
            <RouterLink :to="{ path: '/login', query: { redirect: route.fullPath } }" class="text-pine-600 underline">
              Log in
            </RouterLink>
            to write a review once your order is delivered.
          </p>
          <p v-else-if="!isVerifiedBuyer" class="text-sm text-stone-500">
            Purchased this item? You can leave a review once your order is delivered.
          </p>
        </div>
      </div>

      <!-- Photos + review list -->
      <div class="sm:col-span-2">
        <div v-if="photos.length" class="mb-8">
          <p class="text-sm font-medium text-ink">Photos from Customers</p>
          <div class="mt-3 flex gap-3 overflow-x-auto pb-2">
            <button
              v-for="p in photos"
              :key="p.name"
              class="h-20 w-20 shrink-0 overflow-hidden rounded-md"
              @click="lightboxImage = p.review_image"
            >
              <img :src="p.review_image" alt="" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>

        <p v-if="loading" class="text-stone-500">Loading reviews…</p>
        <p v-else-if="!reviews.length" class="text-stone-500">No reviews yet — be the first to share your thoughts.</p>

        <div v-else class="space-y-6">
          <div v-for="r in reviews" :key="r.name" class="border-b border-stone-200 pb-6">
            <div class="flex items-center gap-2">
              <p class="font-medium text-ink">{{ r.reviewer_name }}</p>
              <span
                v-if="r.verified_buyer"
                class="inline-flex items-center gap-1 rounded-full bg-pine-100 px-2 py-0.5 text-xs font-medium text-pine-700"
              >
                <BadgeCheck class="h-3.5 w-3.5" />
                Verified Buyer
              </span>
            </div>

            <div class="mt-1 flex items-center gap-2">
              <div class="flex text-amber-400">
                <Star
                  v-for="i in 5"
                  :key="i"
                  class="h-4 w-4"
                  :class="i <= r.rating ? 'fill-amber-400' : 'fill-none text-stone-300'"
                />
              </div>
              <span class="text-xs text-stone-400">{{ formatDate(r.creation) }}</span>
            </div>

            <p v-if="r.review_title" class="mt-2 font-medium text-ink">{{ r.review_title }}</p>
            <p v-if="r.review_text" class="mt-1 text-sm text-stone-600">{{ r.review_text }}</p>

            <button v-if="r.review_image" class="mt-3 h-16 w-16 overflow-hidden rounded-md" @click="lightboxImage = r.review_image">
              <img :src="r.review_image" alt="" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <WriteReviewModal
      v-if="modalOpen"
      :product="product"
      @close="modalOpen = false"
      @submitted="load"
    />

    <div
      v-if="lightboxImage"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      @click="lightboxImage = null"
    >
      <img :src="lightboxImage" alt="" class="max-h-[80vh] max-w-full rounded-lg object-contain" />
    </div>
  </section>
</template>
