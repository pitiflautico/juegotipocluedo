import { create } from 'zustand';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  stats?: any;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.login(email, password);
      set({
        user: response.data?.user || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  register: async (name, email, password, passwordConfirmation) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.register(name, email, password, passwordConfirmation);
      set({
        user: response.data?.user || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    const token = api.getToken();
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await api.me();
      set({
        user: response.data?.user || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      api.clearToken();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
