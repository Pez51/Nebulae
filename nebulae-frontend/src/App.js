import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

import Header from './components/Header';
import MapComponent from './components/MapComponent';
import InfoSection from './components/InfoSection';
import Dashboard from './components/Dashboard';
import NftModal from './components/NftModal';
import LoadingSpinner from './components/LoadingSpinner';
import { locationsData } from './data/locationsData';

import './App.css';

function App() {
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeButton, setActiveButton] = useState(1);
  const [backendError, setBackendError] = useState(false);

  const [isMinting, setIsMinting] = useState(false);
  const [mintingMessage, setMintingMessage] = useState('');

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        console.log('🔍 Intentando conectar al backend...');
        const response = await axios.get('http://localhost:3001/api/hotspots', {
          timeout: 5000 // 5 segundos de timeout
        });
        console.log('✅ Datos recibidos del backend:', response.data);
        setHotspots(response.data);
        setBackendError(false);
      } catch (error) {
        console.error('❌ Error al cargar datos del backend:', error);
        setBackendError(true);
        // Usar datos locales como fallback
        const fallbackData = [
          { 
            id: 1, 
            lat: -16.3989, 
            lon: -71.5375, 
            name: 'Zona Desértica (Modo Offline)', 
            rarity: 'Común', 
            pollinatorActivity: '45%', 
            price: '15 $BLOOM' 
          }
        ];
        setHotspots(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotspots();
    
    // Seleccionar primera ubicación por defecto
    if (locationsData && locationsData.length > 0) {
      setSelectedLocation(locationsData[0]);
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        setWalletAddress(await signer.getAddress());
      } catch (error) {
        console.error("Error conectando la billetera:", error);
      }
    } else {
      alert('Por favor instala MetaMask para usar esta función.');
    }
  };

  const handleCloseModal = () => {
    setSelectedHotspot(null);
    setIsMinting(false);
    setMintingMessage('');
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setActiveButton(1);
  };

  // Si hay error de backend, mostrar mensaje pero permitir usar la app
  if (isLoading) {
    return <LoadingSpinner message="Cargando datos de floración desde el servidor..." />;
  }

  return (
    <div className="App">
      <Header walletAddress={walletAddress} connectWallet={connectWallet} />
      
      {backendError && (
        <div className="backend-warning">
          ⚠️ Modo offline: Conectado con datos locales. El backend no está disponible.
        </div>
      )}
      
      <div className="container">
        <div className="main-content">
          <div className="map-section">
            <MapComponent 
              hotspots={hotspots} 
              onHotspotClick={setSelectedHotspot}
              locations={locationsData}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
            />
          </div>
          <div className="info-section">
            <InfoSection 
              selectedLocation={selectedLocation} 
              activeButton={activeButton}
              onButtonClick={setActiveButton}
            />
          </div>
        </div>
        <Dashboard />
      </div>
      <NftModal
        hotspot={selectedHotspot}
        onClose={handleCloseModal}
        walletAddress={walletAddress}
        isMinting={isMinting}
        setIsMinting={setIsMinting}
        mintingMessage={mintingMessage}
        setMintingMessage={setMintingMessage}
      />
    </div>
  );
}

export default App;