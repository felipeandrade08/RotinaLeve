import App from "./App";
import Auth from "./pages/Auth";
import { useAuth } from "./context/AuthContext";

export default function AuthRoot() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0F172A", color: "#F8FAFC", fontFamily: "Inter, system-ui, sans-serif" }}><div style={{ display: "grid", justifyItems: "center", gap: 14 }}><img src="/logo-mark.svg" alt="RotinaLeve" style={{ width: 72, height: 72 }} /><strong style={{ fontSize: 18, letterSpacing: "-.03em" }}>RotinaLeve</strong><span style={{ opacity: .65, fontSize: 12 }}>Carregando seu dia mais leve...</span></div></div>;
  return user ? <App /> : <Auth />;
}
