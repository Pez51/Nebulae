import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Float } from '@react-three/drei';
import { ethers } from 'ethers';

// --- Configuración Blockchain (PARA PROGRAMADOR #3) ---
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE'; // <-- Pega aquí la dirección del contrato de Sepolia
const contractABI = ["function safeMint(address to, string memory uri) public"];

// --- Componente 3D Mejorado para el NFT (PARA PROGRAMADOR #1) ---
function NftModel() {
    return (
      // Float hace que el objeto flote suavemente
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh>
          {/* Una forma más interesante que un cubo */}
          <torusKnotGeometry args={[1, 0.3, 128, 16]} />
          {/* Un material que reacciona a la luz */}
          <meshStandardMaterial color="#e43f5a" roughness={0.1} metalness={0.5} />
        </mesh>
      </Float>
    );
}

const NftModal = ({ hotspot, onClose, walletAddress, isMinting, setIsMinting, mintingMessage, setMintingMessage }) => {
  const handleMint = async () => {
    // Código de minting sin cambios...
    if (!walletAddress || !hotspot) return;
    setIsMinting(true);
    setMintingMessage(`Minteando NFT para ${hotspot.name}...`);
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        const metadataUri = `data:application/json;base64,${btoa(JSON.stringify({ name: hotspot.name, description: `NFT ecológico de la floración en ${hotspot.name}.`, attributes: [{ "trait_type": "Rarity", "value": hotspot.rarity }] }))}`;
        const tx = await contract.safeMint(walletAddress, metadataUri);
        setMintingMessage('Esperando confirmación de la transacción...');
        await tx.wait();
        setMintingMessage(`¡Éxito! NFT minteado. Revisa tu wallet en Sepolia.`);
        setTimeout(() => onClose(), 5000);
    } catch (error) {
        console.error("Error al mintear el NFT:", error);
        setMintingMessage('Error al mintear. Revisa la consola.');
        setIsMinting(false);
    }
  };

  if (!hotspot) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <h2>{hotspot.name}</h2>
          <span className={`rarity-badge rarity-${hotspot.rarity?.toLowerCase()}`}>{hotspot.rarity}</span>
        </div>
        <div className="nft-viewer">
          <Canvas camera={{ fov: 45, position: [0, 0, 8] }}>
            <Suspense fallback={null}>
              {/* Añadimos luces para que el modelo 3D se vea bien */}
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <Stage environment="city" intensity={0.5}>
                 <NftModel />
              </Stage>
              <OrbitControls enableZoom={false} autoRotate />
            </Suspense>
          </Canvas>
        </div>
        <div className="nft-stats">
          <div className="stat-item"><h4>Actividad Polinizadora</h4><p>{hotspot.pollinatorActivity}</p></div>
          <div className="stat-item"><h4>Precio de Mint</h4><p>{hotspot.price}</p></div>
        </div>
        <button className="mint-btn" onClick={handleMint} disabled={isMinting || !walletAddress}>
          {isMinting ? 'Procesando...' : (walletAddress ? 'Mintear NFT' : 'Conecta tu Wallet')}
        </button>
        {mintingMessage && <p className="minting-status">{mintingMessage}</p>}
      </div>
    </div>
  );
};

export default NftModal;