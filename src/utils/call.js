const BASE_URL = import.meta.env.VITE_FRAPPE_BASE_URL || ''

function getCsrfToken() {
  return window.csrf_token || import.meta.env.VITE_FRAPPE_CSRF_TOKEN || ''
}

async function request(path, { method = 'GET', body, params } = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v))
  }

  const res = await fetch(url, {
    method,
    credentials: 'include', // send Frappe session cookie
    headers: {
      'Content-Type': 'application/json',
      'X-Frappe-CSRF-Token': getCsrfToken(),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.exception || data.message || `Request failed: ${res.status}`)
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
  // whitelisted method call -> /api/method/...
  method: (dottedPath, params) => request(`/api/method/${dottedPath}`, { params }),
}
