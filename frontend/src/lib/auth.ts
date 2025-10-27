// Enhanced authentication functions
// This is a placeholder implementation for demonstration purposes

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  plan: 'starter' | 'professional' | 'enterprise';
  createdAt: string;
  lastLogin: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  company: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// Mock user data for demonstration
const MOCK_USER: User = {
  id: 'user_1',
  email: 'sarah@stratos.com',
  name: 'Sarah Chen',
  avatar: 'SC',
  role: 'admin',
  plan: 'professional',
  createdAt: '2023-01-15T00:00:00Z',
  lastLogin: new Date().toISOString(),
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    await delay(1000); // Simulate API call
    
    // Demo account check
    if (credentials.email === 'demo@stratos.com' && credentials.password === 'demo123') {
      return {
        success: true,
        user: { ...MOCK_USER, email: 'demo@stratos.com', name: 'Demo User' },
        token: 'demo_token_123',
      };
    }
    
    // Regular login validation (placeholder)
    if (credentials.email === 'sarah@stratos.com' && credentials.password === 'password123') {
      return {
        success: true,
        user: MOCK_USER,
        token: 'auth_token_123',
      };
    }
    
    // Invalid credentials
    return {
      success: false,
      error: 'Invalid email or password',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Login failed. Please try again.',
    };
  }
}

export async function signup(data: SignupData): Promise<AuthResponse> {
  try {
    await delay(1500); // Simulate API call
    
    // Basic validation
    if (!data.name || !data.email || !data.password || !data.company) {
      return {
        success: false,
        error: 'All fields are required',
      };
    }
    
    if (!data.agreeToTerms) {
      return {
        success: false,
        error: 'You must agree to the terms of service',
      };
    }
    
    if (data.password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters',
      };
    }
    
    // Check if email already exists (placeholder)
    if (data.email === 'existing@example.com') {
      return {
        success: false,
        error: 'An account with this email already exists',
      };
    }
    
    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      name: data.name,
      avatar: data.name.charAt(0).toUpperCase(),
      role: 'user',
      plan: 'starter',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    
    return {
      success: true,
      user: newUser,
      token: `auth_token_${Date.now()}`,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Signup failed. Please try again.',
    };
  }
}

export async function logout(): Promise<AuthResponse> {
  try {
    await delay(500); // Simulate API call
    
    // Clear any stored tokens/sessions
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
    
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Logout failed',
    };
  }
}

export async function requestPasswordReset(email: string): Promise<AuthResponse> {
  try {
    await delay(1000); // Simulate API call
    
    if (!email) {
      return {
        success: false,
        error: 'Email is required',
      };
    }
    
    // Check if email exists (placeholder)
    if (email === 'nonexistent@example.com') {
      return {
        success: false,
        error: 'No account found with this email address',
      };
    }
    
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Password reset request failed',
    };
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
  try {
    await delay(1000); // Simulate API call
    
    if (!token || !newPassword) {
      return {
        success: false,
        error: 'Token and new password are required',
      };
    }
    
    if (newPassword.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters',
      };
    }
    
    // Check if token is valid (placeholder)
    if (token === 'invalid_token') {
      return {
        success: false,
        error: 'Invalid or expired reset token',
      };
    }
    
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Password reset failed',
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    await delay(500); // Simulate API call
    
    // Check for stored token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        return MOCK_USER;
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export async function updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
  try {
    await delay(1000); // Simulate API call
    
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required',
      };
    }
    
    // Update user data (placeholder)
    const updatedUser = { ...MOCK_USER, ...updates };
    
    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Profile update failed',
    };
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
  try {
    await delay(1000); // Simulate API call
    
    if (!currentPassword || !newPassword) {
      return {
        success: false,
        error: 'Current and new passwords are required',
      };
    }
    
    if (newPassword.length < 6) {
      return {
        success: false,
        error: 'New password must be at least 6 characters',
      };
    }
    
    // Check current password (placeholder)
    if (currentPassword !== 'password123') {
      return {
        success: false,
        error: 'Current password is incorrect',
      };
    }
    
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Password change failed',
    };
  }
}

export async function enableTwoFactor(): Promise<AuthResponse> {
  try {
    await delay(1000); // Simulate API call
    
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Two-factor authentication setup failed',
    };
  }
}

export async function disableTwoFactor(): Promise<AuthResponse> {
  try {
    await delay(1000); // Simulate API call
    
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Two-factor authentication disable failed',
    };
  }
}

// Utility functions
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
}
