import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';

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
  const [walletName, setWalletName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeButton, setActiveButton] = useState(1);
  const [blockchainApi, setBlockchainApi] = useState(null);
  const [blockchainStatus, setBlockchainStatus] = useState({ connected: false });

  const [isMinting, setIsMinting] = useState(false);
  const [mintingMessage, setMintingMessage] = useState('');

  // Conectar a blockchain Polkadot al iniciar
  useEffect(() => {
    connectToPolkadot();
  }, []);

  // Cargar hotspots y ubicación inicial
  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/hotspots');
        
        // El backend puede devolver { hotspots: [...], blockchain: {...} }
        if (response.data.hotspots) {
          setHotspots(response.data.hotspots);
          if (response.data.blockchain) {
            setBlockchainStatus(response.data.blockchain);
          }
        } else {
          // Compatibilidad con respuesta antigua (array directo)
          setHotspots(response.data);
        }
      } catch (error) {
        console.error("Error al cargar datos del backend:", error);
        // Datos de respaldo
        setHotspots([
          { 
            id: 1, 
            lat: -16.3989, 
            lon: -71.5375, 
            name: 'Plaza de Armas - Arequipa', 
            rarity: 'Common', 
            pollinatorActivity: 30, 
            price: '10 WND',
            description: 'Zona urbana con jardines florales'
          },
          {
            id: 2,
            lat: -13.0569,
            lon: -74.2244,
            name: 'Valle de Quinua - Perú',
            rarity: 'Epic',
            pollinatorActivity: 92,
            price: '150 WND',
            description: 'Ecosistema andino con alta biodiversidad'
          }
        ]);
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

  /**
   * Conectar a la blockchain Polkadot
   */
  const connectToPolkadot = async () => {
    try {
      const wsProvider = new WsProvider('wss://westend-rpc.polkadot.io');
      const api = await ApiPromise.create({ provider: wsProvider });
      await api.isReady;
      
      setBlockchainApi(api);
      
      const chain = await api.rpc.system.chain();
      const lastHeader = await api.rpc.chain.getHeader();
      
      setBlockchainStatus({
        connected: true,
        chain: chain.toString(),
        blockNumber: lastHeader.number.toNumber()
      });
      
      console.log(`✅ Conectado a Polkadot: ${chain}`);
    } catch (error) {
      console.error('Error conectando a Polkadot:', error);
      setBlockchainStatus({
        connected: false,
        error: error.message
      });
    }
  };

  /**
   * Conectar wallet Polkadot (SubWallet, Talisman, etc.)
   */
  const connectWallet = async () => {
    try {
      // Habilitar extensión de Polkadot
      const extensions = await web3Enable('BloomWatch');
      
      if (extensions.length === 0) {
        alert(
          '⚠️ No se detectó wallet de Polkadot.\n\n' +
          'Por favor instala una de estas extensiones:\n' +
          '• SubWallet: https://subwallet.app/\n' +
          '• Talisman: https://www.talisman.xyz/\n' +
          '• Polkadot.js: https://polkadot.js.org/extension/'
        );
        
        // Abrir página de SubWallet
        window.open('https://subwallet.app/', '_blank');
        return;
      }

      // Obtener cuentas disponibles
      const accounts = await web3Accounts();
      
      if (accounts.length === 0) {
        alert('No hay cuentas en tu wallet. Por favor crea una cuenta primero.');
        return;
      }

      // Usar la primera cuenta disponible
      const account = accounts[0];
      setWalletAddress(account.address);
      setWalletName(account.meta.name || 'Mi Cuenta');
      
      console.log('✅ Wallet conectada:', account.address);
      
      // Mostrar notificación de éxito
      setMintingMessage(`✅ Wallet conectada: ${account.meta.name || 'Account'}`);
      setTimeout(() => setMintingMessage(''), 3000);
      
    } catch (error) {
      console.error("Error conectando la wallet:", error);
      alert('Error al conectar wallet. Revisa la consola para más detalles.');
    }
  };

  /**
   * Desconectar wallet
   */
  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletName(null);
    console.log('Wallet desconectada');
  };

  /**
   * Cerrar modal de NFT
   */
  const handleCloseModal = () => {
    setSelectedHotspot(null);
    setIsMinting(false);
    setMintingMessage('');
  };

  /**
   * Seleccionar ubicación en el mapa
   */
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setActiveButton(1); // Reset al primer botón cuando cambia ubicación
  };

  /**
   * Click en hotspot del mapa
   */
  const handleHotspotClick = (hotspot) => {
    setSelectedHotspot(hotspot);
    console.log('Hotspot seleccionado:', hotspot);
  };

  // Mostrar spinner mientras carga
  if (isLoading) {
    return (
      <LoadingSpinner 
        message="Cargando datos de floración desde el servidor..." 
      />
    );
  }

  return (
    <div className="App">
      {/* Header con conexión de wallet */}
      <Header 
        walletAddress={walletAddress}
        walletName={walletName}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        blockchainStatus={blockchainStatus}
      />
      
      <div className="container">
        <div className="main-content">
          {/* Sección del Mapa */}
          <div className="map-section">
            <MapComponent 
              hotspots={hotspots} 
              onHotspotClick={handleHotspotClick}
              locations={locationsData}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
            />
          </div>
          
          {/* Sección de Información */}
          <div className="info-section">
            <InfoSection 
              selectedLocation={selectedLocation} 
              activeButton={activeButton}
              onButtonClick={setActiveButton}
            />
          </div>
        </div>
        
        {/* Dashboard de estadísticas */}
        <Dashboard blockchainStatus={blockchainStatus} />
      </div>
      
      {/* Modal de NFT */}
      {selectedHotspot && (
        <NftModal
          hotspot={selectedHotspot}
          onClose={handleCloseModal}
          walletAddress={walletAddress}
          walletName={walletName}
          blockchainApi={blockchainApi}
          isMinting={isMinting}
          setIsMinting={setIsMinting}
          mintingMessage={mintingMessage}
          setMintingMessage={setMintingMessage}
        />
      )}
    </div>
  );
}

export default App;