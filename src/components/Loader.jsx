// Loader component to display a loading animation
import { useState, useEffect } from 'react';

const Loader = ({ text = 'Redirigiendo' }) => {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev < 3 ? prev + 1 : 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-container">
      <span>{text}{'.'.repeat(dots)}</span>
    </div>
  );
};

export default Loader;