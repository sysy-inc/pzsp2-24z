import create from 'zustand';

interface AuthState {
  user: { id: number; name: string } | null;
  login: (user: { id: number; name: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
