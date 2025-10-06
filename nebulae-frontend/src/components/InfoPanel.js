import React, { useState, useEffect } from 'react';
import './InfoPanel.css';

const InfoPanel = ({ selectedLocation }) => {
  const [locationDetails, setLocationDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar detalles adicionales cuando se selecciona una ubicación
  useEffect(() => {
    if (selectedLocation) {
      setLoading(true);
      // Simular carga de datos adicionales
      const timer = setTimeout(() => {
        setLocationDetails({
          ...selectedLocation,
          area: selectedLocation.area || 'No especificado',
          conservationStatus: selectedLocation.conservationStatus || 'Desconocido',
          floraCount: selectedLocation.floraCount || 0,
          faunaCount: selectedLocation.faunaCount || 0,
          discovered: selectedLocation.discovered || '2024',
          distance: selectedLocation.distance || '0 km'
        });
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setLocationDetails(null);
    }
  }, [selectedLocation]);

  if (!selectedLocation) {
    return (
      <div className="info-panel">
        <div className="welcome-message">
          <h2>🌿 Bienvenido a BLOSSOMCHAIN</h2>
          <p>Selecciona una ubicación en el mapa para explorar los ecosistemas y su biodiversidad</p>
          <div className="welcome-features">
            <div className="feature-item">
              <span className="feature-icon">📍</span>
              <span>Haz clic en cualquier punto del mapa</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌺</span>
              <span>Descubre especies únicas de plantas</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Consulta estadísticas en tiempo real</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <span>Explora datos de conservación</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="info-panel">
        <div className="info-panel-loading">
          <div className="loading-spinner"></div>
          <p>Loading information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="info-panel">
      <div className="location-header">
        <h2>{locationDetails.name}</h2>
        <span className="location-type">{locationDetails.type}</span>
      </div>
      
      <div className="location-image">
        <img 
          src={locationDetails.image} 
          alt={locationDetails.name}
          onError={(e) => {
            e.target.src = '/assets/images/default-location.jpg';
          }}
        />
        <div className="image-overlay">
          <span className="rarity-badge">{locationDetails.rarity}</span>
        </div>
      </div>
      
      <div className="location-description">
        <p>{locationDetails.description}</p>
      </div>
      
      <div className="location-stats">
        <div className="stat">
          <h4>🌱 Especies de Flora</h4>
          <p>{locationDetails.floraCount} registradas</p>
        </div>
        <div className="stat">
          <h4>🐝 Especies de Fauna</h4>
          <p>{locationDetails.faunaCount} registradas</p>
        </div>
        <div className="stat">
          <h4>📏 Área Total</h4>
          <p>{locationDetails.area}</p>
        </div>
        <div className="stat">
          <h4>🛡️ Estado</h4>
          <p>{locationDetails.conservationStatus}</p>
        </div>
      </div>

      <div className="pollinator-section">
        <h4>🐝 Actividad de Polinizadores</h4>
        <div className="pollinator-meter">
          <div 
            className="pollinator-fill"
            style={{ width: locationDetails.pollinatorActivity }}
          ></div>
          <span className="pollinator-text">{locationDetails.pollinatorActivity}</span>
        </div>
      </div>

      {locationDetails.price && (
        <div className="price-section">
          <h4>💰 Valor en Blockchain</h4>
          <div className="price-tag">
            {locationDetails.price}
          </div>
          <small>Token: $BLOOM</small>
        </div>
      )}

      <div className="location-actions">
        <button className="action-btn primary">
          📋 Ver Especies Detalladas
        </button>
        <button className="action-btn secondary">
          🗺️ Ver en Mapa Ampliado
        </button>
        <button className="action-btn tertiary">
          💾 Guardar Ubicación
        </button>
      </div>

      <div className="additional-info">
        <h4>📈 Datos Adicionales</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Coordenadas:</span>
            <span className="info-value">
              {locationDetails.lat?.toFixed(6)}, {locationDetails.lon?.toFixed(6)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Descubierta:</span>
            <span className="info-value">{locationDetails.discovered}</span>
          </div>
          <div className="info-item">
            <span className="info-label">NFT ID:</span>
            <span className="info-value">{locationDetails.nftId || 'No minteado'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Última Actualización:</span>
            <span className="info-value">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;