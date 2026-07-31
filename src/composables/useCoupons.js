import { frappeCall } from '@/utils/call'

export function useCoupons() {
  async function listActiveCoupons() {
    return frappeCall.method('zenvora.api.coupons.list_active_coupons')
  }

  async function validateCoupon(coupon_code) {
    return frappeCall.postMethod('zenvora.api.coupons.validate_coupon', { coupon_code })
  }

  return { listActiveCoupons, validateCoupon }
}
