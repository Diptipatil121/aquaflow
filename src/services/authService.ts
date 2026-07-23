import { delay } from '@/utils';
import { DEMO_CREDENTIALS } from '@/utils/constants';
import type { AuthResponse, LoginCredentials, SignupData, User } from '@/types';

const MOCK_USER: User = {
  id: 'USR-001',
  name: 'Admin User',
  email: DEMO_CREDENTIALS.email,
  role: 'admin',
  department: 'Operations',
  phone: '+1 (555) 123-4567',
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800);
    if (
      credentials.email === DEMO_CREDENTIALS.email &&
      credentials.password === DEMO_CREDENTIALS.password
    ) {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: MOCK_USER,
      };
    }
    throw { message: 'Invalid email or password', status: 401 };
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    await delay(1000);
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'USR-' + Date.now(),
        name: data.name,
        email: data.email,
        role: 'viewer',
      },
    };
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    await delay(800);
    return { message: `Password reset link sent to ${email}` };
  },

  async getProfile(): Promise<User> {
    await delay(500);
    return MOCK_USER;
  },
};
