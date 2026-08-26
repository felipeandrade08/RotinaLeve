import { useMemo, useState } from "react";
import { useTasks } from "../context/TaskContext";
import type { TaskCategory, TaskPriority } from "../types";

type Filter = "all" | "pending" | "completed";

function Tasks() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "pending" && !task.completed) ||
        (filter === "completed" && task.completed);

      return matchesSearch && matchesFilter;
    });
  }, [tasks, filter, search]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="section-eyebrow">ORGANIZAÇÃO</span>
          <h1>Tarefas</h1>
          <p>Organize o que precisa ser feito.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowModal(true)}
        >
          + Nova tarefa
        </button>
      </div>

      <div className="task-toolbar">
        <input
          type="text"
          placeholder="🔎  Buscar tarefa..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="filters">
          <button
            className={filter === "all" ? "selected" : ""}
            onClick={() => setFilter("all")}
          >
            Todas
          </button>

          <button
            className={filter === "pending" ? "selected" : ""}
            onClick={() => setFilter("pending")}
          >
            Pendentes
          </button>

          <button
            className={filter === "completed" ? "selected" : ""}
            onClick={() => setFilter("completed")}
          >
            Concluídas
          </button>
        </div>
      </div>

      <div className="tasks-page-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div>✓</div>
            <strong>Nenhuma tarefa encontrada</strong>
            <span>
              Crie uma nova tarefa para começar.
            </span>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              className={`task-page-item ${
                task.completed ? "completed" : ""
              }`}
              key={task.id}
            >
              <button
                className="large-task-check"
                onClick={() => toggleTask(task.id)}
              >
                {task.completed ? "✓" : ""}
              </button>

              <div className="page-task-info">
                <strong>{task.title}</strong>

                <div>
                  <span>{task.category}</span>
                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>

                  {task.dueDate && (
                    <span>📅 {task.dueDate}</span>
                  )}
                </div>
              </div>

              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
                title="Excluir tarefa"
              >
                🗑
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <NewTaskModal
          onClose={() => setShowModal(false)}
          onCreate={(data) => {
            addTask(data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

type NewTaskModalProps = {
  onClose: () => void;
  onCreate: (data: {
    title: string;
    category: TaskCategory;
    priority: TaskPriority;
    dueDate?: string;
  }) => void;
};

function NewTaskModal({
  onClose,
  onCreate,
}: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<TaskCategory>("Pessoal");
  const [priority, setPriority] =
    useState<TaskPriority>("Média");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onCreate({
      title: title.trim(),
      category,
      priority,
      dueDate: dueDate || undefined,
    });
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="section-eyebrow">NOVA TAREFA</span>
            <h2>O que precisa ser feito?</h2>
          </div>

          <button onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Tarefa
            <input
              autoFocus
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Ex: Finalizar projeto"
            />
          </label>

          <div className="form-grid">
            <label>
              Categoria
              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value as TaskCategory,
                  )
                }
              >
                <option>Trabalho</option>
                <option>Financeiro</option>
                <option>Pessoal</option>
                <option>Saúde</option>
                <option>Outros</option>
              </select>
            </label>

            <label>
              Prioridade
              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value as TaskPriority,
                  )
                }
              >
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </label>
          </div>

          <label>
            Prazo
            <input
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
            />
          </label>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button type="submit" className="primary-button">
              Criar tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Tasks;