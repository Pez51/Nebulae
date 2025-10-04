import React from 'react';

// Este es el componente de la pantalla de carga, ahora en su propio archivo.
const LoadingSpinner = ({ message }) => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);

export default LoadingSpinner;