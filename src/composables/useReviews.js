import { ref } from 'vue'
import { frappeCall } from '@/utils/call'

export function useReviews() {
  const reviews = ref([])
  const averageRating = ref(0)
  const totalReviews = ref(0)
  const ratingBreakdown = ref({})
  const loading = ref(false)
  const error = ref(null)

  const canReview = ref(false)
  const alreadyReviewed = ref(false)
  const isVerifiedBuyer = ref(false)

  async function fetchReviews(product) {
    loading.value = true
    error.value = null
    try {
      const data = await frappeCall.method('zenvora.api.reviews.get_product_reviews', { product })
      reviews.value = data.reviews
      averageRating.value = data.average_rating
      totalReviews.value = data.total_reviews
      ratingBreakdown.value = data.rating_breakdown
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchCanReview(product) {
    try {
      const data = await frappeCall.method('zenvora.api.reviews.can_user_review', { product })
      canReview.value = data.can_review
      alreadyReviewed.value = data.already_reviewed
      isVerifiedBuyer.value = data.is_verified_buyer
    } catch {
      canReview.value = false
    }
  }

  async function submitReview(product, { rating, review_title, review_text, review_image }) {
    const data = await frappeCall.postMethod('zenvora.api.reviews.submit_review', {
      product,
      rating,
      review_title,
      review_text,
      review_image,
    })
    await Promise.all([fetchReviews(product), fetchCanReview(product)])
    return data
  }

  async function uploadReviewImage(file) {
    return frappeCall.uploadFile(file)
  }

  return {
    reviews,
    averageRating,
    totalReviews,
    ratingBreakdown,
    loading,
    error,
    canReview,
    alreadyReviewed,
    isVerifiedBuyer,
    fetchReviews,
    fetchCanReview,
    submitReview,
    uploadReviewImage,
  }
}
