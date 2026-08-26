import { useEffect, useState } from "react";
import "./Settings.css";

type SettingsProps = { onBack: () => void };

function Settings({ onBack }: SettingsProps) {
  const [notifications, setNotifications] = useState(() => localStorage.getItem("rotinaleve-notifications") !== "off");
  const [morning, setMorning] = useState(() => localStorage.getItem("rotinaleve-morning") !== "off");
  const [quiet, setQuiet] = useState(() => localStorage.getItem("rotinaleve-quiet") === "on");

  useEffect(() => localStorage.setItem("rotinaleve-notifications", notifications ? "on" : "off"), [notifications]);
  useEffect(() => localStorage.setItem("rotinaleve-morning", morning ? "on" : "off"), [morning]);
  useEffect(() => localStorage.setItem("rotinaleve-quiet", quiet ? "on" : "off"), [quiet]);

  return <div className="page"><div className="page-header"><div><span className="section-eyebrow">PERSONALIZAÇÃO</span><h1>Configurações</h1><p>Deixe o RotinaLeve do seu jeito.</p></div><button className="secondary-button" onClick={onBack}>← Voltar</button></div><div className="settings-grid"><section className="panel settings-section"><div className="settings-heading"><div className="settings-icon">🔔</div><div><h2>Notificações</h2><p>Escolha como o RotinaLeve pode chamar sua atenção.</p></div></div><SettingRow title="Notificações" description="Permitir alertas do aplicativo" value={notifications} onChange={setNotifications}/><SettingRow title="Resumo da manhã" description="Receba um resumo para começar o dia" value={morning} onChange={setMorning}/><SettingRow title="Modo silencioso" description="Evitar alertas durante seu horário de descanso" value={quiet} onChange={setQuiet}/></section><section className="panel settings-section"><div className="settings-heading"><div className="settings-icon">👤</div><div><h2>Meu perfil</h2><p>Informações básicas da sua experiência.</p></div></div><div className="profile-card"><div className="profile-avatar">F</div><div><strong>Felipe</strong><span>Usuário do RotinaLeve</span></div></div></section></div></div>;
}
function SettingRow({ title, description, value, onChange }: { title: string; description: string; value: boolean; onChange: (value: boolean) => void }) { return <div className="setting-row"><div><strong>{title}</strong><span>{description}</span></div><button className={`toggle ${value ? "on" : ""}`} aria-pressed={value} onClick={() => onChange(!value)}><span/></button></div>; }
export default Settings;
