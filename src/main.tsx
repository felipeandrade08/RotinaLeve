import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";

import { TaskProvider } from "./context/TaskContext";
import { FinanceProvider } from "./context/FinanceContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TaskProvider>
      <FinanceProvider>
        <App />
      </FinanceProvider>
    </TaskProvider>
  </StrictMode>,
);
