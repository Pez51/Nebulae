import React from 'react';
import './MapComponent.css';

const MapComponent = ({ hotspots, onHotspotClick, locations, selectedLocation, onLocationSelect }) => {
  return (
    <div className="map-container">
      <div className="static-map">
        <img src="/assets/imagenes/phoenix-map.jpg" alt="Mapa de Phoenix, Arizona" />
        
        {/* Puntos interactivos en el mapa */}
        {locations.map(location => (
          <div
            key={location.id}
            className={`location-point ${selectedLocation?.id === location.id ? 'active' : ''}`}
            style={{
              left: `${location.coordinates.x}%`,
              top: `${location.coordinates.y}%`
            }}
            onClick={() => onLocationSelect(location)}
          >
            <div className="point"></div>
            <div className="point-glow"></div>
            <div className="location-tooltip">{location.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapComponent;