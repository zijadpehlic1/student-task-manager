import { useState } from 'react'

const emptyTask = {
  title: '',
  description: '',
  deadline: '',
  priority: 'medium',
}

function TaskForm({ editingTask, onCancel, onSave }) {
  const [formData, setFormData] = useState(() => {
    if (editingTask) {
      return {
        title: editingTask.title,
        description: editingTask.description,
        deadline: editingTask.deadline,
        priority: editingTask.priority,
      }
    }

    return emptyTask
  })

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await onSave(formData)
    setFormData(emptyTask)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <p className="eyebrow">{editingTask ? 'Uredi zadatak' : 'Novi zadatak'}</p>
      <h2>{editingTask ? 'Ažuriraj obavezu' : 'Dodaj obavezu'}</h2>

      <label>
        Naslov
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Prezentacija za Cloud Run"
          required
        />
      </label>

      <label>
        Opis
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Pripremiti bilješke za prezentaciju"
          rows="4"
          required
        />
      </label>

      <label>
        Rok
        <input
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Prioritet
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="low">Nizak</option>
          <option value="medium">Srednji</option>
          <option value="high">Visok</option>
        </select>
      </label>

      <div className="form-actions">
        <button className="primary-button" type="submit">
          {editingTask ? 'Sačuvaj izmjene' : 'Dodaj zadatak'}
        </button>
        {editingTask && (
          <button className="secondary-button" type="button" onClick={onCancel}>
            Odustani
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
