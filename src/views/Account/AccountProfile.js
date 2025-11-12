import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import './Account.css';
import AccountSidebar from './AccountSidebar';

//iconos
import { HiOutlineUserCircle } from "react-icons/hi2";// usuario


const AccountProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(UserController.getCurrentUser());

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [personal, setPersonal] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '' });
  const [contact, setContact] = useState({ email: user?.email || '', phone: user?.phone || '' });
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    }
  }, [navigate]);

  useEffect(() => {
    const u = UserController.getCurrentUser();
    setUser(u);
    if (u) {
      setPersonal({ firstName: u.firstName, lastName: u.lastName });
      setContact({ email: u.email, phone: u.phone || '' });
    }
  }, []);

  if (!user) return null;

  const onLogout = () => { UserController.logout(); navigate('/'); };

  const savePersonal = () => {
    const ok = UserController.updateUserInfo(personal);
    setStatus(ok ? 'Datos personales actualizados.' : 'No fue posible guardar.');
    if (ok) setUser(UserController.getCurrentUser());
    setEditingPersonal(false);
  };

  const saveContact = () => {
    const ok = UserController.updateUserInfo(contact);
    setStatus(ok ? 'Información de contacto actualizada.' : 'No fue posible guardar.');
    if (ok) setUser(UserController.getCurrentUser());
    setEditingContact(false);
  };

  const savePassword = () => {
    if (!newPassword.trim()) { setStatus('Ingresa una nueva contraseña.'); return; }
    const ok = UserController.updatePassword(newPassword.trim());
    setStatus(ok ? 'Contraseña actualizada.' : 'No fue posible actualizar la contraseña.');
    if (ok) setNewPassword('');
    setChangingPassword(false);
  };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          <AccountSidebar onLogout={onLogout} />

          <section className="account-content">
            <div className="account-hero"> 
              <HiOutlineUserCircle size={52} color="#ffffffff" /> 
              <div className="hero-texts">
                <h1 className="account-title">Mis datos</h1>
              </div>
            </div>

            <div className="data-panels">
              {/* Información personal */}
              <div className="data-panel">
                <div className="panel-head">
                  <h3 className="panel-title">Información personal</h3>
                  {!editingPersonal && (
                    <button className="edit-link" onClick={() => setEditingPersonal(true)}>
                      ✎ Editar
                    </button>
                  )}
                </div>
                <div className="panel-body">
                  <div className="line">
                    <div className="line-label">{`${user.firstName} ${user.lastName}`}</div>
                    <div className="line-muted">Sin registrar</div>
                  </div>
                  <div className="line">
                    <div className="line-label">Contraseña</div>
                    <div className="line-value">********</div>
                    {!changingPassword ? (
                      <button className="edit-link" onClick={() => setChangingPassword(true)}>Cambiar</button>
                    ) : (
                      <div className="inline-form">
                        <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <div className="inline-actions">
                          <button className="btn-primary" onClick={savePassword}>Guardar</button>
                          <button className="linklike" onClick={() => { setChangingPassword(false); setNewPassword(''); }}>Cancelar</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {editingPersonal && (
                    <div className="inline-form">
                      <div className="form-row">
                        <div className="form-field">
                          <label>Nombres</label>
                          <input value={personal.firstName} onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })} />
                        </div>
                        <div className="form-field">
                          <label>Apellidos</label>
                          <input value={personal.lastName} onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })} />
                        </div>
                      </div>
                      <div className="inline-actions">
                        <button className="btn-primary" onClick={savePersonal}>Guardar</button>
                        <button className="linklike" onClick={() => setEditingPersonal(false)}>Cancelar</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Información de contacto */}
              <div className="data-panel">
                <div className="panel-head">
                  <h3 className="panel-title">Información de contacto</h3>
                  {!editingContact && (
                    <button className="edit-link" onClick={() => setEditingContact(true)}>
                      ✎ Editar
                    </button>
                  )}
                </div>
                <div className="panel-body">
                  <div className="line">
                    <div className="line-label">Correo electrónico</div>
                    <div className="line-value">{user.email}</div>
                  </div>
                  <div className="line">
                    <div className="line-label">Teléfono celular</div>
                    <div className="line-value">{user.phone ? user.phone : ':0000000000'}</div>
                  </div>

                  {editingContact && (
                    <div className="inline-form">
                      <div className="form-row">
                        <div className="form-field">
                          <label>Correo electrónico</label>
                          <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                        </div>
                        <div className="form-field">
                          <label>Teléfono celular</label>
                          <input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                        </div>
                      </div>
                      <div className="inline-actions">
                        <button className="btn-primary" onClick={saveContact}>Guardar</button>
                        <button className="linklike" onClick={() => setEditingContact(false)}>Cancelar</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {status && <div className="form-status" role="status" style={{marginBlockStart: '16px'}}>{status}</div>}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
