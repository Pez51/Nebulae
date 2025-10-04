import React from 'react';
import './InfoPanel.css';

const InfoPanel = ({ selectedLocation }) => {
  if (!selectedLocation) {
    return (
      <div className="info-panel">
        <div className="welcome-message">
          <h2>Bienvenido a NEBULAE</h2>
          <p>Selecciona una ubicación en el mapa para explorar las maravillas del cosmos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="info-panel">
      <div className="location-header">
        <h2>{selectedLocation.name}</h2>
        <span className="location-type">{selectedLocation.type}</span>
      </div>
      
      <div className="location-image">
        <img src={selectedLocation.image} alt={selectedLocation.name} />
      </div>
      
      <div className="location-description">
        <p>{selectedLocation.description}</p>
      </div>
      
      <div className="location-stats">
        <div className="stat">
          <h4>Distancia</h4>
          <p>{selectedLocation.distance}</p>
        </div>
        <div className="stat">
          <h4>Descubierta</h4>
          <p>{selectedLocation.discovered}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;