import { useState } from "react";
import { useReminders } from "../context/ReminderContext";
import "./Alerts.css";

function Alerts() {
  const { reminders, restore } = useReminders();
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() => "Notification" in window ? Notification.permission : "unsupported");
  const [message, setMessage] = useState("");
  const requestNotifications = async () => {
    if (!("Notification" in window)) { setPermission("unsupported"); setMessage("Este navegador não oferece notificações."); return; }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") { setMessage("Notificações ativadas neste dispositivo."); new Notification("RotinaLeve", { body: "Tudo pronto. Você receberá seus próximos lembretes.", icon: "/favicon.svg" }); }
    else if (result === "denied") setMessage("As notificações foram bloqueadas. Você pode liberá-las nas configurações do navegador.");
  };
  return <div className="page"><div className="page-header"><div><span className="section-eyebrow">ATENÇÃO</span><h1>Alertas</h1><p>O RotinaLeve acompanha o que merece sua atenção.</p></div>{reminders.length===0&&<button className="secondary-button" onClick={restore}>Restaurar alertas</button>}</div>
    <section className="notification-setup"><div className="notification-visual">🔔</div><div className="notification-copy"><span className="section-eyebrow">NOTIFICAÇÕES</span><h2>{permission==="granted"?"Notificações ativadas":"Leve o RotinaLeve com você"}</h2><p>{permission==="granted"?"Este dispositivo está pronto para receber lembretes do RotinaLeve.":"Ative as notificações para receber lembretes de tarefas, agenda, hábitos e contas importantes."}</p>{permission!=="granted"&&<button className="primary-button" onClick={requestNotifications}>Ativar notificações</button>}{message&&<small className="notification-message">{message}</small>}</div><div className="notification-status"><span className={permission==="granted"?"status-dot on":"status-dot"}/><strong>{permission==="granted"?"Ativo":permission==="denied"?"Bloqueado":"Não configurado"}</strong></div></section>
    <section className="panel" style={{marginTop:25}}><div className="panel-header"><div><span className="section-eyebrow">CENTRAL</span><h2>{reminders.length?`${reminders.length} aviso${reminders.length>1?"s":""}`:"Tudo tranquilo por aqui"}</h2></div></div><div className="task-list">{reminders.length?reminders.map(alert=><div className="task" key={alert.id}><div className="alert-icon">{alert.kind==="event"?"▣":alert.kind==="finance"?"R$":"✓"}</div><div className="task-info"><strong>{alert.title}</strong><div className="task-meta"><span>{alert.description}</span><span className={`priority ${alert.priority.toLowerCase()}`}>{alert.priority}</span></div></div></div>):<div className="empty-state"><div>✓</div><strong>Nenhum alerta pendente</strong><span>Quando algo importante acontecer, aparecerá aqui.</span></div>}</div></section>
  </div>;
}
export default Alerts;
