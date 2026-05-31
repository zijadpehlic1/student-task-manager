import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from './api/tasksApi'
import Header from './components/Header'
import Landing from './components/Landing'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

const filters = [
  { id: 'all', label: 'Svi' },
  { id: 'pending', label: 'Nezavršeni' },
  { id: 'done', label: 'Završeni' },
  { id: 'high', label: 'Visok prioritet' },
]

function App() {
  const [view, setView] = useState('landing')
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isAppView = view === 'dashboard'

  useEffect(() => {
    if (!isAppView) {
      return
    }

    let ignore = false

    async function loadTasks() {
      try {
        setLoading(true)
        setError('')
        const data = await getTasks()
        if (!ignore) {
          setTasks(data)
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadTasks()

    return () => {
      ignore = true
    }
  }, [isAppView])

  const filteredTasks = useMemo(() => {
    if (filter === 'pending') {
      return tasks.filter((task) => task.status === 'pending')
    }

    if (filter === 'done') {
      return tasks.filter((task) => task.status === 'done')
    }

    if (filter === 'high') {
      return tasks.filter((task) => task.priority === 'high')
    }

    return tasks
  }, [filter, tasks])

  async function handleSaveTask(taskData) {
    try {
      setError('')

      if (editingTask) {
        const savedTask = await updateTask(editingTask.id, {
          ...editingTask,
          ...taskData,
        })
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === savedTask.id ? savedTask : task,
          ),
        )
        setEditingTask(null)
        return
      }

      const savedTask = await createTask({
        ...taskData,
        status: 'pending',
      })
      setTasks((currentTasks) => [savedTask, ...currentTasks])
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  async function handleDeleteTask(id) {
    try {
      setError('')
      await deleteTask(id)
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
      if (editingTask?.id === id) {
        setEditingTask(null)
      }
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  async function handleToggleStatus(task) {
    try {
      setError('')
      const nextStatus = task.status === 'done' ? 'pending' : 'done'
      const savedTask = await updateTaskStatus(task.id, nextStatus)
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === savedTask.id ? savedTask : currentTask,
        ),
      )
    } catch (statusError) {
      setError(statusError.message)
    }
  }

  function handleLogout() {
    setView('landing')
    setEditingTask(null)
    setFilter('all')
  }

  if (view === 'landing') {
    return (
      <main>
        <Landing onStart={() => setView('login')} />
      </main>
    )
  }

  if (view === 'login') {
    return (
      <main>
        <Login onLogin={() => setView('dashboard')} onBack={() => setView('landing')} />
      </main>
    )
  }

  return (
    <div className="app-shell">
      <Header onLogout={handleLogout} />

      <main className="workspace">
        <Dashboard tasks={tasks} />

        <section className="task-layout" aria-label="Upravljanje zadacima">
          <TaskForm
            key={editingTask?.id || 'new-task'}
            editingTask={editingTask}
            onCancel={() => setEditingTask(null)}
            onSave={handleSaveTask}
          />

          <div className="task-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Lista zadataka</p>
                <h2>Studentske obaveze</h2>
              </div>
              <div className="filters" aria-label="Filteri zadataka">
                {filters.map((item) => (
                  <button
                    key={item.id}
                    className={filter === item.id ? 'active' : ''}
                    type="button"
                    onClick={() => setFilter(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="state-message error">{error}</p>}
            {loading ? (
              <p className="state-message">Učitavanje zadataka...</p>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onDelete={handleDeleteTask}
                onEdit={setEditingTask}
                onToggleStatus={handleToggleStatus}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
