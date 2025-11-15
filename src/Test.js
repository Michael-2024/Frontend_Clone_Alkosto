// Componente de prueba para diagnosticar la conexión con el backend
import React, { useEffect, useState } from 'react';

const Test = () => {
  const [status, setStatus] = useState('Cargando...');
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Probando conexión con backend...');
        console.log('URL API:', process.env.REACT_APP_API_URL);
        
        const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
        const url = `${apiUrl}/productos/`;
        
        console.log('📡 Haciendo petición a:', url);
        
        const response = await fetch(url);
        console.log('📦 Respuesta recibida:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Datos recibidos:', data);
        console.log('📊 Total productos:', data.length);
        
        setProductos(data);
        setStatus(`✅ Conexión exitosa! ${data.length} productos encontrados`);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err.message);
        setStatus('❌ Error de conexión');
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔧 Diagnóstico de Conexión Backend</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Estado:</h2>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{status}</p>
      </div>

      {error && (
        <div style={{ background: '#ffebee', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ color: '#c62828' }}>Error:</h3>
          <pre>{error}</pre>
        </div>
      )}

      <div>
        <h2>Configuración:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
          REACT_APP_API_URL: {process.env.REACT_APP_API_URL || 'No definido (usando default)'}
          {'\n'}Default URL: http://127.0.0.1:8000/api
        </pre>
      </div>

      {productos.length > 0 && (
        <div>
          <h2>Productos ({productos.length}):</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {productos.map(p => (
              <div key={p.id_producto} style={{ 
                background: '#e8f5e9', 
                padding: '10px', 
                borderRadius: '5px',
                border: '1px solid #4caf50'
              }}>
                <strong>ID:</strong> {p.id_producto} | <strong>Nombre:</strong> {p.nombre} | <strong>Precio:</strong> ${p.precio}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', background: '#fff3e0', borderRadius: '5px' }}>
        <h3>💡 Instrucciones:</h3>
        <ol>
          <li>Verifica que el backend esté corriendo en: <code>http://127.0.0.1:8000</code></li>
          <li>Abre la consola del navegador (F12) para ver los logs detallados</li>
          <li>Si ves productos arriba, la conexión funciona correctamente</li>
          <li>Si hay error, revisa el mensaje de error y la consola</li>
        </ol>
      </div>
    </div>
  );
};

export default Test;
