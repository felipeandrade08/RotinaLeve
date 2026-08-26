import { useMemo } from "react";
import { useTasks } from "../context/TaskContext";
import { useFinance } from "../context/FinanceContext";

function Alerts() {
  const { tasks } = useTasks();
  const { transactions } = useFinance();

  const alerts = useMemo(() => {
    const items: { icon: string; title: string; description: string; tone: string }[] = [];
    const pending = tasks.filter((task) => !task.completed);

    if (pending.length > 0) {
      items.push({
        icon: "✓",
        title: `${pending.length} tarefa${pending.length > 1 ? "s" : ""} pendente${pending.length > 1 ? "s" : ""}`,
        description: "Revise suas prioridades para não deixar nada importante para trás.",
        tone: "green",
      });
    }

    const expenses = transactions.filter((item) => item.type === "expense");
    if (expenses.length > 0) {
      const total = expenses.reduce((sum, item) => sum + item.amount, 0);
      items.push({
        icon: "R$",
        title: "Acompanhe seus gastos",
        description: `Você já registrou R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em despesas.`,
        tone: "orange",
      });
    }

    if (items.length === 0) {
      items.push({
        icon: "✓",
        title: "Tudo tranquilo por aqui",
        description: "Quando o RotinaLeve identificar algo importante, ele aparecerá nesta tela.",
        tone: "green",
      });
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

      <div className="alerts-list">
        {alerts.map((alert, index) => (
          <article className="alert-item" key={`${alert.title}-${index}`}>
            <div className={`alert-item-icon ${alert.tone}`}>{alert.icon}</div>
            <div className="alert-item-content">
              <strong>{alert.title}</strong>
              <p>{alert.description}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="coming-soon alert-roadmap">
        <strong>Próxima evolução</strong>
        <p>Alertas de vencimento, tarefas atrasadas e notificações push no celular.</p>
      </section>
    </div>
  );
}

export default Alerts;
