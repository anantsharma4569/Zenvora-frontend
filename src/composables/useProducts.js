import { ref } from 'vue'
import { frappeCall } from '@/utils/call'

export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchProducts({ itemGroup, limit = 20, start = 0 } = {}) {
    loading.value = true
    error.value = null
    try {
      products.value = await frappeCall.getList('Item', {
        fields: JSON.stringify([
          'name', 'item_name', 'item_code', 'description',
          'standard_rate', 'image', 'item_group',
        ]),
        filters: itemGroup ? JSON.stringify([['item_group', '=', itemGroup]]) : undefined,
        limit_page_length: limit,
        limit_start: start,
      })
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(itemCode) {
    return frappeCall.getDoc('Item', itemCode)
  }

  async function createSalesOrder(payload) {
    // payload: { customer, items: [{ item_code, qty, rate }], ... }
    return frappeCall.createDoc('Sales Order', payload)
  }

  return { products, loading, error, fetchProducts, fetchProduct, createSalesOrder }
}
