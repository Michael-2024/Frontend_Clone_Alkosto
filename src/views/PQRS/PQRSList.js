import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pqrsController from '../../controllers/PQRSController';
import UserController from '../../controllers/UserController';
import './PQRSList.css';

const PQRSList = () => {
  const navigate = useNavigate();
  const [pqrsList, setPqrsList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    loadPQRS();
    
    // Suscribirse a cambios
    const unsubscribe = pqrsController.addChangeListener(() => {
      loadPQRS();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    filterPQRS();
  }, [pqrsList, selectedType, selectedStatus, searchTerm]);

  const loadPQRS = async () => {
    try {
      setLoading(true);
      const data = await pqrsController.list();
      setPqrsList(data);
      
      // Calcular estadísticas
      const stats = pqrsController.getStatistics(data);
      setStatistics(stats);
    } catch (error) {
      console.error('Error al cargar PQRS:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPQRS = () => {
    let filtered = [...pqrsList];

    // Filtrar por tipo
    if (selectedType !== 'Todos') {
      filtered = pqrsController.filterByType(filtered, selectedType);
    }

    // Filtrar por estado
    if (selectedStatus !== 'Todos') {
      filtered = pqrsController.filterByStatus(filtered, selectedStatus);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(pqrs =>
        pqrs.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pqrs.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pqrs.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredList(filtered);
  };

  const handleViewDetail = (ticketNumber) => {
    navigate(`/perfil/pqrs/${ticketNumber}`);
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'Abierto': 'badge-blue',
      'En Proceso': 'badge-orange',
      'Resuelto': 'badge-green',
      'Cerrado': 'badge-gray'
    };
    return classes[status] || 'badge-gray';
  };

  const getTypeBadgeClass = (type) => {
    const classes = {
      'Petición': 'badge-info',
      'Queja': 'badge-warning',
      'Reclamo': 'badge-danger',
      'Sugerencia': 'badge-success'
    };
    return classes[type] || 'badge-gray';
  };

  if (loading) {
    return (
      <div className="pqrs-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando PQRS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pqrs-list-container">
      <div className="pqrs-list-header">
        <div className="header-content">
          <h1>Mis PQRS</h1>
          <button
            className="btn-new-pqrs"
            onClick={() => navigate('/perfil/pqrs/nuevo')}
          >
            + Nueva Solicitud
          </button>
        </div>
        <p className="subtitle">Gestiona tus peticiones, quejas, reclamos y sugerencias</p>
      </div>

      {/* Estadísticas */}
      {statistics && (
        <div className="pqrs-statistics">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{statistics.total}</h3>
              <p>Total de solicitudes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{statistics.pending}</h3>
              <p>Pendientes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{statistics.byStatus.resuelto}</h3>
              <p>Resueltas</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>{statistics.overdue}</h3>
              <p>Fuera de tiempo</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="pqrs-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por número de radicado o asunto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <label>Tipo:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Petición">Petición</option>
            <option value="Queja">Queja</option>
            <option value="Reclamo">Reclamo</option>
            <option value="Sugerencia">Sugerencia</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Estado:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Abierto">Abierto</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Resuelto">Resuelto</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>
      </div>

      {/* Lista de PQRS */}
      {filteredList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No hay solicitudes para mostrar</h3>
          <p>
            {pqrsList.length === 0
              ? 'Aún no has enviado ninguna PQRS'
              : 'No se encontraron resultados con los filtros seleccionados'}
          </p>
          {pqrsList.length === 0 && (
            <button
              className="btn-primary"
              onClick={() => navigate('/perfil/pqrs/nuevo')}
            >
              Enviar mi primera PQRS
            </button>
          )}
        </div>
      ) : (
        <div className="pqrs-list">
          {filteredList.map((pqrs) => (
            <div key={pqrs.id || pqrs.ticketNumber} className="pqrs-card">
              <div className="pqrs-card-header">
                <div className="pqrs-info">
                  <h3 className="pqrs-ticket">
                    {pqrs.ticketNumber}
                  </h3>
                  <div className="pqrs-badges">
                    <span className={`badge ${getTypeBadgeClass(pqrs.type)}`}>
                      {pqrs.type}
                    </span>
                    <span className={`badge ${getStatusBadgeClass(pqrs.status)}`}>
                      {pqrs.status}
                    </span>
                  </div>
                </div>
                <div className="pqrs-date">
                  <span className="date-label">Creado:</span>
                  <span className="date-value">
                    {new Date(pqrs.createdAt).toLocaleDateString('es-CO')}
                  </span>
                  <span className="elapsed-time">
                    ({pqrs.getElapsedTime()})
                  </span>
                </div>
              </div>

              <div className="pqrs-card-body">
                <h4 className="pqrs-subject">{pqrs.subject}</h4>
                <p className="pqrs-description">
                  {pqrs.description.length > 150
                    ? `${pqrs.description.substring(0, 150)}...`
                    : pqrs.description}
                </p>
              </div>

              <div className="pqrs-card-footer">
                <div className="pqrs-meta">
                  {!pqrs.isWithinResponseTime() && (
                    <span className="warning-badge">
                      ⚠️ Fuera de tiempo de respuesta
                    </span>
                  )}
                  {pqrs.orderId && (
                    <span className="order-badge">
                      📦 Pedido #{pqrs.orderId}
                    </span>
                  )}
                </div>
                <button
                  className="btn-view-detail"
                  onClick={() => handleViewDetail(pqrs.ticketNumber)}
                >
                  Ver detalles →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="pqrs-info-footer">
        <h3>Información sobre PQRS</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>⏱️ Tiempo de respuesta:</strong>
            <p>5 días hábiles máximo</p>
          </div>
          <div className="info-item">
            <strong>📧 Notificaciones:</strong>
            <p>Recibirás actualizaciones por email</p>
          </div>
          <div className="info-item">
            <strong>🔍 Seguimiento:</strong>
            <p>Usa tu número de radicado para hacer seguimiento</p>
          </div>
          <div className="info-item">
            <strong>📞 Contacto directo:</strong>
            <p>Línea: 01 8000 123 456</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PQRSList;
