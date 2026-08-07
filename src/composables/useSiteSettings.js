import { ref } from 'vue'
import { frappeCall } from '@/utils/call'

export function useSiteSettings() {
  const settings = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchSettings() {
    loading.value = true
    error.value = null
    try {
      settings.value = await frappeCall.getDoc('Zenvora Settings', 'Zenvora Settings')
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { settings, loading, error, fetchSettings }
}
