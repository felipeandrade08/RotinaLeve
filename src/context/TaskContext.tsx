import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  Task,
  TaskCategory,
  TaskPriority,
} from "../types";

import { loadTasks, saveTasks } from "../utils/storage";

type CreateTaskData = {
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (data: CreateTaskData) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  function addTask(data: CreateTaskData) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      category: data.category,
      priority: data.priority,
      dueDate: data.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((current) => [newTask, ...current]);
  }

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task,
      ),
    );
  }

  function deleteTask(id: string) {
    setTasks((current) =>
      current.filter((task) => task.id !== id),
    );
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error(
      "useTasks precisa ser utilizado dentro de TaskProvider.",
    );
  }

  return context;
}