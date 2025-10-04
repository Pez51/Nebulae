// src/components/NavigationButtons.js
import React from 'react';

const NavigationButtons = ({ hotspots, onHotspotClick }) => {
  return (
    <div className="navigation-buttons">
      {hotspots.map(hotspot => (
        <button
          key={hotspot.id}
          className="nav-btn"
          onClick={() => onHotspotClick(hotspot)}
        >
          {hotspot.name}
        </button>
      ))}
    </div>
  );
};

export default NavigationButtons;