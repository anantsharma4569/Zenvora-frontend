import { frappeCall } from '@/utils/call'

export function useAddresses() {
  async function getAddresses() {
    return frappeCall.method('zenvora.api.addresses.get_addresses')
  }

  async function createAddress(payload) {
    return frappeCall.postMethod('zenvora.api.addresses.create_address', payload)
  }

  async function deleteAddress(name) {
    return frappeCall.postMethod('zenvora.api.addresses.delete_address', { name })
  }

  async function setDefaultAddress(name) {
    return frappeCall.postMethod('zenvora.api.addresses.set_default_address', { name })
  }

  return { getAddresses, createAddress, deleteAddress, setDefaultAddress }
}
