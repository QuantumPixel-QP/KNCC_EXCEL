export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const config = { ...options, headers };
  return fetch(url, config);
}
