import React, { useState } from 'react';
import AboutModal from './AboutModal';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('blossomchain');
  const [showAbout, setShowAbout] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'about') {
      setShowAbout(true);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-menu">
          <ul>
            <li 
              className={activeTab === 'blossomchain' ? 'active' : ''}
              onClick={() => setActiveTab('blossomchain')}
            >
              <a href="#blossomchain">BLOSSOMCHAIN</a>
            </li>
            <li 
              className={activeTab === 'about' ? 'active' : ''}
              onClick={() => handleTabClick('about')}
            >
              <a href="#about">Quienes Somos</a>
            </li>
          </ul>
        </div>

        <div className="dashboard-info">
          {activeTab === 'blossomchain' && (
            <>
              <div className="info-card">
                <h4>🌿 BLOSSOMCHAIN</h4>
                <p>Plataforma innovadora que combina tecnología blockchain con conservación ambiental para monitorear y proteger la biodiversidad vegetal a nivel global.</p>
              </div>
              
              <div className="info-card">
                <h4>📊 Estadísticas en Tiempo Real</h4>
                <p>• 150+ especies de plantas monitoreadas<br/>
                   • 45 zonas de conservación activas<br/>
                   • 500+ usuarios registrados contribuyendo<br/>
                   • 1,200+ NFTs de plantas creados<br/>
                   • 98% de efectividad en seguimiento</p>
              </div>
              
              <div className="info-card">
                <h4>🎯 Objetivos 2024</h4>
                <p>• Preservar 50 especies endémicas en peligro<br/>
                   • Reforestar 100 hectáreas de bosque<br/>
                   • Educar a 10,000 personas sobre biodiversidad<br/>
                   • Expandir a 3 nuevos países<br/>
                   • Reducir huella de carbono en 25%</p>
              </div>

              <div className="info-card">
                <h4>🚀 Tecnología Utilizada</h4>
                <p>• Blockchain Polkadot para transparencia<br/>
                   • IoT sensors para monitoreo en tiempo real<br/>
                   • Machine Learning para predicción de crecimiento<br/>
                   • App móvil para participación ciudadana<br/>
                   • Dashboard analytics para toma de decisiones</p>
              </div>

              <div className="info-card">
                <h4>🤝 Cómo Participar</h4>
                <p>• Regístrate como voluntario<br/>
                   • Adopta una planta mediante NFTs<br/>
                   • Reporta avistamientos de especies<br/>
                   • Comparte en redes sociales<br/>
                   • Dona para proyectos de conservación</p>
              </div>
            </>
          )}

          {activeTab === 'about' && (
            <div className="info-card">
              <h4>ℹ️ Información Adicional</h4>
              <p>Haz clic en "Quienes Somos" para ver más detalles sobre nuestra misión, visión y equipo.</p>
            </div>
          )}
        </div>
      </div>

      <AboutModal show={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
};

export default Dashboard;