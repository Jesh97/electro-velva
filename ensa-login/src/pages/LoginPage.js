return (
  <div className="pantalla-centrada">
    <div className="ensa-card">

      <h1 className="ensa-title">Acceso ENSA</h1>

      <input
        className="ensa-input"
        type="text"
        name="user"
        placeholder="Usuario"
        onChange={handleChange}
      />

      <input
        className="ensa-input"
        type="password"
        name="pass"
        placeholder="Contraseña"
        onChange={handleChange}
      />

      <ENSAButton text="Iniciar sesión" onClick={handleLogin} />
    </div>
  </div>
);
