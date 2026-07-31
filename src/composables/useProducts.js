import { ref } from 'vue'
import { frappeCall } from '@/utils/call'

const PRODUCT_FIELDS = [
  'name', 'product_name', 'price', 'compare_at_price', 'category',
  'on_sale', 'rating', 'review_count', 'image_1', 'image_2', 'description',
]

export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchProducts({ category, limit = 40, start = 0 } = {}) {
    loading.value = true
    error.value = null
    try {
      products.value = await frappeCall.getList('Product', {
        fields: JSON.stringify(PRODUCT_FIELDS),
        filters: category ? JSON.stringify([['category', '=', category]]) : undefined,
        limit_page_length: limit,
        limit_start: start,
      })
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(name) {
    return frappeCall.getDoc('Product', name)
  }

  return { products, loading, error, fetchProducts, fetchProduct }
}
