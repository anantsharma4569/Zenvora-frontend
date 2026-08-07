import { ref } from 'vue'
import { frappeCall } from '@/utils/call'
import { useInventory } from '@/composables/useInventory'

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

  const { getProductsStock } = useInventory()

  let query = {}
  // Bumped on every fetchProducts/loadMore call so a slow, superseded request
  // (e.g. the old category's page-2 "Load More" landing after the user has
  // already switched category) can detect it's stale and discard itself
  // instead of corrupting the currently-displayed grid.
  let requestId = 0

  async function applyStock(list, id) {
    try {
      const stockMap = await getProductsStock(list.map((p) => p.name))
      if (id !== requestId) return
      list.forEach((p) => {
        p.in_stock = stockMap[p.name]
      })
    } catch {
      // the Out of Stock badge is a nice-to-have — a failed stock lookup
      // shouldn't blank out an otherwise-successful product grid
    }
  }

  async function fetchProducts({ category, search, limit = 40 } = {}) {
    query = { category, search, limit }
    const id = ++requestId
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
      if (id !== requestId) return
      products.value = results
      hasMore.value = results.length === limit
      applyStock(results, id)
    } catch (e) {
      if (id === requestId) error.value = e.message
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  async function loadMore() {
    if (loading.value || !hasMore.value) return
    const id = ++requestId
    loading.value = true
    try {
      const filters = buildFilters(query)
      const results = await frappeCall.getList('Product', {
        fields: JSON.stringify(PRODUCT_FIELDS),
        filters: filters.length ? JSON.stringify(filters) : undefined,
        limit_page_length: query.limit,
        limit_start: products.value.length,
      })
      if (id !== requestId) return
      products.value = [...products.value, ...results]
      hasMore.value = results.length === query.limit
      applyStock(results, id)
    } catch (e) {
      if (id === requestId) error.value = e.message
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  async function fetchProduct(name) {
    return frappeCall.getDoc('Product', name)
  }

  return { products, loading, error, hasMore, fetchProducts, loadMore, fetchProduct }
}
