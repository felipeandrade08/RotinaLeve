import { useState } from "react";
import { eventCategories, useEvents } from "../context/EventContext";
import type { TaskCategory } from "../types";

const today = () => new Date().toISOString().slice(0, 10);

function Agenda() {
  const { events, addEvent, deleteEvent } = useEvents();
  const [showModal, setShowModal] = useState(false);
  const [dateFilter, setDateFilter] = useState(today());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [category, setCategory] = useState<TaskCategory>("Pessoal");

  const filteredEvents = events.filter((event) => event.date === dateFilter);

  function resetForm() {
    setTitle("");
    setDescription("");
    setDate(today());
    setStartTime("09:00");
    setEndTime("10:00");
    setCategory("Pessoal");
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    addEvent({ title: title.trim(), description: description.trim() || undefined, date, startTime, endTime, category });
    setDateFilter(date);
    resetForm();
    setShowModal(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="section-eyebrow">ORGANIZAÇÃO</span>
          <h1>Agenda</h1>
          <p>Seus compromissos em um só lugar.</p>
        </div>
        <button className="primary-button" onClick={() => setShowModal(true)}>+ Novo compromisso</button>
      </div>

      <div className="agenda-toolbar">
        <button className="secondary-button" onClick={() => setDateFilter(today())}>Hoje</button>
        <label>
          <span>Visualizar dia</span>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </label>
      </div>

      <div className="agenda-list">
        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <div>▣</div>
            <strong>Nenhum compromisso neste dia</strong>
            <span>Adicione algo à sua agenda para manter o dia organizado.</span>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <article className="agenda-event" key={event.id}>
              <div className="agenda-event-time"><strong>{event.startTime}</strong><span>{event.endTime}</span></div>
              <div className="agenda-event-line" />
              <div className="agenda-event-info">
                <strong>{event.title}</strong>
                {event.description && <p>{event.description}</p>}
                <span>{event.category}</span>
              </div>
              <button className="delete-button" onClick={() => deleteEvent(event.id)} title="Excluir">🗑️</button>
            </article>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header"><div><span className="section-eyebrow">AGENDA</span><h2>Novo compromisso</h2></div><button onClick={() => setShowModal(false)}>×</button></div>
            <form onSubmit={submit}>
              <label>Compromisso<input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Reunião com cliente" /></label>
              <label>Descrição <span style={{ fontWeight: 400 }}>(opcional)</span><input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes do compromisso" /></label>
              <div className="form-grid">
                <label>Data<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
                <label>Categoria<select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>{eventCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>Início<input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></label>
                <label>Fim<input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></label>
              </div>
              <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowModal(false)}>Cancelar</button><button className="primary-button">Criar compromisso</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agenda;
