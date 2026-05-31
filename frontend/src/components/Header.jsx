function Header({ onLogout }) {
  return (
    <header className="site-header">
      <div>
        <p className="eyebrow">OSiRO cloud projekat</p>
        <h1>Student Task Manager</h1>
      </div>
      <button className="secondary-button" type="button" onClick={onLogout}>
        Odjava
      </button>
    </header>
  )
}

export default Header
