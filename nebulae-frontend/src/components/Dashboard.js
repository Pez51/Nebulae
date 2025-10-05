import React, { useState } from 'react';
import AboutModal from './AboutModal';
import LoginModal from './LoginModal';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('blossomchain');
  const [showAbout, setShowAbout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'about') {
      setShowAbout(true);
    } else if (tab === 'login') {
      setShowLogin(true);
    }
  };

  const carouselItems = [
    {
      image: "/assets/images/plant1.jpg",
      title: "Rosa",
      subtitle: "Rosaceae",
      description: "Planta ornamental con flores fragantes de múltiples colores"
    },
    {
      image: "/assets/images/plant2.jpg", 
      title: "Girasol",
      subtitle: "Helianthus annuus",
      description: "Planta anual con grandes flores amarillas que siguen al sol"
    },
    {
      image: "/assets/images/plant3.jpg",
      title: "Lavanda",
      subtitle: "Lavandula",
      description: "Planta aromática con flores violetas usada en perfumería"
    },
    {
      image: "/assets/images/plant4.jpg",
      title: "Orquídea",
      subtitle: "Orchidaceae",
      description: "Familia de plantas con flores exóticas y diversas formas"
    },
    {
      image: "/assets/images/plant5.jpg",
      title: "Cactus Saguaro",
      subtitle: "Carnegiea gigantea", 
      description: "Planta suculenta icónica del desierto de Sonora"
    },
    {
      image: "/assets/images/plant6.jpg",
      title: "Bambú de la Suerte",
      subtitle: "Dracaena sanderiana",
      description: "Planta de interior popular en la decoración y feng shui"
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-menu">
          <ul>
            <li 
              className={activeTab === 'blossomchain' ? 'active' : ''}
              onClick={() => handleTabClick('blossomchain')}
            >
              <a href="#blossomchain">BLOSSOMCHAIN</a>
            </li>
            <li 
              className={activeTab === 'about' ? 'active' : ''}
              onClick={() => handleTabClick('about')}
            >
              <a href="#about">Quienes Somos</a>
            </li>
            <li 
              className={activeTab === 'login' ? 'active' : ''}
              onClick={() => handleTabClick('login')}
            >
              <a href="#login">Iniciar Sesión</a>
            </li>
          </ul>
        </div>

        <div className="dashboard-info">
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
        </div>

        <div className="dashboard-carousel">
          <div id="plantCarousel" className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">
              {carouselItems.map((_, index) => (
                <li 
                  key={index}
                  data-target="#plantCarousel" 
                  data-slide-to={index}
                  className={index === 0 ? 'active' : ''}
                ></li>
              ))}
            </ol>
            
            <div className="carousel-inner">
              {carouselItems.map((item, index) => (
                <div key={index} className={`item ${index === 0 ? 'active' : ''}`}>
                  <img src={item.image} alt={item.title} />
                  <div className="carousel-caption">
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                    <small>{item.description}</small>
                  </div>
                </div>
              ))}
            </div>
            
            <a className="left carousel-control" href="#plantCarousel" role="button" data-slide="prev">
              <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
              <span className="sr-only">Anterior</span>
            </a>
            <a className="right carousel-control" href="#plantCarousel" role="button" data-slide="next">
              <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
              <span className="sr-only">Siguiente</span>
            </a>
          </div>
        </div>
      </div>

      <AboutModal show={showAbout} onClose={() => setShowAbout(false)} />
      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default Dashboard;