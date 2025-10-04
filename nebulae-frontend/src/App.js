import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

import Header from './components/Header';
import MapComponent from './components/MapComponent';
import InfoPanel from './components/InfoPanel';
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

  const [isMinting, setIsMinting] = useState(false);
  const [mintingMessage, setMintingMessage] = useState('');

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/hotspots');
        setHotspots(response.data);
      } catch (error) {
        console.error("Error al cargar datos del backend:", error);
        setHotspots([
          { id: 0, lat: -16.3989, lon: -71.5375, name: 'Plaza de Armas (Datos de Respaldo)', rarity: 'Común', pollinatorActivity: '30%', price: '10 $BLOOM' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotspots();
    
    // Seleccionar primera ubicación por defecto
    setSelectedLocation(locationsData[0]);
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
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando datos de floración desde el servidor..." />;
  }

  return (
    <div className="App">
      <Header walletAddress={walletAddress} connectWallet={connectWallet} />
      <div className="main-content">
        <div className="left-section">
          <MapComponent 
            hotspots={hotspots} 
            onHotspotClick={setSelectedHotspot}
            locations={locationsData}
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
          />
        </div>
        <div className="right-section">
          <InfoPanel selectedLocation={selectedLocation} />
        </div>
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