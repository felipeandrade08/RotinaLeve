import { useState } from "react";
import "./Habits.css";

type Habit = { id: string; title: string; category: string; frequency: string; completed: string[] };
const KEY = "rotinaleve-habits";
const seed: Habit[] = [
  { id: "h1", title: "Beber água", category: "Saúde", frequency: "Diário", completed: [] },
  { id: "h2", title: "Estudar programação", category: "Trabalho", frequency: "Diário", completed: [] },
  { id: "h3", title: "Guardar dinheiro", category: "Financeiro", frequency: "Semanal", completed: [] },
];
const load = (): Habit[] => { try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : seed; } catch { return seed; } };
const today = () => new Date().toISOString().slice(0, 10);
export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>(load);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Saúde");
  const [frequency, setFrequency] = useState("Diário");
  const save = (next: Habit[]) => { setHabits(next); localStorage.setItem(KEY, JSON.stringify(next)); };
  const done = habits.filter(h => h.completed.includes(today())).length;
  const toggle = (id: string) => save(habits.map(h => h.id === id ? { ...h, completed: h.completed.includes(today()) ? h.completed.filter(d => d !== today()) : [...h.completed, today()] } : h));
  const add = (e: React.FormEvent) => { e.preventDefault(); if (!title.trim()) return; save([...habits, { id: crypto.randomUUID(), title: title.trim(), category, frequency, completed: [] }]); setTitle(""); setOpen(false); };
  return <div className="page"><div className="page-header"><div><span className="section-eyebrow">CONSTÂNCIA</span><h1>Hábitos</h1><p>Pequenas ações hoje constroem uma vida mais leve amanhã.</p></div><button className="primary-button" onClick={() => setOpen(true)}>＋ Novo hábito</button></div><div className="habit-summary"><div><span>Hábitos ativos</span><strong>{habits.length}</strong></div><div><span>Feitos hoje</span><strong>{done}/{habits.length}</strong></div><div><span>Progresso</span><strong>{habits.length ? Math.round(done / habits.length * 100) : 0}%</strong></div></div><section className="panel habit-today"><div className="panel-header"><div><span className="section-eyebrow">HOJE</span><h2>Seu ritual de hoje</h2></div></div><div className="habit-list">{habits.map(h => { const checked = h.completed.includes(today()); return <div className={`habit-row ${checked ? "done" : ""}`} key={h.id}><button className="habit-check" onClick={() => toggle(h.id)}>{checked ? "✓" : ""}</button><div className="habit-info"><strong>{h.title}</strong><div><span>{h.category}</span><span>↻ {h.frequency}</span></div></div><div className="habit-streak">🔥 {h.completed.length}</div><button className="habit-delete" onClick={() => save(habits.filter(x => x.id !== h.id))}>×</button></div>; })}</div></section><div className="habit-tip"><span>💡</span><div><strong>Uma dica para você</strong><p>Comece pequeno. Consistência vale mais que perfeição.</p></div></div>{open && <div className="modal-overlay"><div className="modal"><div className="modal-header"><div><span className="section-eyebrow">NOVO HÁBITO</span><h2>O que você quer praticar?</h2></div><button onClick={() => setOpen(false)}>×</button></div><form onSubmit={add}><label>Nome do hábito<input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex.: Ler 20 minutos" /></label><div className="form-grid"><label>Categoria<select value={category} onChange={e => setCategory(e.target.value)}><option>Saúde</option><option>Trabalho</option><option>Financeiro</option><option>Pessoal</option></select></label><label>Frequência<select value={frequency} onChange={e => setFrequency(e.target.value)}><option>Diário</option><option>Semanal</option></select></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancelar</button><button className="primary-button">Criar hábito</button></div></form></div></div>}</div>;
}
