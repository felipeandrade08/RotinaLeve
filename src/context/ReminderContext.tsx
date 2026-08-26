import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useEvents } from "./EventContext";
import { useTasks } from "./TaskContext";
import { useFinance } from "./FinanceContext";

type Reminder = { id: string; title: string; description: string; kind: "task" | "event" | "finance"; priority: "Alta" | "Média" | "Baixa" };

type ReminderContextType = { reminders: Reminder[]; dismissed: string[]; dismiss: (id: string) => void; restore: () => void };
const ReminderContext = createContext<ReminderContextType | undefined>(undefined);
const STORAGE_KEY = "rotinaleve-dismissed-reminders";

export function ReminderProvider({ children }: { children: ReactNode }) {
  const { tasks } = useTasks();
  const { events } = useEvents();
  const { transactions } = useFinance();
  const [dismissed, setDismissed] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[]; } catch { return []; }
  });

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed)), [dismissed]);

  const reminders = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const items: Reminder[] = [];
    tasks.filter((t) => !t.completed && t.dueDate && t.dueDate <= today).forEach((t) => items.push({ id: `task-${t.id}`, title: `Tarefa pendente: ${t.title}`, description: "Essa tarefa merece sua atenção hoje.", kind: "task", priority: t.priority }));
    events.filter((e) => e.date === today).forEach((e) => items.push({ id: `event-${e.id}`, title: `Compromisso hoje: ${e.title}`, description: `${e.startTime} às ${e.endTime}.`, kind: "event", priority: "Alta" }));
    transactions.filter((t) => t.type === "expense" && t.date === today).forEach((t) => items.push({ id: `finance-${t.id}`, title: `Despesa registrada: ${t.description}`, description: `R$ ${t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`, kind: "finance", priority: "Baixa" }));
    return items.filter((item) => !dismissed.includes(item.id));
  }, [tasks, events, transactions, dismissed]);

  return <ReminderContext.Provider value={{ reminders, dismissed, dismiss: (id) => setDismissed((v) => [...v, id]), restore: () => setDismissed([]) }}>{children}</ReminderContext.Provider>;
}

export function useReminders() { const context = useContext(ReminderContext); if (!context) throw new Error("useReminders precisa ser utilizado dentro de ReminderProvider."); return context; }
