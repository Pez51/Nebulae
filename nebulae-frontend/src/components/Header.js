import React from 'react';

// Componente para la cabecera y el botón de conexión de la billetera.
const Header = ({ walletAddress, connectWallet }) => {
  return (
    <header className="App-header">
      <div className="logo-container">
        {/* Puedes poner un SVG o una imagen del logo aquí */}
        <h1>BLOSSOMCHAIN</h1>
      </div>
      <div className="header-controls">
        {walletAddress ? (
          <div className="wallet-connected">
            <span className="wallet-icon">🔗</span>
            Conectado: {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
          </div>
        ) : (
          <button onClick={connectWallet} className="connect-wallet-btn">
            Conectar Wallet
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;