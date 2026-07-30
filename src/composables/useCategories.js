import { ref } from 'vue'
import { frappeCall } from '@/utils/call'

export function useCategories() {
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      categories.value = await frappeCall.getList('Product Category', {
        fields: JSON.stringify(['name', 'category_name', 'image']),
        limit_page_length: 0,
      })
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { categories, loading, error, fetchCategories }
}
