/**
 * Modular API client with request/response interceptors, auth token handling,
 * and error abstraction for E-commerce API communication.
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

/**
 * The backend's terminal error shape (`src/http/middleware/error.ts` in
 * syntellite-headless-ecomm): `{ error: { code, message, details, requestId } }`.
 */
interface BackendErrorEnvelope {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, string[]>;
    requestId?: string;
  };
}

export class ApiError extends Error {
  status: number;
  code?: string;
  /** Field-level validation errors, when the backend rejected the request as a 400. */
  details?: Record<string, string[]>;
  requestId?: string;
  data: any;

  constructor(message: string, status: number, data?: BackendErrorEnvelope, opts?: { code?: string; details?: Record<string, string[]>; requestId?: string }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.code = opts?.code;
    this.details = opts?.details;
    this.requestId = opts?.requestId;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/** Reads the stored access token from the same key `use-auth` writes it under. */
function getStoredToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getStoredToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (error: any) {
    // The backend is unreachable (offline, wrong URL, CORS misconfiguration, DNS failure).
    throw new ApiError(
      error?.message || 'Could not reach the server. Please check your connection and try again.',
      0,
    );
  }

  // A 204 (logout, delete) has no body; parsing it as JSON would throw for no reason.
  const rawBody = response.status === 204 ? null : await response.text();
  const data = rawBody ? JSON.parse(rawBody) : null;

  if (!response.ok) {
    const envelope = (data ?? {}) as BackendErrorEnvelope;

    if (response.status === 401 && typeof window !== 'undefined') {
      // The token is missing, expired, or was rejected by the store-mismatch check —
      // clear it so the app does not keep retrying with a dead credential.
      localStorage.removeItem('auth_token');
    }

    throw new ApiError(
      envelope.error?.message || 'An HTTP error occurred',
      response.status,
      envelope,
      {
        code: envelope.error?.code,
        details: envelope.error?.details,
        requestId: envelope.error?.requestId,
      },
    );
  }

  return {
    data: data as T,
    success: true,
    status: response.status,
  };
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { method: 'GET', ...options }),
  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, { method: 'POST', ...(body !== undefined ? { body: JSON.stringify(body) } : {}), ...options }),
  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
};
