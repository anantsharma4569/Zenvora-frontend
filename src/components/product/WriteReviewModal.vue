<script setup>
import { ref } from 'vue'
import { Star, ImagePlus, X } from '@lucide/vue'
import { useReviews } from '@/composables/useReviews'
import Button from '@/components/common/Button.vue'

const props = defineProps({
  product: { type: String, required: true },
})
const emit = defineEmits(['close', 'submitted'])

const { submitReview, uploadReviewImage } = useReviews()

const rating = ref(0)
const hoverRating = ref(0)
const title = ref('')
const comment = ref('')
const imageFile = ref(null)
const imagePreview = ref(null)
const submitting = ref(false)
const error = ref(null)

function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function clearImage() {
  imageFile.value = null
  imagePreview.value = null
}

async function handleSubmit() {
  if (!rating.value) {
    error.value = 'Please select a star rating'
    return
  }

  submitting.value = true
  error.value = null
  try {
    let review_image
    if (imageFile.value) {
      review_image = await uploadReviewImage(imageFile.value)
    }

    await submitReview(props.product, {
      rating: rating.value,
      review_title: title.value,
      review_text: comment.value,
      review_image,
    })
    emit('submitted')
    emit('close')
  } catch (e) {
    error.value = e.message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" @click.self="emit('close')">
    <div class="w-full max-w-md rounded-lg bg-stone-50 p-6 shadow-xl">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-lg font-semibold text-ink">Write a Review</h2>
        <button class="text-stone-400 hover:text-ink" @click="emit('close')">
          <X class="h-5 w-5" />
        </button>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="text-sm font-medium text-ink">Your Rating</label>
          <div class="mt-2 flex gap-1">
            <button
              v-for="i in 5"
              :key="i"
              type="button"
              @click="rating = i"
              @mouseenter="hoverRating = i"
              @mouseleave="hoverRating = 0"
            >
              <Star
                class="h-7 w-7"
                :class="i <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'fill-none text-stone-300'"
              />
            </button>
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-ink" for="review-title">Review Title</label>
          <input
            id="review-title"
            v-model="title"
            type="text"
            placeholder="Sum it up in a few words"
            class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-ink" for="review-comment">Review</label>
          <textarea
            id="review-comment"
            v-model="comment"
            rows="4"
            placeholder="What did you like or dislike?"
            class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-ink">Add a Photo (optional)</label>
          <div v-if="imagePreview" class="relative mt-2 h-24 w-24">
            <img :src="imagePreview" alt="" class="h-full w-full rounded-md object-cover" />
            <button
              type="button"
              class="absolute -right-2 -top-2 rounded-full bg-ink p-1 text-white"
              @click="clearImage"
            >
              <X class="h-3 w-3" />
            </button>
          </div>
          <label
            v-else
            class="mt-2 flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-stone-300 text-stone-400 hover:border-ink hover:text-ink"
          >
            <ImagePlus class="h-5 w-5" />
            <span class="text-xs">Upload</span>
            <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
          </label>
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <Button class="w-full" :disabled="submitting">
          {{ submitting ? 'Submitting…' : 'Submit Review' }}
        </Button>
      </form>
    </div>
  </div>
</template>
