import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import '../Account/Account.css';

const Tracking = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [doc, setDoc] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // No requiere login en la vida real, pero aquí dejamos acceso abierto
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    // Stub de seguimiento
    if (!code || !doc) {
      setStatus('Ingresa el número de pedido y tu documento.');
      return;
    }
    setStatus(`Buscando el pedido ${code} para el documento ${doc}... (demo)`);
  };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout" style={{gridTemplateColumns: '1fr'}}>
          <section className="account-content">
            <div className="account-hero">
              <div className="hero-icon" aria-hidden>🔍</div>
              <div className="hero-texts">
                <h1 className="account-title">Sigue tu pedido</h1>
                <p className="account-sub">Consulta el estado actual de tu pedido</p>
              </div>
            </div>

            <form className="profile-form" onSubmit={onSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label>Número de pedido</label>
                  <input value={code} onChange={(e) => setCode(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Documento de identidad</label>
                  <input value={doc} onChange={(e) => setDoc(e.target.value)} />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Consultar</button>
              </div>
              {status && <div className="form-status" role="status">{status}</div>}
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
