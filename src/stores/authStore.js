import { defineStore } from 'pinia'
import { frappeCall } from '@/utils/call'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/utils/authTokens'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // { email, full_name, user_image }
    loading: false,
    error: null,
  }),

  getters: {
    // Deriving this from `state.user` (not a direct localStorage read) is what
    // makes it reactive — Vue's computed caching can't detect localStorage
    // changes, so a getter reading it directly would never update the UI
    // after login/logout.
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async login(usr, pwd) {
      this.loading = true
      this.error = null
      try {
        const data = await frappeCall.postMethod('zenvora.api.auth.login', { usr, pwd })
        setTokens(data)
        this.user = data.user
      } catch (e) {
        this.error = e.message
        throw e
      } finally {
        this.loading = false
      }
    },

    async register(email, full_name, password, phone) {
      this.loading = true
      this.error = null
      try {
        const data = await frappeCall.postMethod('zenvora.api.auth.register', { email, full_name, password, phone })
        setTokens(data)
        this.user = data.user
      } catch (e) {
        this.error = e.message
        throw e
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await frappeCall.postMethod('zenvora.api.auth.logout', { refresh_token: getRefreshToken() })
      } catch {
        // clear local session regardless of whether the server call succeeded
      }
      clearTokens()
      this.user = null
    },

    async fetchMe() {
      this.user = await frappeCall.method('zenvora.api.auth.me')
      return this.user
    },

    async hydrate() {
      if (!getAccessToken()) return
      try {
        await this.fetchMe()
      } catch {
        clearTokens()
        this.user = null
      }
    },
  },
})
