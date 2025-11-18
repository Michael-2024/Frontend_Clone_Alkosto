import React, { useState, useEffect } from 'react';
import { ChatUtils } from '../LiveChat/LiveChat';
import './ChatButton.css';

/**
 * ChatButton Component - Botón para abrir el chat en vivo
 * 
 * Puede usarse en Footer, menú de ayuda, o cualquier otra ubicación.
 * Abre el widget de Tawk.to cuando se hace clic.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.variant - Estilo del botón: 'link', 'button', 'floating'
 * @param {string} props.text - Texto del botón (default: "Chat en Línea")
 * @param {string} props.className - Clases CSS adicionales
 */
const ChatButton = ({ 
  variant = 'link', 
  text = 'Chat en Línea',
  className = '',
  showStatus = false 
}) => {
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar estado de agentes cada 30 segundos
    const checkStatus = async () => {
      try {
        const online = await ChatUtils.isAgentAvailable();
        setIsOnline(online);
      } catch (error) {
        console.error('Error checking chat status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    ChatUtils.openChat();
    
    // Enviar evento de analytics (opcional)
    if (window.gtag) {
      window.gtag('event', 'chat_opened', {
        event_category: 'engagement',
        event_label: 'Live Chat'
      });
    }
  };

  const renderButton = () => {
    switch (variant) {
      case 'button':
        return (
          <button 
            className={`chat-button-primary ${className}`}
            onClick={handleClick}
            aria-label="Abrir chat en vivo"
          >
            <span className="chat-icon">💬</span>
            <span className="chat-text">{text}</span>
            {showStatus && !isLoading && (
              <span className={`chat-status-dot ${isOnline ? 'online' : 'offline'}`} 
                    title={isOnline ? 'En línea' : 'Fuera de línea'} />
            )}
          </button>
        );

      case 'floating':
        return (
          <button 
            className={`chat-button-floating ${className}`}
            onClick={handleClick}
            aria-label="Abrir chat en vivo"
            title={text}
          >
            <span className="chat-icon-large">💬</span>
            {showStatus && !isLoading && isOnline && (
              <span className="chat-badge-online">●</span>
            )}
          </button>
        );

      case 'link':
      default:
        return (
          <a 
            href="#chat" 
            className={`chat-button-link ${className}`}
            onClick={handleClick}
          >
            <span className="chat-icon-small">💬</span>
            {text}
            {showStatus && !isLoading && (
              <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
                {isOnline ? '● En línea' : '○ Offline'}
              </span>
            )}
          </a>
        );
    }
  };

  return renderButton();
};

export default ChatButton;
