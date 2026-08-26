export type TaskPriority = "Baixa" | "Média" | "Alta";

export type TaskCategory =
  | "Trabalho"
  | "Financeiro"
  | "Pessoal"
  | "Saúde"
  | "Outros";

export type Task = {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
};

export type Event = {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  category: TaskCategory;
};

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
};
