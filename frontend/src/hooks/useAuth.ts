import { useAuthStore } from '../context/authStore';

export const useAuth = () => {
  const { user, login, logout } = useAuthStore();
  return { user, login, logout };
};
