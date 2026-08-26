import { useMemo } from "react";
import { useTasks } from "../context/TaskContext";
import { useFinance } from "../context/FinanceContext";

function Alerts() {
  const { tasks } = useTasks();
  const { transactions } = useFinance();

  const alerts = useMemo(() => {
    const items: { icon: string; title: string; description: string }[] = [];
    const pending = tasks.filter((task) => !task.completed);

    if (pending.length > 0) {
      items.push({ icon: "✓", title: `${pending.length} tarefa${pending.length > 1 ? "s" : ""} pendente${pending.length > 1 ? "s" : ""}`, description: "Revise suas prioridades para não deixar nada importante para trás." });
    }

    const expenses = transactions.filter((item) => item.type === "expense");
    if (expenses.length > 0) {
      const total = expenses.reduce((sum, item) => sum + item.amount, 0);
      items.push({ icon: "R$", title: "Acompanhe seus gastos", description: `Você já registrou R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em despesas.` });
    }

    if (items.length === 0) {
      items.push({ icon: "✓", title: "Tudo tranquilo por aqui", description: "Quando o RotinaLeve identificar algo importante, ele aparecerá nesta tela." });
    }

    return items;
  }, [tasks, transactions]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="section-eyebrow">ATENÇÃO</span>
          <h1>Alertas</h1>
          <p>Informações importantes para você não esquecer.</p>
        </div>
      </div>

      <section className="panel" style={{ marginTop: 25 }}>
        <div className="panel-header"><div><span className="section-eyebrow">AGORA</span><h2>O que merece sua atenção</h2></div></div>
        <div className="task-list">
          {alerts.map((alert, index) => (
            <div className="task" key={`${alert.title}-${index}`}>
              <div className="alert-icon">{alert.icon}</div>
              <div className="task-info"><strong>{alert.title}</strong><div className="task-meta"><span>{alert.description}</span></div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="alert-card">
        <div className="alert-icon">🔔</div>
        <div><strong>Notificações no celular</strong><p>Essa é a próxima evolução: lembretes de contas, tarefas e compromissos diretamente no seu celular.</p></div>
      </section>
    </div>
  );
}

export default Alerts;
