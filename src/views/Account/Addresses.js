import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import './Account.css';
import AccountSidebar from './AccountSidebar';

const emptyAddress = { name: '', street: '', city: '', notes: '' };

const Addresses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(UserController.getCurrentUser());
  const [addresses, setAddresses] = useState(user?.getAddresses() || []);
  const [form, setForm] = useState(emptyAddress);

  useEffect(() => {
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    }
  }, [navigate]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addAddress = (e) => {
    e.preventDefault();
    const ok = UserController.addAddress({ ...form, id: 'addr_' + Date.now() });
    if (ok) {
      const refreshed = UserController.getCurrentUser().getAddresses();
      setAddresses(refreshed);
      setForm(emptyAddress);
    }
  };

  const onLogout = () => { UserController.logout(); navigate('/'); };

  if (!user) return null;

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          <AccountSidebar onLogout={onLogout} />

          <section className="account-content">
            <div className="account-hero">
              <div className="hero-icon" aria-hidden>📍</div>
              <div className="hero-texts">
                <h1 className="account-title">Direcciones de envío</h1>
                <p className="account-sub">Agrega, edita y/o elimina una dirección</p>
              </div>
            </div>

            <div className="account-grid">
              {addresses.length === 0 ? (
                <div className="account-card" style={{gridColumn: '1 / -1'}}>
                  <strong>No tienes direcciones guardadas.</strong>
                  <span>Usa el formulario para registrar una nueva.</span>
                </div>
              ) : (
                addresses.map((a) => (
                  <div key={a.id} className="account-card">
                    <div className="card-title">{a.name || 'Dirección'}</div>
                    <div className="card-desc">{a.street} {a.city ? `- ${a.city}` : ''}</div>
                    {a.notes && <small className="card-desc">Notas: {a.notes}</small>}
                  </div>
                ))
              )}
            </div>

            <form className="addresses-form" onSubmit={addAddress}>
              <div className="form-row">
                <div className="form-field">
                  <label>Nombre de la dirección</label>
                  <input name="name" value={form.name} onChange={onChange} placeholder="Casa / Oficina" required />
                </div>
                <div className="form-field">
                  <label>Ciudad</label>
                  <input name="city" value={form.city} onChange={onChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field" style={{gridColumn: '1 / -1'}}>
                  <label>Dirección</label>
                  <input name="street" value={form.street} onChange={onChange} placeholder="Calle 123 #45-67, Apto 101" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field" style={{gridColumn: '1 / -1'}}>
                  <label>Notas</label>
                  <textarea name="notes" value={form.notes} onChange={onChange} rows={3} placeholder="Punto de referencia, torre, etc." />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Agregar dirección</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Addresses;
