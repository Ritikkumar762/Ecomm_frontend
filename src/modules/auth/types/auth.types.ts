/**
 * Mirrors `UserResponse` in syntellite-headless-ecomm's identity module
 * (`src/modules/identity/dto.ts`) — an allowlist, so only these fields ever exist.
 */
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  emailVerified: boolean;
  acceptsMarketing: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Mirrors `LoginResponse` from `POST /auth/login`. Note there is no `isStaff`/role field —
 * the backend deliberately never puts a privilege claim on the wire (see
 * `docs/DECISIONS.md` §22 in the backend repo). Whether the signed-in account may reach the
 * admin endpoints is discovered by calling one, not by inspecting this response.
 */
export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  tokenType: 'Bearer';
  /** Seconds until the access token expires. */
  expiresIn: number;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  refreshToken: string;
}
