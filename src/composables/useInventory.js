import { frappeCall } from '@/utils/call'

export function useInventory() {
  // -> { sizes: [...], stock: { Small: 4, Medium: 0, ... }, in_stock: bool }
  async function getProductStock(product) {
    return frappeCall.method('zenvora.api.inventory.get_product_stock', { product })
  }

  return { getProductStock }
}
