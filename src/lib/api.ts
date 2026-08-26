const getApiUrl = () => {
  const configured = import.meta.env.VITE_API_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  // GitHub Codespaces: when the frontend is opened through the public
  // 5173 tunnel, automatically target the matching 3001 backend tunnel.
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    const codespacesHost = hostname.replace(/-5173(?=\.app\.github\.dev$)/, "-3001");
    if (codespacesHost !== hostname) return `${protocol}//${codespacesHost}`;
  }

  return "http://localhost:3001";
};

const API_URL = getApiUrl();

export type AuthUser = {
  id: string;
  email: string;
  created_at: string;
  name?: string;
  avatar_url?: string | null;
  timezone?: string;
};

type AuthResponse = { user: AuthUser; token: string };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("rotinaleve-token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || "Não foi possível concluir a solicitação.");
  }
  return data as T;
}

export const api = {
  register: (payload: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () => request<{ user: AuthUser }>("/api/v1/auth/me"),
};
