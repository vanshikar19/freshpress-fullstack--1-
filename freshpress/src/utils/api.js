const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return sessionStorage.getItem('fp_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── Auth ─────────────────────────────────────────────────────────
export const authApi = {
  login:    (body)   => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  register: (body)   => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me:       ()       => request('/auth/me'),
  logout:   ()       => request('/auth/logout', { method: 'POST' }),
};

// ── Orders ───────────────────────────────────────────────────────
export const ordersApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/orders${qs ? `?${qs}` : ''}`);
  },
  get:          (id)     => request(`/orders/${id}`),
  create:       (body)   => request('/orders',         { method: 'POST',  body: JSON.stringify(body) }),
  updateStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  update:       (id, body)   => request(`/orders/${id}`,        { method: 'PUT',   body: JSON.stringify(body) }),
  delete:       (id)     => request(`/orders/${id}`,   { method: 'DELETE' }),
  dashboard:    ()       => request('/orders/dashboard'),
};
