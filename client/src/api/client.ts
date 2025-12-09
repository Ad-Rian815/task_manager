const API_BASE = (import.meta as any).env?.VITE_API_BASE || '/api';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string,string> || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  const txt = await res.text();
  try {
    const json = txt ? JSON.parse(txt) : null;
    if (!res.ok) throw json || { message: 'Request failed' };
    return json;
  } catch (err) {
    // if JSON parse or error
    throw err;
  }
}
