import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";

import { TaskProvider } from "./context/TaskContext";
import { FinanceProvider } from "./context/FinanceContext";
import { EventProvider } from "./context/EventContext";
import { ReminderProvider } from "./context/ReminderContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TaskProvider>
      <FinanceProvider>
        <EventProvider>
          <ReminderProvider>
            <App />
          </ReminderProvider>
        </EventProvider>
      </FinanceProvider>
    </TaskProvider>
  </StrictMode>,
);
