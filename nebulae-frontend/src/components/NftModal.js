import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { ethers } from 'ethers';

// --- Configuración Blockchain (PARA PROGRAMADOR #3) ---
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE'; // TODO: Pega la dirección del contrato
const contractABI = [
  "function safeMint(address to, string memory uri) public",
  "function tokenURI(uint256 tokenId) public view returns (string memory)"
];

// --- Componente 3D para el NFT ---
// Modelo 3D simple. Podrías reemplazarlo por un modelo .gltf
// Por ejemplo, descarga un modelo low-poly de una flor o un árbol de Sketchfab
// function FlowerModel(props) {
//   const { scene } = useGLTF('/flower.gltf')
//   return <primitive object={scene} {...props} />
// }
function NftModel() {
    return (
      <mesh>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#e43f5a" wireframe />
      </mesh>
    );
}


const NftModal = ({ hotspot, onClose, walletAddress, isMinting, setIsMinting, mintingMessage, setMintingMessage }) => {
  
  const handleMint = async () => {
    if (!walletAddress || !hotspot) {
        alert("Por favor, conecta tu billetera y selecciona un hotspot primero.");
        return;
    }
    
    setIsMinting(true);
    setMintingMessage(`Minteando NFT para ${hotspot.name}...`);
    
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        const metadataUri = `data:application/json;base64,${btoa(JSON.stringify({
            name: hotspot.name,
            description: `Un NFT ecológico representando la floración en ${hotspot.name}.`,
            attributes: [
                { "trait_type": "Rarity", "value": hotspot.rarity },
                { "trait_type": "Pollinator Activity", "value": hotspot.pollinatorActivity }
            ]
        }))}`;
        
        const tx = await contract.safeMint(walletAddress, metadataUri);
        setMintingMessage('Esperando confirmación de la transacción...');
        await tx.wait();
        
        setMintingMessage(`¡Éxito! NFT para ${hotspot.name} minteado. Revisa tu wallet.`);
        setTimeout(() => {
            setMintingMessage('');
            onClose(); // Cierra el modal después del éxito
        }, 5000);

    } catch (error) {
        console.error("Error al mintear el NFT:", error);
        setMintingMessage('Error al mintear. Revisa la consola.');
    } finally {
        // No ponemos setIsMinting(false) aquí para que el estado de éxito se muestre
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
          <Canvas camera={{ fov: 45, position: [0, 2, 5] }}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6}>
                 <NftModel />
              </Stage>
              <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
            </Suspense>
          </Canvas>
        </div>

        <div className="nft-stats">
          <div className="stat-item">
            <h4>Actividad Polinizadora</h4>
            <p>{hotspot.pollinatorActivity}</p>
          </div>
          <div className="stat-item">
            <h4>Precio de Mint</h4>
            <p>{hotspot.price}</p>
          </div>
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