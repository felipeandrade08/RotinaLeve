import { useMemo, useState } from "react";
import "./Goals.css";

type Goal = { id: string; title: string; category: string; target: number; current: number; deadline: string };
const key = "rotinaleve-goals";
const seed: Goal[] = [
  { id: "1", title: "Montar reserva de emergência", category: "Financeiro", target: 5000, current: 3200, deadline: "2026-12-31" },
  { id: "2", title: "Concluir curso de programação", category: "Trabalho", target: 10, current: 7, deadline: "2026-10-30" },
  { id: "3", title: "Ler 12 livros no ano", category: "Pessoal", target: 12, current: 5, deadline: "2026-12-20" },
];
function load(): Goal[] { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : seed; } catch { return seed; } }
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
function Goals() {
  const [goals, setGoals] = useState<Goal[]>(load);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Pessoal", target: "", current: "0", deadline: "" });
  const persist = (next: Goal[]) => { setGoals(next); localStorage.setItem(key, JSON.stringify(next)); };
  const completed = goals.filter(g => g.current >= g.target).length;
  const average = useMemo(() => goals.length ? Math.round(goals.reduce((s, g) => s + Math.min(100, (g.current / g.target) * 100), 0) / goals.length) : 0, [goals]);
  const addGoal = (e: React.FormEvent) => { e.preventDefault(); const target = Number(form.target); if (!form.title.trim() || !target || !form.deadline) return; persist([...goals, { id: crypto.randomUUID(), title: form.title.trim(), category: form.category, target, current: Number(form.current) || 0, deadline: form.deadline }]); setForm({ title: "", category: "Pessoal", target: "", current: "0", deadline: "" }); setOpen(false); };
  const remove = (id: string) => persist(goals.filter(g => g.id !== id));
  const increment = (goal: Goal) => persist(goals.map(g => g.id === goal.id ? { ...g, current: Math.min(g.target, g.current + 1) } : g));
  const displayValue = (g: Goal) => g.category === "Financeiro" ? `${money.format(g.current)} / ${money.format(g.target)}` : `${g.current} / ${g.target}`;
  return <div className="page"><div className="page-header"><div><span className="section-eyebrow">PROGRESSO</span><h1>Metas</h1><p>Transforme o que você quer em pequenos passos.</p></div><button className="primary-button" onClick={() => setOpen(true)}>＋ Nova meta</button></div>
    <div className="goal-summary"><div><span>Metas ativas</span><strong>{goals.length}</strong></div><div><span>Concluídas</span><strong>{completed}</strong></div><div><span>Progresso médio</span><strong>{average}%</strong></div></div>
    <div className="goals-grid">{goals.map(g => { const percent = Math.min(100, Math.round((g.current / g.target) * 100)); const done = percent >= 100; return <article className="goal-card" key={g.id}><div className="goal-card-top"><span className={`goal-tag ${g.category.toLowerCase()}`}>{g.category}</span><button className="delete-button" onClick={() => remove(g.id)} aria-label="Excluir meta">×</button></div><h2>{g.title}</h2><div className="goal-value"><strong>{displayValue(g)}</strong><span>{done ? "Concluída 🎉" : `${percent}%`}</span></div><div className="goal-progress"><div style={{ width: `${percent}%` }} /></div><div className="goal-footer"><span>Prazo: {new Intl.DateTimeFormat("pt-BR").format(new Date(`${g.deadline}T12:00:00`))}</span>{!done && <button onClick={() => increment(g)}>+1 progresso</button>}</div></article> })}{goals.length === 0 && <div className="empty-state"><div>🎯</div><strong>Nenhuma meta ainda</strong><span>Crie sua primeira meta e comece a acompanhar seu progresso.</span></div>}</div>
    {open && <div className="modal-overlay"><div className="modal"><div className="modal-header"><div><span className="section-eyebrow">NOVA META</span><h2>O que você quer alcançar?</h2></div><button onClick={() => setOpen(false)}>×</button></div><form onSubmit={addGoal}><label>Nome da meta<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex.: Guardar dinheiro para uma viagem" autoFocus /></label><div className="form-grid"><label>Categoria<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Pessoal</option><option>Trabalho</option><option>Financeiro</option><option>Saúde</option></select></label><label>Prazo<input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} /></label></div><div className="form-grid"><label>Objetivo<input type="number" min="1" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} placeholder="100" /></label><label>Progresso atual<input type="number" min="0" value={form.current} onChange={e => setForm({ ...form, current: e.target.value })} /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancelar</button><button className="primary-button">Criar meta</button></div></form></div></div>}
  </div>;
}
export default Goals;
