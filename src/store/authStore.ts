import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  tenantName: string;
  roles: string[];
  plan?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  },
  
  setLoading: (loading) => set({ isLoading: loading }),

  login: (user, token) => {
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false
    });
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  refreshToken: async () => {
    try {
      // TODO: Implement token refresh logic with your auth provider
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      set({ isLoading: false });
    }
  }
}));

