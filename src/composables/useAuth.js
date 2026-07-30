import { ref } from 'vue'
import { frappeCall } from '@/utils/call'

const currentUser = ref(null)

export function useAuth() {
  async function login(usr, pwd) {
    const res = await fetch('/api/method/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ usr, pwd }),
    })
    if (!res.ok) throw new Error('Invalid credentials')
    await fetchCurrentUser()
  }

  async function fetchCurrentUser() {
    currentUser.value = await frappeCall.method('frappe.auth.get_logged_user')
    return currentUser.value
  }

  async function logout() {
    await frappeCall.method('logout')
    currentUser.value = null
  }

  return { currentUser, login, logout, fetchCurrentUser }
}
