function TaskItem({ task, onDelete, onEdit, onToggleStatus }) {
  const isDone = task.status === 'done'
  const priorityLabels = {
    low: 'Nizak prioritet',
    medium: 'Srednji prioritet',
    high: 'Visok prioritet',
  }
  const statusLabels = {
    pending: 'Nezavršeno',
    done: 'Završeno',
  }

  return (
    <article className={`task-item ${isDone ? 'is-done' : ''}`}>
      <div className="task-main">
        <div>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
        <div className="task-meta">
          <span>{task.deadline}</span>
          <span className={`pill priority-${task.priority}`}>
            {priorityLabels[task.priority]}
          </span>
          <span className={`pill status-${task.status}`}>
            {statusLabels[task.status]}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <button
          className={isDone ? 'secondary-button' : 'primary-button'}
          type="button"
          onClick={() => onToggleStatus(task)}
        >
          {isDone ? 'Vrati na nezavršeno' : 'Označi kao završeno'}
        </button>
        <button className="secondary-button" type="button" onClick={() => onEdit(task)}>
          Uredi
        </button>
        <button className="danger-button" type="button" onClick={() => onDelete(task.id)}>
          Obriši
        </button>
      </div>
    </article>
  )
}

export default TaskItem
