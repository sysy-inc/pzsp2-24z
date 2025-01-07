import { create } from 'zustand';


interface AuthState {
  user: { email: string; role: string } | null;
  login: (email: string, role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (email, role) => set({ user: { email, role } }),
  logout: () => set({ user: null }),
}));
