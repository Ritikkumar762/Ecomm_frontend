import { apiClient } from '@/lib/api-client';
import { LoginCredentials, LoginResponse } from '../types/auth.types';

export const authService = {
  /** `POST /auth/login` — the only way this app authenticates. No mock fallback: an invalid
   * credential or an unreachable backend must surface as a real error, never a demo login. */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  /** `POST /auth/logout` — revokes the current session server-side using the `sid` claim of
   * the access token. Best-effort: if the token already expired, there is nothing to revoke. */
  async logout(): Promise<void> {
    await apiClient.post<void>('/auth/logout');
  },

  /** `GET /users/me` — the signed-in account's current public profile. */
  async getCurrentUser() {
    const response = await apiClient.get<{ user: LoginResponse['user'] }>('/users/me');
    return response.data.user;
  },
};
