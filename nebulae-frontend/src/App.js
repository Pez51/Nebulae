import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

import Header from './components/Header';
import MapComponent from './components/MapComponent';
import NftModal from './components/NftModal';
import LoadingSpinner from './components/LoadingSpinner'; // Correcto: Lo importamos desde su archivo

import './App.css';

function App() {
  // ... (todo el código de estados y funciones se mantiene igual)
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
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
        console.error("Error fatal al cargar datos del backend:", error);
        alert("No se pudo conectar al backend. Asegúrate de que el servidor esté corriendo.");
        setHotspots([
            { id: 0, lat: -16.3989, lon: -71.5375, name: 'Plaza de Armas (Datos de Respaldo)', rarity: 'Común', pollinatorActivity: '30%', price: '10 $BLOOM' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotspots();
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

  if (isLoading) {
    return <LoadingSpinner message="Cargando datos de floración desde el servidor..." />;
  }

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

// LA SIGUIENTE SECCIÓN SE ELIMINÓ PORQUE YA EXISTE EN SU PROPIO ARCHIVO.
// const LoadingSpinner = ({ message }) => ( ... );

export default App;