import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Task, TaskCategory, TaskPriority } from "../types";
import { api, type ApiTask } from "../lib/api";

type CreateTaskData = {
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string;
};

type TaskContextType = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (data: CreateTaskData) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reloadTasks: () => Promise<void>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const priorityToApi: Record<TaskPriority, ApiTask["priority"]> = {
  Baixa: "low",
  Média: "medium",
  Alta: "high",
};

const priorityFromApi: Record<ApiTask["priority"], TaskPriority> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const categories: TaskCategory[] = [
  "Trabalho",
  "Financeiro",
  "Pessoal",
  "Saúde",
  "Outros",
];

function normalizeTask(task: ApiTask): Task {
  return {
    id: task.id,
    title: task.title,
    category: categories.includes(task.category as TaskCategory)
      ? (task.category as TaskCategory)
      : "Outros",
    priority: priorityFromApi[task.priority] ?? "Média",
    completed: task.completed,
    dueDate: task.due_date ?? undefined,
    createdAt: task.created_at,
  };
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reloadTasks() {
    try {
      setError(null);
      const result = await api.getTasks();
      setTasks(result.tasks.map(normalizeTask));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar as tarefas.");
    }
  }

  useEffect(() => {
    reloadTasks().finally(() => setLoading(false));
  }, []);

  async function addTask(data: CreateTaskData) {
    try {
      setError(null);
      const result = await api.createTask({
        title: data.title,
        category: data.category,
        priority: priorityToApi[data.priority],
        due_date: data.dueDate || null,
      });
      setTasks((current) => [normalizeTask(result.task), ...current]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar a tarefa.");
      throw err;
    }
  }

  async function toggleTask(id: string) {
    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask) return;

    try {
      setError(null);
      const result = await api.updateTask(id, {
        completed: !currentTask.completed,
      });
      const updated = normalizeTask(result.task);
      setTasks((current) => current.map((task) => (task.id === id ? updated : task)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar a tarefa.");
    }
  }

  async function deleteTask(id: string) {
    try {
      setError(null);
      await api.deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível excluir a tarefa.");
    }
  }

  return (
    <TaskContext.Provider value={{ tasks, loading, error, addTask, toggleTask, deleteTask, reloadTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks precisa ser utilizado dentro de TaskProvider.");
  return context;
}
