function Landing({ onStart }) {
  return (
    <section className="landing">
      <div className="landing-content">
        <p className="eyebrow">React + json-server + Cloud Run</p>
        <h1>Student Task Manager</h1>
        <p className="landing-copy">
          Jednostavna kontrolna ploča za praćenje studentskih zadataka,
          rokova, prioriteta i statusa završetka.
        </p>
        <button className="primary-button" type="button" onClick={onStart}>
          Otvori kontrolnu ploču
        </button>
      </div>
      <div className="landing-preview" aria-label="Pregled kontrolne ploče">
        <div className="preview-bar"></div>
        <div className="preview-row strong"></div>
        <div className="preview-row"></div>
        <div className="preview-grid">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>
  )
}

export default Landing
