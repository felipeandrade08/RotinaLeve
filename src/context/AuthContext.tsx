import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, type AuthUser } from "../lib/api";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("rotinaleve-token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.me()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => {
        localStorage.removeItem("rotinaleve-token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async login(email, password) {
      const result = await api.login({ email, password });
      localStorage.setItem("rotinaleve-token", result.token);
      setUser(result.user);
    },
    async register(name, email, password) {
      const result = await api.register({ name, email, password });
      localStorage.setItem("rotinaleve-token", result.token);
      setUser(result.user);
    },
    logout() {
      localStorage.removeItem("rotinaleve-token");
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
