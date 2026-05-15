const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}

export async function apiRequest(path, options = {}) {
  const url = apiUrl(path);
  const headers = options.headers || {};

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  headers['Accept'] = headers['Accept'] || 'application/json';

  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}
