import type { Task } from "../types";

const TASKS_KEY = "rotinaleve_tasks";

export function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(TASKS_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as Task[];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}