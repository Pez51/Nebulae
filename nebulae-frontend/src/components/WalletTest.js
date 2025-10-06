// frontend/src/components/WalletTest.js
// Componente de prueba para verificar SubWallet
import React, { useState } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

function WalletTest() {
  const [status, setStatus] = useState('No conectado');
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    try {
      setStatus('🔄 Conectando...');
      setError(null);

      // Habilitar extensión
      const extensions = await web3Enable('BloomWatch');
      
      if (extensions.length === 0) {
        setError('❌ SubWallet no detectado. ¿Lo instalaste?');
        setStatus('Error');
        return;
      }

      setStatus(`✅ ${extensions.length} extensión(es) detectada(s)`);

      // Obtener cuentas
      const allAccounts = await web3Accounts();
      
      if (allAccounts.length === 0) {
        setError('⚠️ No hay cuentas en SubWallet. Crea una primero.');
        setStatus('Sin cuentas');
        return;
      }

      setAccounts(allAccounts);
      setStatus(`✅ ${allAccounts.length} cuenta(s) encontrada(s)`);
      
    } catch (err) {
      console.error('Error:', err);
      setError(`❌ Error: ${err.message}`);
      setStatus('Error');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧪 Test de SubWallet</h2>
      
      <div style={styles.statusBox}>
        <p style={styles.status}>Estado: {status}</p>
        {error && <p style={styles.error}>{error}</p>}
      </div>

      <button onClick={testConnection} style={styles.button}>
        Probar Conexión SubWallet
      </button>

      {accounts.length > 0 && (
        <div style={styles.accountsList}>
          <h3 style={styles.subtitle}>Cuentas Detectadas:</h3>
          {accounts.map((account, index) => (
            <div key={index} style={styles.accountCard}>
              <p style={styles.accountName}>
                <strong>👤 Nombre:</strong> {account.meta.name || 'Sin nombre'}
              </p>
              <p style={styles.accountAddress}>
                <strong>📍 Dirección:</strong> {account.address}
              </p>
              <p style={styles.accountSource}>
                <strong>🔌 Fuente:</strong> {account.meta.source}
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={styles.instructions}>
        <h4>📋 Instrucciones:</h4>
        <ol style={styles.list}>
          <li>Instala SubWallet desde Chrome Web Store</li>
          <li>Crea una cuenta o importa una existente</li>
          <li>Cambia a red "Westend" en SubWallet</li>
          <li>Haz clic en "Probar Conexión SubWallet"</li>
          <li>Autoriza la conexión cuando aparezca el popup</li>
        </ol>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '30px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '28px',
    color: '#3498db'
  },
  statusBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  status: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold'
  },
  error: {
    margin: '10px 0 0 0',
    color: '#e74c3c',
    fontSize: '14px'
  },
  button: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #3498db, #2980b9)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginBottom: '20px'
  },
  accountsList: {
    marginTop: '20px'
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#2ecc71'
  },
  accountCard: {
    background: 'rgba(52, 152, 219, 0.1)',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '10px',
    border: '1px solid rgba(52, 152, 219, 0.3)'
  },
  accountName: {
    margin: '5px 0',
    fontSize: '14px'
  },
  accountAddress: {
    margin: '5px 0',
    fontSize: '12px',
    fontFamily: 'Courier New, monospace',
    color: '#3498db',
    wordBreak: 'break-all'
  },
  accountSource: {
    margin: '5px 0',
    fontSize: '13px',
    color: '#95a5a6'
  },
  instructions: {
    marginTop: '30px',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  list: {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#bbb',
    paddingLeft: '20px'
  }
};

export default WalletTest;