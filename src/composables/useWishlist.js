import { frappeCall } from '@/utils/call'

export function useWishlist() {
  async function getWishlist() {
    return frappeCall.method('zenvora.api.wishlist.get_wishlist')
  }

  async function toggleWishlist(product) {
    return frappeCall.postMethod('zenvora.api.wishlist.toggle_wishlist', { product })
  }

  async function removeFromWishlist(name) {
    return frappeCall.postMethod('zenvora.api.wishlist.remove_from_wishlist', { name })
  }

  return { getWishlist, toggleWishlist, removeFromWishlist }
}
