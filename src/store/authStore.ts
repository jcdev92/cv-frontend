import { create } from 'zustand';
import api from '../api/axios';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: sessionStorage.getItem('token'),
  user: null,
  isAuthenticated: !!sessionStorage.getItem('token'),
  loading: true,

  login: (token: string) => {
    sessionStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
    get().checkAuth(); // Cargar datos del usuario tras hacer login
  },

  logout: () => {
    sessionStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false, loading: false });
  },

  checkAuth: async () => {
    const { token, logout } = get();
    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      console.error("Error validando token con Zustand", error);
      logout();
    } finally {
      set({ loading: false });
    }
  }
}));
