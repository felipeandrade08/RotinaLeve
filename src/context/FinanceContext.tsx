import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Transaction, TransactionType } from "../types";

const STORAGE_KEY = "rotinaleve-transactions";

type CreateTransactionData = {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
};

type FinanceContextType = {
  transactions: Transaction[];
  income: number;
  expenses: number;
  balance: number;
  addTransaction: (data: CreateTransactionData) => void;
  deleteTransaction: (id: string) => void;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

function loadTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Transaction[]) : [];
  } catch {
    return [];
  }
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  function addTransaction(data: CreateTransactionData) {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      ...data,
      amount: Math.abs(data.amount),
    };

    setTransactions((current) => [transaction, ...current]);
  }

  function deleteTransaction(id: string) {
    setTransactions((current) => current.filter((item) => item.id !== id));
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        income: totals.income,
        expenses: totals.expenses,
        balance: totals.balance,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error("useFinance precisa ser utilizado dentro de FinanceProvider.");
  }

  return context;
}
