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
      subtitle: "Rosaceae"
    },
    {
      image: "/assets/images/plant2.jpg", 
      title: "Girasol",
      subtitle: "Helianthus"
    },
    {
      image: "/assets/images/plant3.jpg",
      title: "Lavanda",
      subtitle: "Lavandula"
    },
    {
      image: "/assets/images/plant4.jpg",
      title: "Orquídea",
      subtitle: "Orchidaceae"
    }
  ];

  return (
    <div className="dashboard">
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
      
      <div className="carousel-section">
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

      <AboutModal show={showAbout} onClose={() => setShowAbout(false)} />
      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default Dashboard;