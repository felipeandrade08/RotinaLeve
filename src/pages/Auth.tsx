import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

export default function Auth() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (mode === "register" && password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível concluir.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand"><div className="auth-mark">R</div><div><strong>RotinaLeve</strong><span>Seu dia, mais leve.</span></div></div>
        <div className="auth-heading">
          <span className="auth-eyebrow">BEM-VINDO</span>
          <h1>{mode === "login" ? "Entre na sua rotina" : "Crie sua conta"}</h1>
          <p>{mode === "login" ? "Organize sua vida de um jeito simples e leve." : "Comece hoje a deixar seus dias mais leves."}</p>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === "register" && <label>Nome<input value={name} onChange={e => setName(e.target.value)} placeholder="Como podemos chamar você?" required /></label>}
          <label>E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" required /></label>
          <label>Senha<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" minLength={6} required /></label>
          {mode === "register" && <label>Confirmar senha<input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repita sua senha" minLength={6} required /></label>}
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-submit" disabled={submitting}>{submitting ? "Aguarde..." : mode === "login" ? "Entrar no RotinaLeve" : "Criar minha conta"}</button>
        </form>
        <div className="auth-switch">
          {mode === "login" ? "Ainda não tem uma conta?" : "Já possui uma conta?"}
          <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>{mode === "login" ? "Criar conta" : "Entrar"}</button>
        </div>
      </section>
    </main>
  );
}
