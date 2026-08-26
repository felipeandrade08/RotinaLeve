import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Event, TaskCategory } from "../types";

const STORAGE_KEY = "rotinaleve-events";

type CreateEventData = Omit<Event, "id">;

type EventContextType = {
  events: Event[];
  addEvent: (data: CreateEventData) => void;
  deleteEvent: (id: string) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

function loadEvents(): Event[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Event[]) : [];
  } catch {
    return [];
  }
}

export const eventCategories: TaskCategory[] = ["Trabalho", "Pessoal", "Saúde", "Financeiro", "Outros"];

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(loadEvents);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)),
    [events],
  );

  function addEvent(data: CreateEventData) {
    setEvents((current) => [...current, { id: crypto.randomUUID(), ...data }]);
  }

  function deleteEvent(id: string) {
    setEvents((current) => current.filter((event) => event.id !== id));
  }

  return <EventContext.Provider value={{ events: sortedEvents, addEvent, deleteEvent }}>{children}</EventContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents precisa ser utilizado dentro de EventProvider.");
  return context;
}
