import React from 'react';
import './MapComponent.css';

const MapComponent = ({ hotspots, onHotspotClick, locations, selectedLocation, onLocationSelect }) => {
  // Esta función maneja el clic en los puntos del mapa
  const handleLocationClick = (location) => {
    onLocationSelect(location);
  };

  return (
    <div className="map-section">
      <div className="navigation-buttons">
        {locations.map(location => (
          <button
            key={location.id}
            className={`nav-button ${selectedLocation?.id === location.id ? 'active' : ''}`}
            onClick={() => handleLocationClick(location)}
          >
            {location.name}
          </button>
        ))}
      </div>
      
      <div className="map-container">
        <div className="static-map">
          {/* Reemplaza con tu imagen de mapa */}
          <div className="map-image">
            <img src="/assets/images/nebulae-map.jpg" alt="Mapa de Nebulae" />
            
            {/* Puntos interactivos en el mapa */}
            {locations.map(location => (
              <div
                key={location.id}
                className={`location-point ${selectedLocation?.id === location.id ? 'active' : ''}`}
                style={{
                  left: `${location.coordinates.x}%`,
                  top: `${location.coordinates.y}%`
                }}
                onClick={() => handleLocationClick(location)}
              >
                <div className="point"></div>
                <div className="point-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;