/**
 * Tenant-aware API client.
 *
 * All requests include:
 *   - Authorization: Bearer <access_token>   (Auth0 JWT)
 *   - Content-Type: application/json
 *
 * The token is injected at call time — the client itself is stateless.
 * Usage: pass `getAccessToken` from `useApi()` hook (see useApi.ts).
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  method: string,
  path: string,
  token: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let code = 'unknown_error';
    try {
      const err = await res.json();
      code = err.error ?? code;
    } catch {
      // ignore parse error
    }
    throw new ApiError(res.status, code, `API ${method} ${path} failed: ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const envelope = await res.json();
  // Our backend wraps responses in { data: ... } or returns the object directly
  return (envelope.data ?? envelope) as T;
}

// ── Burgers ──────────────────────────────────────────────────────────────────

export interface ApiBurger {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  available: boolean;
}

export const burgersApi = {
  list: (token: string) => request<ApiBurger[]>('GET', '/v1/burgers', token),
  get: (token: string, id: string) => request<ApiBurger>('GET', `/v1/burgers/${id}`, token),
  create: (token: string, burger: Omit<ApiBurger, 'id'>) =>
    request<ApiBurger>('POST', '/v1/burgers', token, burger),
  update: (token: string, id: string, changes: Partial<ApiBurger>) =>
    request<ApiBurger>('PUT', `/v1/burgers/${id}`, token, changes),
  remove: (token: string, id: string) => request<void>('DELETE', `/v1/burgers/${id}`, token),
};

// ── Ingredients ──────────────────────────────────────────────────────────────

export interface ApiIngredient {
  id: string;
  name: string;
  category: string;
}

export const ingredientsApi = {
  list: (token: string) => request<ApiIngredient[]>('GET', '/v1/ingredients', token),
};

// ── Locations ─────────────────────────────────────────────────────────────────

export interface ApiLocation {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  active: boolean;
}

export const locationsApi = {
  list: (token: string) => request<ApiLocation[]>('GET', '/v1/locations', token),
};

// ── Orders ────────────────────────────────────────────────────────────────────

export interface ApiOrderItem {
  burger_id: string;
  quantity: number;
}

export interface CreateOrderInput {
  delivery_address: string;
  notes?: string;
  items: ApiOrderItem[];
}

interface CreateOrderResult {
  id: string;
  total_cents: number;
  status: string;
  /** Stripe client_secret for Stripe.js payment confirmation */
  client_secret?: string;
}

interface ApiOrder {
  id: string;
  status: string;
  total_cents: number;
  created_at: string;
  items?: ApiOrderItem[];
}

export const ordersApi = {
  list: (token: string) => request<ApiOrder[]>('GET', '/v1/orders', token),
  get: (token: string, id: string) => request<ApiOrder>('GET', `/v1/orders/${id}`, token),
  create: (token: string, input: CreateOrderInput) =>
    request<CreateOrderResult>('POST', '/v1/orders', token, input),
};

// ── Me ────────────────────────────────────────────────────────────────────────

interface ApiMe {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const meApi = {
  get: (token: string) => request<ApiMe>('GET', '/v1/me', token),
};
