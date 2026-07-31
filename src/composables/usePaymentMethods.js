import { frappeCall } from '@/utils/call'

export function usePaymentMethods() {
  async function getSavedPaymentMethods() {
    return frappeCall.method('zenvora.api.payment_methods.get_saved_payment_methods')
  }

  async function deleteSavedPaymentMethod(name) {
    return frappeCall.postMethod('zenvora.api.payment_methods.delete_saved_payment_method', { name })
  }

  return { getSavedPaymentMethods, deleteSavedPaymentMethod }
}
