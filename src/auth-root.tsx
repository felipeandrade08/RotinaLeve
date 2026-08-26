import App from "./App";
import Auth from "./pages/Auth";
import { useAuth } from "./context/AuthContext";

export default function AuthRoot() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui", color: "#718096" }}>Carregando seu RotinaLeve...</div>;
  return user ? <App /> : <Auth />;
}
