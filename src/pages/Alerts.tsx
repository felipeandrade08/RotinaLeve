import { useReminders } from "../context/ReminderContext";

function Alerts() {
  const { reminders, restore } = useReminders();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="section-eyebrow">ATENÇÃO</span>
          <h1>Alertas</h1>
          <p>O RotinaLeve acompanha o que merece sua atenção.</p>
        </div>
        {reminders.length === 0 && <button className="secondary-button" onClick={restore}>Restaurar alertas</button>}
      </div>
      <section className="panel" style={{ marginTop: 25 }}>
        <div className="panel-header"><div><span className="section-eyebrow">AGORA</span><h2>{reminders.length ? `${reminders.length} aviso${reminders.length > 1 ? "s" : ""}` : "Tudo tranquilo por aqui"}</h2></div></div>
        <div className="task-list">
          {reminders.length ? reminders.map((alert) => (
            <div className="task" key={alert.id}>
              <div className="alert-icon">{alert.kind === "event" ? "▣" : alert.kind === "finance" ? "R$" : "✓"}</div>
              <div className="task-info"><strong>{alert.title}</strong><div className="task-meta"><span>{alert.description}</span><span className={`priority ${alert.priority.toLowerCase()}`}>{alert.priority}</span></div></div>
            </div>
          )) : <div className="empty-state"><div>✓</div><strong>Nenhum alerta pendente</strong><span>Quando algo importante acontecer, aparecerá aqui.</span></div>}
        </div>
      </section>
      <section className="alert-card"><div className="alert-icon">🔔</div><div><strong>Próxima evolução: notificações no celular</strong><p>O motor de alertas já está preparado. A próxima etapa será transformar esses avisos em notificações reais.</p></div></section>
    </div>
  );
}

export default Alerts;
