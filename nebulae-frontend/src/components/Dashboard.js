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
              <a href="#about">About us</a>
            </li>
          </ul>
        </div>

        <div className="dashboard-info">
          {activeTab === 'blossomchain' && (
            <>
              <div className="info-card">
                <h4>🌿 BLOSSOMCHAIN</h4>
                <p>Innovative platform that combines blockchain technology with environmental conservation to monitor and protect plant biodiversity globally.</p>
              </div>
              
              <div className="info-card">
                <h4>📊 Real-Time Statistics</h4>
                <p>• 150+ monitored plant species<br/>
                  • 45 active conservation zones<br/>
                  • 500+ registered users contributing<br/>
                  • 1,200+ plant NFTs created<br/>
                  • 98% tracking effectiveness</p>
              </div>
              
              <div className="info-card">
                <h4>🎯 2024 Goals</h4>
                <p>• Preserve 50 endangered endemic species<br/>
                  • Reforest 100 hectares of forest<br/>
                  • Educate 10,000 people about biodiversity<br/>
                  • Expand to 3 new countries<br/>
                  • Reduce carbon footprint by 25%</p>
              </div>

              <div className="info-card">
                <h4>🚀 Technology Used</h4>
                <p>• Polkadot Blockchain for transparency<br/>
                  • IoT sensors (NASA) for real-time monitoring<br/>
                  • Analytics dashboard for decision making</p>
              </div>

              <div className="info-card">
                <h4>🤝 How to Participate</h4>
                <p>• Register as a volunteer<br/>
                  • Adopt a plant through NFTs<br/>
                 </p>
              </div>
            </>
          )}

          {activeTab === 'about' && (
            <div className="info-card">
               <h4>ℹ️ Additional information</h4>
              <p>Click on "Who We Are" to learn more about our mission, vision, and team.</p>
            </div>
          )}
        </div>
      </div>

      <AboutModal show={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
};

export default Dashboard;