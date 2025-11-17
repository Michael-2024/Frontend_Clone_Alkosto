import { useEffect } from 'react';
import UserController from '../../controllers/UserController';

/**
 * LiveChat Component - RF23: Chat en vivo
 * 
 * Integración con Tawk.to para chat en tiempo real con soporte al cliente.
 * 
 * Características:
 * - Widget de chat flotante en todas las páginas
 * - Identificación automática de usuarios logueados
 * - Historial de conversaciones
 * - Notificaciones de mensajes
 * - Compatible con móviles
 * 
 * @component
 */
const LiveChat = () => {
  useEffect(() => {
    // Configuración de Tawk.to
    // Reemplazar con tu Property ID real de Tawk.to
    // Obtener en: https://dashboard.tawk.to/#/admin
    const TAWK_PROPERTY_ID = process.env.REACT_APP_TAWK_PROPERTY_ID || 'YOUR_PROPERTY_ID_HERE';
    const TAWK_WIDGET_ID = process.env.REACT_APP_TAWK_WIDGET_ID || 'default';

    // Solo cargar si hay IDs configurados
    if (TAWK_PROPERTY_ID === 'YOUR_PROPERTY_ID_HERE') {
      console.warn('⚠️ LiveChat: Configura REACT_APP_TAWK_PROPERTY_ID en .env para activar el chat');
      return;
    }

    // Script de Tawk.to
    const loadTawkTo = () => {
      // Evitar cargar múltiples veces
      if (window.Tawk_API) {
        console.log('LiveChat: Tawk.to ya está cargado');
        return;
      }

      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');

      // Configurar callbacks
      script.onload = () => {
        console.log('✅ LiveChat: Tawk.to cargado exitosamente');
        
        // Configurar información del usuario si está logueado
        const user = UserController.getCurrentUser();
        if (user && window.Tawk_API && window.Tawk_API.setAttributes) {
          window.Tawk_API.setAttributes({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            hash: user.id, // ID único del usuario
          }, (error) => {
            if (error) {
              console.error('Error configurando usuario en chat:', error);
            } else {
              console.log('Usuario configurado en chat:', user.email);
            }
          });
        }

        // Personalizar mensajes
        if (window.Tawk_API) {
          window.Tawk_API.customStyle = {
            visibility: {
              desktop: {
                position: 'br', // bottom-right
                xOffset: 20,
                yOffset: 20
              },
              mobile: {
                position: 'br',
                xOffset: 10,
                yOffset: 10
              }
            }
          };
        }
      };

      script.onerror = () => {
        console.error('❌ LiveChat: Error cargando Tawk.to');
      };

      // Agregar script al documento
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    };

    loadTawkTo();

    // Cleanup: no remover el script porque Tawk.to gestiona su propio ciclo de vida
    // y puede causar problemas al navegar entre rutas
    return () => {
      // Opcional: ocultar el widget si se desmonta el componente
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        // window.Tawk_API.hideWidget();
      }
    };
  }, []);

  // Este componente no renderiza nada visible (el widget es inyectado por Tawk.to)
  return null;
};

/**
 * Utilidades para controlar el widget desde otros componentes
 */
export const ChatUtils = {
  /**
   * Abrir ventana de chat programáticamente
   */
  openChat: () => {
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    }
  },

  /**
   * Minimizar ventana de chat
   */
  minimizeChat: () => {
    if (window.Tawk_API && window.Tawk_API.minimize) {
      window.Tawk_API.minimize();
    }
  },

  /**
   * Mostrar widget de chat
   */
  showWidget: () => {
    if (window.Tawk_API && window.Tawk_API.showWidget) {
      window.Tawk_API.showWidget();
    }
  },

  /**
   * Ocultar widget de chat
   */
  hideWidget: () => {
    if (window.Tawk_API && window.Tawk_API.hideWidget) {
      window.Tawk_API.hideWidget();
    }
  },

  /**
   * Verificar si hay agentes disponibles
   * @returns {Promise<boolean>}
   */
  isAgentAvailable: () => {
    return new Promise((resolve) => {
      if (window.Tawk_API && window.Tawk_API.getStatus) {
        const status = window.Tawk_API.getStatus();
        resolve(status === 'online');
      } else {
        resolve(false);
      }
    });
  },

  /**
   * Enviar evento personalizado
   * @param {string} eventName 
   * @param {object} metadata 
   */
  sendEvent: (eventName, metadata = {}) => {
    if (window.Tawk_API && window.Tawk_API.addEvent) {
      window.Tawk_API.addEvent(eventName, metadata);
    }
  },

  /**
   * Agregar tags al chat (útil para categorizar conversaciones)
   * @param {string[]} tags 
   */
  addTags: (tags) => {
    if (window.Tawk_API && window.Tawk_API.addTags) {
      window.Tawk_API.addTags(tags);
    }
  }
};

export default LiveChat;
