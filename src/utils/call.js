import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './authTokens'

const BASE_URL = import.meta.env.VITE_FRAPPE_BASE_URL || ''

function extractErrorMessage(data) {
  if (!data) return 'Request failed'
  if (data.message && typeof data.message === 'object' && data.message.message) {
    return data.message.message
  }
  if (typeof data.message === 'string') return data.message
  if (data._server_messages) {
    try {
      const outer = JSON.parse(data._server_messages)
      const inner = JSON.parse(outer[0])
      if (inner.message) return inner.message
    } catch {
      /* fall through to generic messages below */
    }
  }
  return data.exception || 'Request failed'
}

async function rawRequest(path, { method = 'GET', body, params } = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v))
  }

  const token = getAccessToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  return { res, data }
}

let refreshPromise = null
function tryRefresh() {
  const refresh_token = getRefreshToken()
  if (!refresh_token) return Promise.resolve(false)

  if (!refreshPromise) {
    refreshPromise = rawRequest('/api/method/zenvora.api.auth.refresh', {
      method: 'POST',
      body: { refresh_token },
    })
      .then(({ res, data }) => {
        if (res.ok && data?.message?.access_token) {
          setTokens(data.message)
          return true
        }
        clearTokens()
        return false
      })
      .catch(() => {
        clearTokens()
        return false
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

async function request(path, opts = {}) {
  let { res, data } = await rawRequest(path, opts)

  // Access tokens are short-lived (1h) — retry once after a silent refresh
  // instead of forcing the user to log in again every time it expires.
  if (res.status === 401 && getRefreshToken() && !opts._isRetry) {
    if (await tryRefresh()) {
      ;({ res, data } = await rawRequest(path, opts))
    }
  }

  if (!res.ok) {
    throw new Error(extractErrorMessage(data))
  }
  return data.message ?? data.data ?? data
}

export const frappeCall = {
  // GET /api/resource/:doctype
  getList: (doctype, params) => request(`/api/resource/${doctype}`, { params }),
  // GET /api/resource/:doctype/:name
  getDoc: (doctype, name) => request(`/api/resource/${doctype}/${encodeURIComponent(name)}`),
  // POST /api/resource/:doctype
  createDoc: (doctype, doc) => request(`/api/resource/${doctype}`, { method: 'POST', body: doc }),
  // whitelisted method call (GET) -> /api/method/...
  method: (dottedPath, params) => request(`/api/method/${dottedPath}`, { params }),
  // whitelisted method call (POST with JSON body) -> /api/method/...
  postMethod: (dottedPath, body) => request(`/api/method/${dottedPath}`, { method: 'POST', body }),
}
