import TaskItem from './TaskItem'

function TaskList({ tasks, onDelete, onEdit, onToggleStatus }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>Nema pronađenih zadataka</h3>
        <p>Dodajte novi zadatak ili odaberite drugi filter.</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  )
}

export default TaskList
