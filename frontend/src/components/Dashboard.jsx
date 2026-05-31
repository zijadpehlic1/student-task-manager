function Dashboard({ tasks }) {
  const doneTasks = tasks.filter((task) => task.status === 'done').length
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length
  const highPriorityTasks = tasks.filter((task) => task.priority === 'high').length

  const stats = [
    { label: 'Ukupno zadataka', value: tasks.length },
    { label: 'Završeni zadaci', value: doneTasks },
    { label: 'Nezavršeni zadaci', value: pendingTasks },
    { label: 'Visok prioritet', value: highPriorityTasks },
  ]

  return (
    <section className="dashboard" aria-label="Statistika zadataka">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </article>
      ))}
    </section>
  )
}

export default Dashboard
