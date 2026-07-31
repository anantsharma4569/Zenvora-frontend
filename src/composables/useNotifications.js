import { frappeCall } from '@/utils/call'

export function useNotifications() {
  async function getNotifications() {
    return frappeCall.method('zenvora.api.notifications.get_notifications')
  }

  async function markRead(name) {
    return frappeCall.postMethod('zenvora.api.notifications.mark_read', name ? { name } : {})
  }

  return { getNotifications, markRead }
}
