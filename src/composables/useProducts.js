import { ref } from 'vue'
import { frappeCall } from '@/utils/call'

const PRODUCT_FIELDS = [
  'name', 'product_name', 'price', 'compare_at_price', 'category',
  'on_sale', 'rating', 'review_count', 'image_1', 'image_2', 'description',
]

function buildFilters({ category, search }) {
  const filters = []
  if (category) filters.push(['category', '=', category])
  if (search) filters.push(['product_name', 'like', `%${search}%`])
  return filters
}

export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const hasMore = ref(false)

  let query = {}

  async function fetchProducts({ category, search, limit = 40 } = {}) {
    query = { category, search, limit }
    loading.value = true
    error.value = null
    try {
      const filters = buildFilters(query)
      const results = await frappeCall.getList('Product', {
        fields: JSON.stringify(PRODUCT_FIELDS),
        filters: filters.length ? JSON.stringify(filters) : undefined,
        limit_page_length: limit,
        limit_start: 0,
      })
      products.value = results
      hasMore.value = results.length === limit
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (loading.value || !hasMore.value) return
    loading.value = true
    try {
      const filters = buildFilters(query)
      const results = await frappeCall.getList('Product', {
        fields: JSON.stringify(PRODUCT_FIELDS),
        filters: filters.length ? JSON.stringify(filters) : undefined,
        limit_page_length: query.limit,
        limit_start: products.value.length,
      })
      products.value = [...products.value, ...results]
      hasMore.value = results.length === query.limit
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(name) {
    return frappeCall.getDoc('Product', name)
  }

  return { products, loading, error, hasMore, fetchProducts, loadMore, fetchProduct }
}
