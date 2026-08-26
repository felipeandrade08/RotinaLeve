import { useMemo, useState } from "react";
import { useFinance } from "../context/FinanceContext";
import type { TransactionType } from "../types";

const categories = ["Salário", "Freelance", "Alimentação", "Moradia", "Transporte", "Contas", "Lazer", "Saúde", "Outros"];

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function Finance() {
  const { transactions, income, expenses, balance, addTransaction, deleteTransaction } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");

  const recent = useMemo(() => transactions.slice(0, 8), [transactions]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="section-eyebrow">CONTROLE</span>
          <h1>Financeiro</h1>
          <p>Veja para onde seu dinheiro está indo.</p>
        </div>
        <button className="primary-button" onClick={() => setShowModal(true)}>+ Nova movimentação</button>
      </div>

      <div className="finance-cards">
        <article className="finance-big-card balance-card">
          <span>Saldo atual</span>
          <strong>{money.format(balance)}</strong>
          <small>Receitas menos despesas</small>
        </article>
        <article className="finance-big-card">
          <span>Receitas</span>
          <strong>{money.format(income)}</strong>
          <small>Entradas registradas</small>
        </article>
        <article className="finance-big-card">
          <span>Despesas</span>
          <strong>{money.format(expenses)}</strong>
          <small>Saídas registradas</small>
        </article>
      </div>

      <section className="panel finance-transactions">
        <div className="panel-header">
          <div><span className="section-eyebrow">MOVIMENTAÇÕES</span><h2>Últimas transações</h2></div>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state"><div>R$</div><strong>Nenhuma movimentação ainda</strong><span>Adicione sua primeira receita ou despesa.</span></div>
        ) : (
          <div className="transaction-list">
            {recent.map((item) => (
              <div className="transaction" key={item.id}>
                <div className={`transaction-icon ${item.type}`}>{item.type === "income" ? "+" : "−"}</div>
                <div className="transaction-info"><strong>{item.description}</strong><span>{item.category} · {item.date}</span></div>
                <strong className={item.type === "income" ? "income-value" : "expense-value"}>{item.type === "income" ? "+" : "−"} {money.format(item.amount)}</strong>
                <button className="delete-button" onClick={() => deleteTransaction(item.id)} title="Excluir">🗑</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {showModal && <FinanceModal type={type} setType={setType} onClose={() => setShowModal(false)} onCreate={(data) => { addTransaction(data); setShowModal(false); }} />}
    </div>
  );
}

type FinanceModalProps = { type: TransactionType; setType: (type: TransactionType) => void; onClose: () => void; onCreate: (data: { description: string; amount: number; type: TransactionType; category: string; date: string }) => void };

function FinanceModal({ type, setType, onClose, onCreate }: FinanceModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Outros");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = Number(amount.replace(",", "."));
    if (!description.trim() || !value || value < 0) return;
    onCreate({ description: description.trim(), amount: value, type, category, date });
  }

  return <div className="modal-overlay" onMouseDown={onClose}><div className="modal" onMouseDown={(e) => e.stopPropagation()}>
    <div className="modal-header"><div><span className="section-eyebrow">FINANCEIRO</span><h2>Nova movimentação</h2></div><button onClick={onClose}>×</button></div>
    <div className="finance-type-switch"><button className={type === "expense" ? "selected expense-tab" : ""} onClick={() => setType("expense")}>− Despesa</button><button className={type === "income" ? "selected income-tab" : ""} onClick={() => setType("income")}>+ Receita</button></div>
    <form onSubmit={submit}>
      <label>Descrição<input autoFocus value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Mercado" /></label>
      <div className="form-grid"><label>Valor<input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" /></label><label>Categoria<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label></div>
      <label>Data<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancelar</button><button className="primary-button" type="submit">Salvar</button></div>
    </form>
  </div></div>;
}

export default Finance;
