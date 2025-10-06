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
        <h2>About Us</h2>
          <div className="about-sections">
            <div className="about-section">
              <h3>Mission</h3>
              <p>Promote the conservation of plant biodiversity through blockchain technology and community participation.</p>
            </div>
            <div className="about-section">
              <h3>Vision</h3>
              <p>To be the leading platform in monitoring and preserving plant ecosystems globally.</p>
            </div>
            <div className="about-section">
              <h3>Technology</h3>
              <p>We use Polkadot to create NFTs that represent plant species and their conservation status.</p>
            </div>
            <div className="about-section">
              <h3>Community</h3>
              <p>A global network of botanists, conservationists, and enthusiasts working together for world flora.</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default AboutModal;