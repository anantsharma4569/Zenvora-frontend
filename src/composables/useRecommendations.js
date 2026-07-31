import { frappeCall } from '@/utils/call'

export function useRecommendations() {
  async function getRecommendations({ excludeProduct, limit = 8 } = {}) {
    return frappeCall.method('zenvora.api.recommendations.get_recommendations', {
      exclude_product: excludeProduct,
      limit,
    })
  }

  return { getRecommendations }
}
