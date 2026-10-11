import type { ApiErrorBody } from '@/types/api';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

let csrfToken: string | undefined;

function readCsrfCookie() {
  if (typeof document === 'undefined') return undefined;
  const value = document.cookie.split('; ').find((item) => item.startsWith('ekayn_csrf='))?.split('=').slice(1).join('=');
  if (!value) return undefined;
  try { return decodeURIComponent(value); } catch { return value; }
}

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); this.name = 'ApiError'; }
}

async function getCsrfToken(force = false) {
  csrfToken = readCsrfCookie();
  if (csrfToken && !force) return csrfToken;
  const response = await fetch(`${API_URL}/api/auth/csrf`, { credentials: 'include' });
  if (!response.ok) return undefined;
  const data = await response.json() as { token?: string };
  csrfToken = data.token;
  if (csrfToken && typeof document !== 'undefined') document.cookie = `ekayn_csrf=${encodeURIComponent(csrfToken)}; Path=/; Max-Age=86400; SameSite=Lax`;
  return csrfToken;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase();
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
    const token = await getCsrfToken(true);
    if (token) headers.set('X-CSRF-Token', token);
  }
  let response = await fetch(`${API_URL}${path}`, { ...init, headers, credentials: 'include' });
  if (response.status === 403 && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
    csrfToken = undefined;
    const retryHeaders = new Headers(headers);
    const token = await getCsrfToken(true);
    if (token) retryHeaders.set('X-CSRF-Token', token);
    response = await fetch(`${API_URL}${path}`, { ...init, headers: retryHeaders, credentials: 'include' });
  }
  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get('content-type') ?? '';
  const body = contentType.includes('json') ? await response.json() as ApiErrorBody & T : await response.text();
  if (!response.ok) {
    const message = typeof body === 'object' && body ? body.error ?? body.message : String(body);
    throw new ApiError(response.status, message || `Erreur ${response.status}`);
  }
  return body as T;
}

export const json = (value: unknown) => JSON.stringify(value);
