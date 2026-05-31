const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error('Nije moguće povezati se sa servisom za zadatke.')
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function getTasks() {
  return request('/tasks?_sort=deadline')
}

export function createTask(task) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  })
}

export function updateTask(id, task) {
  return request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  })
}

export function updateTaskStatus(id, status) {
  return request(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  })
}
