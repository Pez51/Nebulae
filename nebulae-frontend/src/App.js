import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

import Header from './components/Header';
import MapComponent from './components/MapComponent';
import NftModal from './components/NftModal';

import './App.css';

function App() {
  // --- Estados Globales de la Aplicación ---
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  
  // Estados para el proceso de minting (manejados aquí para pasarlos al modal)
  const [isMinting, setIsMinting] = useState(false);
  const [mintingMessage, setMintingMessage] = useState('');

  // Cargar datos de los hotspots del backend
  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/hotspots');
        setHotspots(response.data);
      } catch (error) {
        console.error("Error al cargar los hotspots. ¿El servidor backend está encendido?", error);
        setHotspots([ // Datos de respaldo por si el backend falla
            { id: 0, lat: -16.3989, lon: -71.5375, name: 'Plaza de Armas (Ejemplo)', rarity: 'Común', pollinatorActivity: '30%', price: '10 $BLOOM' }
        ]);
      }
    };
    fetchHotspots();
  }, []);

  // Función para conectar la billetera MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (error) {
        console.error("Error conectando la billetera:", error);
      }
    } else {
      alert('Por favor instala MetaMask para usar esta función.');
    }
  };

  const handleCloseModal = () => {
    setSelectedHotspot(null);
    setIsMinting(false); // Resetea el estado de minting al cerrar
    setMintingMessage('');
  };

  return (
    <div className="App">
      <Header walletAddress={walletAddress} connectWallet={connectWallet} />
      
      <main>
        <MapComponent hotspots={hotspots} onHotspotClick={setSelectedHotspot} />
      </main>
      
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