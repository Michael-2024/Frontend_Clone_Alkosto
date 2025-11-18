import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Ensures all route changes start at the top of the page.
 * Place this component inside Router but outside Routes in App.js.
 * 
 * @component
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Use 'auto' for instant scroll, 'smooth' for animated
    });
  }, [pathname]);

  return null; // This component doesn't render anything
}

export default ScrollToTop;
