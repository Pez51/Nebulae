import React from 'react';
import './InfoSection.css';

const InfoSection = ({ selectedLocation, activeButton, onButtonClick }) => {
  if (!selectedLocation) {
    return (
      <div className="info-section">
        <div className="text-area">
          <p>Selecciona una ubicación en el mapa para ver la información de las plantas.</p>
        </div>
        <div className="button-area">
          <button>Botón 1</button>
          <button>Botón 2</button>
          <button>Botón 3</button>
        </div>
      </div>
    );
  }

  // Obtener el contenido específico para el botón activo de esta ubicación
  const buttonContent = selectedLocation.buttonContents?.[activeButton] || 
    "Información no disponible para esta sección.";

  return (
    <div className="info-section">
      <div className="text-area">
        <div className="location-header">
          <h3>{selectedLocation.name}</h3>
        </div>
        <div className="content-area">
          <p>{buttonContent}</p>
        </div>
      </div>
      <div className="button-area">
        <button 
          className={activeButton === 1 ? 'active' : ''}
          onClick={() => onButtonClick(1)}
        >
          Especies
        </button>
        <button 
          className={activeButton === 2 ? 'active' : ''}
          onClick={() => onButtonClick(2)}
        >
          Cuidados
        </button>
        <button 
          className={activeButton === 3 ? 'active' : ''}
          onClick={() => onButtonClick(3)}
        >
          Datos
        </button>
      </div>
    </div>
  );
};

export default InfoSection;