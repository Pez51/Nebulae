import React from 'react';
import './Modal.css';

const AboutModal = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content about-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Quienes Somos</h2>
        <div className="about-sections">
          <div className="about-section">
            <h3>Misión</h3>
            <p>Promover la conservación de la biodiversidad vegetal mediante tecnología blockchain y participación comunitaria.</p>
          </div>
          <div className="about-section">
            <h3>Visión</h3>
            <p>Ser la plataforma líder en monitoreo y preservación de ecosistemas vegetales a nivel global.</p>
          </div>
          <div className="about-section">
            <h3>Tecnología</h3>
            <p>Utilizamos Polkadot para crear NFTs que representan especies vegetales y su estado de conservación.</p>
          </div>
          <div className="about-section">
            <h3>Comunidad</h3>
            <p>Una red global de botánicos, conservacionistas y entusiastas trabajando juntos por la flora mundial.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;