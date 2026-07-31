import { frappeCall } from '@/utils/call'

export function useWallet() {
  async function getWallet() {
    return frappeCall.method('zenvora.api.wallet.get_wallet')
  }

  return { getWallet }
}
