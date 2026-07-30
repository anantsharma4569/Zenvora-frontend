const ACCESS_KEY = 'zenvora_access_token'
const REFRESH_KEY = 'zenvora_refresh_token'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function setTokens({ access_token, refresh_token }) {
  localStorage.setItem(ACCESS_KEY, access_token)
  localStorage.setItem(REFRESH_KEY, refresh_token)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}
