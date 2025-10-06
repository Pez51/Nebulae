// frontend/src/components/NftModal.js
/* eslint-disable no-undef */
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Float } from '@react-three/drei';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';

// --- Componente 3D del NFT ---
function NftModel({ rarity }) {
  const colors = {
    Common: '#95a5a6',
    Rare: '#3498db',
    Epic: '#9b59b6',
    Legendary: '#f39c12'
  };
  
  const color = colors[rarity] || colors.Common;
  
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.1} 
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

const NftModal = ({ hotspot, onClose }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletName, setWalletName] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintingMessage, setMintingMessage] = useState('');
  const [api, setApi] = useState(null);
  const [balance, setBalance] = useState('0');

  // Conectar a Polkadot al montar el componente
  useEffect(() => {
    connectToChain();
  }, []);

  // Actualizar balance cuando cambia la wallet
  useEffect(() => {
    if (walletAddress && api) {
      fetchBalance();
    }
  }, [walletAddress, api]);

  /**
   * Conectar a la blockchain Polkadot
   */
  const connectToChain = async () => {
    try {
      const wsProvider = new WsProvider('wss://westend-rpc.polkadot.io');
      const apiInstance = await ApiPromise.create({ provider: wsProvider });
      setApi(apiInstance);
      console.log('✅ Conectado a Polkadot Westend');
    } catch (error) {
      console.error('Error conectando a blockchain:', error);
      setMintingMessage('Error de conexión con blockchain');
    }
  };

  /**
   * Conectar wallet Polkadot (Talisman, SubWallet, Polkadot.js)
   */
  const connectWallet = async () => {
    try {
      setMintingMessage('Conectando wallet...');
      
      // Habilitar extensiones Polkadot
      const extensions = await web3Enable('BloomWatch');
      
      if (extensions.length === 0) {
        setMintingMessage('❌ No se encontró wallet de Polkadot instalada');
        alert('Por favor instala Talisman, SubWallet o Polkadot.js Extension\n\nTalisman: https://www.talisman.xyz/\nSubWallet: https://subwallet.app/');
        window.open('https://www.talisman.xyz/', '_blank');
        return;
      }

      // Obtener cuentas
      const accounts = await web3Accounts();
      
      if (accounts.length === 0) {
        setMintingMessage('❌ No hay cuentas en tu wallet');
        return;
      }

      // Usar la primera cuenta
      const account = accounts[0];
      setWalletAddress(account.address);
      setWalletName(account.meta.name || 'Account');
      setMintingMessage(`✅ Wallet conectada: ${account.meta.name}`);
      
      console.log('Wallet conectada:', account.address);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMintingMessage(''), 3000);
      
    } catch (error) {
      console.error('Error conectando wallet:', error);
      setMintingMessage('❌ Error Connecting Wallet');
    }
  };

  /**
   * Obtener balance de la wallet
   */
  const fetchBalance = async () => {
    if (!api || !walletAddress) return;
    
    try {
      const { data: balanceData } = await api.query.system.account(walletAddress);
      const freeBalance = balanceData.free.toString();
      const formattedBalance = (BigInt(freeBalance) / BigInt(10**10)).toString();
      setBalance(formattedBalance);
    } catch (error) {
      console.error('Error obteniendo balance:', error);
    }
  };

  /**
   * Mintear NFT en Polkadot
   * NOTA: Esto es una simulación - necesitas un pallet personalizado
   * Por ahora simula el minting con una transferencia de 0 tokens
   */
  const handleMint = async () => {
    if (!walletAddress || !hotspot) {
      setMintingMessage('❌ Conecta tu wallet primero');
      return;
    }

    setIsMinting(true);
    setMintingMessage(`🔄 Preparando mint de ${hotspot.name}...`);

    try {
      // Obtener injector para firmar transacciones
      const accounts = await web3Accounts();
      const account = accounts.find(acc => acc.address === walletAddress);
      
      if (!account) {
        throw new Error('Cuenta no encontrada');
      }
      
      const injector = await web3FromSource(account.meta.source);

      setMintingMessage('📝 Preparando transacción...');

      // SIMULACIÓN: En producción aquí llamarías a tu pallet personalizado
      // const tx = api.tx.phenologyNft.mintBloomNft(...);
      
      // Por ahora: hacer una transferencia simbólica de 0.001 WND como demo
      const amount = 10000000; // 0.001 WND (10 decimales)
      const tx = api.tx.balances.transferKeepAlive(
        '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', // Alice address (treasury simulado)
        amount
      );

      setMintingMessage('✍️ Firma la transacción en tu wallet...');

      // Firmar y enviar
      const unsubscribe = await tx.signAndSend(
        walletAddress,
        { signer: injector.signer },
        ({ status, events, dispatchError }) => {
          // Manejar errores
          if (dispatchError) {
            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(dispatchError.asModule);
              const { docs, name, section } = decoded;
              setMintingMessage(`❌ Error: ${section}.${name}`);
              console.error(`Error: ${section}.${name}: ${docs.join(' ')}`);
            } else {
              setMintingMessage(`❌ Error: ${dispatchError.toString()}`);
            }
            setIsMinting(false);
            unsubscribe();
            return;
          }

          if (status.isInBlock) {
            const blockHash = status.asInBlock.toString();
            setMintingMessage(`⏳ Transacción en bloque: ${blockHash.slice(0, 10)}...`);
            console.log('Transacción en bloque:', blockHash);
          }
          
          if (status.isFinalized) {
            setMintingMessage(`🎉 ¡NFT Ecológico minteado exitosamente!`);
            console.log('Transacción finalizada:', status.asFinalized.toString());
            
            // Simular guardado en backend
            saveNFTToBackend(status.asFinalized.toString());
            
            // Actualizar balance
            fetchBalance();
            
            // Cerrar modal después de 5 segundos
            setTimeout(() => {
              setIsMinting(false);
              onClose();
            }, 5000);
            
            unsubscribe();
          }
        }
      );

    } catch (error) {
      console.error('Error al mintear NFT:', error);
      
      if (error.message.includes('Cancelled')) {
        setMintingMessage('❌ Transacción cancelada por el usuario');
      } else if (error.message.includes('balance')) {
        setMintingMessage('❌ Balance insuficiente para pagar fees');
      } else {
        setMintingMessage(`❌ Error: ${error.message}`);
      }
      
      setIsMinting(false);
    }
  };

  /**
   * Guardar NFT en backend (opcional)
   */
  const saveNFTToBackend = async (blockHash) => {
    try {
      const response = await fetch('http://localhost:3001/api/nfts/minted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          hotspotId: hotspot.id,
          hotspotName: hotspot.name,
          rarity: hotspot.rarity,
          coordinates: hotspot.coordinates,
          pollinatorActivity: hotspot.pollinatorActivity,
          blockHash,
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        console.log('✅ NFT guardado en backend');
      }
    } catch (error) {
      console.error('Error guardando en backend:', error);
      // No es crítico, continuar
    }
  };

  if (!hotspot) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        {/* Header */}
        <div className="modal-header">
          <h2>{hotspot.name}</h2>
          <span className={`rarity-badge rarity-${hotspot.rarity?.toLowerCase()}`}>
            {hotspot.rarity}
          </span>
        </div>

        {/* Visor 3D del NFT */}
        <div className="nft-viewer">
          <Canvas camera={{ fov: 45, position: [0, 0, 8] }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
              <Stage environment="city" intensity={0.5}>
                <NftModel rarity={hotspot.rarity} />
              </Stage>
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            </Suspense>
          </Canvas>
        </div>

        {/* Stats del NFT */}
        <div className="nft-stats">
          <div className="stat-item">
            <h4>🐝 Actividad Polinizadora</h4>
            <p>{hotspot.pollinatorActivity}%</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${hotspot.pollinatorActivity}%` }}
              ></div>
            </div>
          </div>
          <div className="stat-item">
            <h4>💰 Precio de Mint</h4>
            <p className="price">{hotspot.price}</p>
          </div>
          <div className="stat-item">
            <h4>🌍 Coordenadas</h4>
            <p className="coordinates">
              {hotspot.coordinates.lat.toFixed(4)}°N<br/>
              {hotspot.coordinates.lon.toFixed(4)}°E
            </p>
          </div>
        </div>

        {/* Wallet Info */}
        {walletAddress && (
          <div className="wallet-info">
            <div className="wallet-header">
              <span className="wallet-icon">👛</span>
              <div className="wallet-details">
                <p className="wallet-name">{walletName}</p>
                <p className="wallet-address">
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                </p>
              </div>
            </div>
            <div className="wallet-balance">
              <span className="balance-label">Balance:</span>
              <span className="balance-amount">{balance} WND</span>
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="action-buttons">
          {!walletAddress ? (
            <button className="connect-btn" onClick={connectWallet}>
              <span className="btn-icon">🔗</span>
              Connect Wallet Polkadot
            </button>
          ) : (
            <button 
              className="mint-btn" 
              onClick={handleMint} 
              disabled={isMinting}
            >
              <span className="btn-icon">{isMinting ? '⏳' : '✨'}</span>
              {isMinting ? 'Procesando...' : 'Mintear NFT Ecológico'}
            </button>
          )}
        </div>

        {/* Mensajes de Estado */}
        {mintingMessage && (
          <div className={`minting-status ${
            mintingMessage.includes('❌') ? 'error' : 
            mintingMessage.includes('🎉') ? 'success' : 
            'info'
          }`}>
            {mintingMessage}
          </div>
        )}

        {/* Descripción */}
        {hotspot.description && (
          <div className="nft-description">
            <h3>📝 Descripción</h3>
            <p>{hotspot.description}</p>
          </div>
        )}

        {/* Info adicional */}
        <div className="nft-info">
          <div className="info-item">
            <span className="info-label">Red:</span>
            <span className="info-value">Polkadot Westend</span>
          </div>
          <div className="info-item">
            <span className="info-label">NFT ID:</span>
            <span className="info-value">{hotspot.nftId || 'Pendiente'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Estado:</span>
            <span className="info-value status-active">🟢 Activo</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 20px;
          padding: 30px;
          max-width: 650px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.1);
          position: relative;
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }

        .close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          font-size: 28px;
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .close-btn:hover {
          background: rgba(255, 59, 48, 0.8);
          transform: rotate(90deg) scale(1.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-right: 50px;
        }

        .modal-header h2 {
          color: white;
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }

        .rarity-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .rarity-common { 
          background: linear-gradient(135deg, #95a5a6, #7f8c8d);
          color: white;
        }
        .rarity-rare { 
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
        }
        .rarity-epic { 
          background: linear-gradient(135deg, #9b59b6, #8e44ad);
          color: white;
        }
        .rarity-legendary { 
          background: linear-gradient(135deg, #f39c12, #e74c3c);
          color: white;
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        .nft-viewer {
          width: 100%;
          height: 320px;
          margin-bottom: 25px;
          border-radius: 15px;
          overflow: hidden;
          background: radial-gradient(circle at center, #2c3e50 0%, #1a1a2e 100%);
          box-shadow: inset 0 4px 20px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .nft-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 15px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s;
        }

        .stat-item:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .stat-item h4 {
          color: #bbb;
          font-size: 12px;
          margin: 0 0 8px 0;
          font-weight: 600;
          text-transform: uppercase;
        }

        .stat-item p {
          color: white;
          font-size: 18px;
          margin: 0;
          font-weight: 700;
        }

        .stat-item .price {
          color: #f39c12;
          font-size: 20px;
        }

        .stat-item .coordinates {
          font-size: 13px;
          line-height: 1.4;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
          margin-top: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #27ae60, #2ecc71);
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .wallet-info {
          background: rgba(52, 152, 219, 0.1);
          border: 1px solid rgba(52, 152, 219, 0.3);
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .wallet-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .wallet-icon {
          font-size: 24px;
        }

        .wallet-details {
          flex: 1;
        }

        .wallet-name {
          color: white;
          font-weight: 600;
          margin: 0 0 4px 0;
          font-size: 14px;
        }

        .wallet-address {
          color: #3498db;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          margin: 0;
        }

        .wallet-balance {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .balance-label {
          color: #bbb;
          font-size: 13px;
        }

        .balance-amount {
          color: #2ecc71;
          font-weight: 700;
          font-size: 16px;
        }

        .action-buttons {
          margin-bottom: 20px;
        }

        .connect-btn,
        .mint-btn {
          width: 100%;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .connect-btn {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
        }

        .connect-btn:hover {
          background: linear-gradient(135deg, #2980b9, #21618c);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
        }

        .mint-btn {
          background: linear-gradient(135deg, #27ae60, #229954);
          color: white;
        }

        .mint-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #229954, #1e8449);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(39, 174, 96, 0.4);
        }

        .mint-btn:disabled {
          background: #7f8c8d;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .btn-icon {
          font-size: 20px;
        }

        .minting-status {
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 15px;
          text-align: center;
          font-weight: 600;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .minting-status.info {
          background: rgba(52, 152, 219, 0.2);
          border: 1px solid rgba(52, 152, 219, 0.4);
          color: #3498db;
        }

        .minting-status.success {
          background: rgba(39, 174, 96, 0.2);
          border: 1px solid rgba(39, 174, 96, 0.4);
          color: #27ae60;
        }

        .minting-status.error {
          background: rgba(231, 76, 60, 0.2);
          border: 1px solid rgba(231, 76, 60, 0.4);
          color: #e74c3c;
        }

        .nft-description {
          background: rgba(255, 255, 255, 0.05);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .nft-description h3 {
          color: white;
          font-size: 14px;
          margin: 0 0 10px 0;
          font-weight: 600;
        }

        .nft-description p {
          color: #bbb;
          font-size: 13px;
          line-height: 1.6;
          margin: 0;
        }

        .nft-info {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .info-label {
          color: #999;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .info-value {
          color: white;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Courier New', monospace;
        }

        .status-active {
          color: #27ae60;
        }

        @media (max-width: 600px) {
          .modal-content {
            width: 95%;
            padding: 20px;
          }

          .nft-stats {
            grid-template-columns: 1fr;
          }

          .modal-header h2 {
            font-size: 20px;
          }

          .nft-viewer {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default NftModal;