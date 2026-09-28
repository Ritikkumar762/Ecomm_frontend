import { LoginCredentials, AuthResponse } from '../types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulating API network call
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (credentials.email === 'admin@ecomm.com' || credentials.email.includes('@')) {
      return {
        user: {
          id: 'usr_admin_01',
          name: 'Ritik Admin',
          email: credentials.email,
          role: 'admin',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        },
        token: 'mock_jwt_token_sample_abc_123',
      };
    }

    throw new Error('Invalid email or password credentials.');
  },
};
