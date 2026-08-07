import { frappeCall } from '@/utils/call'

export function useInventory() {
  // -> { sizes: [...], stock: { Small: 4, Medium: 0, ... }, in_stock: bool }
  async function getProductStock(product) {
    return frappeCall.method('zenvora.api.inventory.get_product_stock', { product })
  }

  // -> { [productName]: boolean } for a whole grid in one call
  async function getProductsStock(products) {
    if (!products.length) return {}
    return frappeCall.method('zenvora.api.inventory.get_products_stock', {
      products: JSON.stringify(products),
    })
  }

  return { getProductStock, getProductsStock }
}
