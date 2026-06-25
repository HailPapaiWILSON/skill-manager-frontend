import { useAuthStore } from "../stores/auth";

export function useAuth() {
  const { user, token, setAuth, logout, isAdmin } = useAuthStore();
  return { user, token, setAuth, logout, isAdmin };
}
