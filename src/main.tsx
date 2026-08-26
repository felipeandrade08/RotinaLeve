import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";
import { TaskProvider } from "./context/TaskContext";
import { FinanceProvider } from "./context/FinanceContext";
import { EventProvider } from "./context/EventContext";
import { ReminderProvider } from "./context/ReminderContext";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // O app continua funcionando normalmente sem o service worker.
    });
  });
}

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
