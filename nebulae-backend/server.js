// server.js - Backend BloomWatch (Combinado y Optimizado)
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Configuración CORS más permisiva
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Variables de estado del servicio
let polkadotService = null;
let polkadotAvailable = false;
let serviceStatus = {
  blockchain: 'checking',
  database: 'unknown',
  api: 'running'
};

// Intentar cargar servicio Polkadot (NO bloquear si falla)
try {
  polkadotService = require('./services/polkadotService');
  console.log('✅ Servicio Polkadot cargado');
  serviceStatus.blockchain = 'available';
} catch (error) {
  console.log('⚠️  Servicio Polkadot no disponible:', error.message);
  serviceStatus.blockchain = 'unavailable';
}

// ===== RUTAS DE ESTADO Y PRUEBA =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: serviceStatus,
    uptime: process.uptime()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend BloomWatch funcionando correctamente', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    polkadotAvailable,
    features: {
      authentication: true,
      blockchain: polkadotAvailable,
      hotspots: true,
      nfts: polkadotAvailable
    }
  });
});

// ===== RUTAS DE AUTENTICACIÓN =====
app.post('/api/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validaciones básicas
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Todos los campos son requeridos' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const usersPath = path.join(__dirname, 'data', 'users.json');
    
    // Crear directorio si no existe
    const dataDir = path.dirname(usersPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    let users = [];
    
    try {
      if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      }
    } catch (error) {
      console.error('Error reading users file:', error);
    }
    
    // Verificar usuario existente
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ 
        success: false,
        message: 'El usuario ya existe' 
      });
    }
    
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ 
        success: false,
        message: 'El email ya está registrado' 
      });
    }
    
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: Buffer.from(password).toString('base64'), // Encriptación básica
      walletAddress: null,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    
    users.push(newUser);
    
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    
    res.json({ 
      success: true,
      message: 'Usuario registrado exitosamente',
      user: { 
        id: newUser.id, 
        username: newUser.username, 
        email: newUser.email 
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Usuario y contraseña requeridos' 
      });
    }
    
    const usersPath = path.join(__dirname, 'data', 'users.json');
    let users = [];
    
    try {
      if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      }
    } catch (error) {
      console.error('Error reading users file:', error);
    }
    
    const user = users.find(u => 
      u.username === username && 
      u.password === Buffer.from(password).toString('base64')
    );
    
    if (user) {
      // Actualizar último login
      user.lastLogin = new Date().toISOString();
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
      
      res.json({ 
        success: true,
        message: 'Login exitoso',
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          walletAddress: user.walletAddress 
        }
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: 'Credenciales incorrectas' 
      });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
});

// ===== RUTAS BLOCKCHAIN (CON FALLBACK) =====
app.get('/api/blockchain/status', async (req, res) => {
  try {
    if (!polkadotService || !polkadotAvailable) {
      return res.json({
        connected: false,
        mode: 'fallback',
        message: 'Servicio Polkadot no disponible - Modo simulación activado',
        timestamp: new Date().toISOString()
      });
    }
    
    const info = await polkadotService.getChainInfo();
    res.json({
      connected: true,
      mode: 'live',
      ...info,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      connected: false,
      mode: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/blockchain/stats', async (req, res) => {
  try {
    if (!polkadotService || !polkadotAvailable) {
      // Datos de simulación
      return res.json({
        connected: false,
        totalNFTsMinted: 1247,
        activeUsers: 543,
        totalTransactions: 2891,
        network: 'Westend Testnet (Simulado)',
        blockNumber: Math.floor(Math.random() * 10000000),
        message: 'Datos en modo simulación'
      });
    }
    
    const stats = await polkadotService.getDashboardStats();
    res.json({
      connected: true,
      ...stats
    });
  } catch (error) {
    console.error('Error obteniendo stats:', error);
    res.json({
      connected: false,
      error: error.message
    });
  }
});

// ===== RUTAS HOTSPOTS (MEJORADA) =====
app.get('/api/hotspots', async (req, res) => {
  try {
    // Intentar cargar desde data.json primero
    const dataPath = path.join(__dirname, 'data.json');
    let hotspots = [];

    if (fs.existsSync(dataPath)) {
      const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      hotspots = rawData.map(item => ({
        ...item,
        coordinates: { 
          lat: item.lat, 
          lon: item.lon,
          x: Math.floor((item.lon + 180) / 360 * 100), // Simulación coordenadas X/Y para mapa
          y: Math.floor((90 - item.lat) / 180 * 100)
        },
        image: item.image || `/assets/images/location-${item.id}.jpg`,
        nftId: item.nftId || `0x${Math.random().toString(16).substr(2, 8)}`
      }));
    } else {
      // Datos de respaldo
      hotspots = [
        {
          id: 1,
          name: "Ecosistema del Río Chili",
          lat: -16.409047,
          lon: -71.537451,
          coordinates: { lat: -16.409047, lon: -71.537451, x: 30, y: 40 },
          type: "river",
          rarity: "Común",
          pollinatorActivity: "65%",
          price: "50 $BLOOM",
          image: "/assets/images/river-chili.jpg",
          description: "Zona ribereña con alta biodiversidad",
          nftId: "0x1234abcd"
        },
        {
          id: 2,
          name: "Valle de Chilina", 
          lat: -16.3769,
          lon: -71.5283,
          coordinates: { lat: -16.3769, lon: -71.5283, x: 35, y: 45 },
          type: "valley",
          rarity: "Épico",
          pollinatorActivity: "88%",
          price: "250 $BLOOM",
          image: "/assets/images/chilina-valley.jpg",
          description: "Valle fértil con microclima ideal",
          nftId: "0x5678efgh"
        }
      ];
    }

    // Información blockchain si está disponible
    let blockchain = { connected: false };
    
    if (polkadotService && polkadotAvailable) {
      try {
        const stats = await polkadotService.getDashboardStats();
        blockchain = {
          connected: true,
          network: stats.network,
          blockNumber: stats.blockNumber,
          totalNFTs: stats.totalNFTsMinted
        };
      } catch (error) {
        // Silenciar error, continuar sin blockchain
      }
    }

    res.json({
      success: true,
      hotspots,
      blockchain,
      total: hotspots.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en /api/hotspots:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener hotspots',
      hotspots: []
    });
  }
});

// ===== RUTAS WALLET Y NFTS =====
app.get('/api/wallet/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!polkadotService || !polkadotAvailable) {
      // Simular balance
      const simulatedBalance = (Math.random() * 1000).toFixed(4);
      return res.json({
        address,
        balance: simulatedBalance,
        network: 'Westend Testnet (Simulado)',
        mode: 'simulation'
      });
    }
    
    if (!polkadotService.isValidAddress(address)) {
      return res.status(400).json({ 
        success: false,
        error: 'Dirección inválida' 
      });
    }
    
    const balance = await polkadotService.getBalance(address);
    res.json({
      success: true,
      address,
      balance,
      network: 'Westend Testnet',
      mode: 'live'
    });
  } catch (error) {
    console.error('Error obteniendo balance:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

app.get('/api/nfts/user/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!polkadotService || !polkadotAvailable) {
      // NFTs simulados
      const mockNFTs = [
        {
          id: 1,
          name: "Rosa Andina",
          image: "/assets/images/nft-rose.jpg",
          rarity: "Épico",
          location: "Valle de Chilina",
          minted: "2024-01-15"
        },
        {
          id: 2, 
          name: "Cactus del Desierto",
          image: "/assets/images/nft-cactus.jpg",
          rarity: "Raro",
          location: "Zona Desértica",
          minted: "2024-01-10"
        }
      ];
      
      return res.json({
        success: true,
        nfts: mockNFTs,
        total: mockNFTs.length,
        mode: 'simulation',
        message: 'Datos en modo simulación'
      });
    }
    
    if (!polkadotService.isValidAddress(address)) {
      return res.status(400).json({ 
        success: false,
        error: 'Dirección inválida' 
      });
    }
    
    const nftsData = await polkadotService.getMockNFTs(address);
    res.json({
      success: true,
      ...nftsData,
      mode: 'live'
    });
  } catch (error) {
    console.error('Error obteniendo NFTs:', error);
    res.json({ 
      success: false,
      nfts: [], 
      total: 0, 
      error: error.message 
    });
  }
});

app.post('/api/wallet/link', (req, res) => {
  try {
    const { username, walletAddress } = req.body;
    
    if (!username || !walletAddress) {
      return res.status(400).json({ 
        success: false,
        error: 'Usuario y dirección de wallet requeridos' 
      });
    }
    
    if (polkadotService && !polkadotService.isValidAddress(walletAddress)) {
      return res.status(400).json({ 
        success: false,
        error: 'Dirección de wallet inválida' 
      });
    }
    
    const usersPath = path.join(__dirname, 'data', 'users.json');
    let users = [];
    
    try {
      if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      }
    } catch (error) {
      console.error('Error reading users file:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Error al acceder a la base de datos' 
      });
    }
    
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuario no encontrado' 
      });
    }
    
    users[userIndex].walletAddress = walletAddress;
    users[userIndex].walletLinkedAt = new Date().toISOString();
    
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    
    res.json({
      success: true,
      message: 'Wallet asociada exitosamente',
      walletAddress,
      linkedAt: users[userIndex].walletLinkedAt
    });
  } catch (error) {
    console.error('Error asociando wallet:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al asociar wallet' 
    });
  }
});

// ===== MANEJO DE ERRORES GLOBAL =====
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ 
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Endpoint no encontrado',
    path: req.originalUrl
  });
});

// ===== INICIAR SERVIDOR =====
const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', async () => {
  console.log('========================================');
  console.log(`🚀 Servidor BloomWatch en http://localhost:${PORT}`);
  console.log('========================================');
  console.log('📋 Endpoints disponibles:');
  console.log('  GET  /api/health           - Estado del servidor');
  console.log('  GET  /api/test             - Prueba básica');
  console.log('  POST /api/register         - Registro de usuario');
  console.log('  POST /api/login            - Inicio de sesión');
  console.log('  GET  /api/hotspots         - Ubicaciones disponibles');
  console.log('  GET  /api/blockchain/status- Estado blockchain');
  console.log('  GET  /api/blockchain/stats - Estadísticas');
  console.log('  GET  /api/nfts/user/:addr  - NFTs del usuario');
  console.log('========================================');
  
  // Conectar a Polkadot EN BACKGROUND
  if (polkadotService) {
    console.log('\n🔗 Conectando a Polkadot (background)...');
    
    polkadotService.connect()
      .then(async () => {
        const info = await polkadotService.getChainInfo();
        polkadotAvailable = true;
        serviceStatus.blockchain = 'connected';
        console.log(`✅ Polkadot conectado: ${info.chain}`);
        console.log(`📦 Bloque: #${info.blockNumber}`);
      })
      .catch(error => {
        console.log(`⚠️  Polkadot no disponible: ${error.message}`);
        console.log('   El servidor funciona en modo simulación');
        serviceStatus.blockchain = 'disconnected';
      });
  } else {
    console.log('\n⚠️  Servicio Polkadot no cargado');
    console.log('   El servidor funciona en modo simulación');
  }
  
  serviceStatus.database = 'ready';
  console.log('========================================\n');
});

// Cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor BloomWatch...');
  if (polkadotService && polkadotAvailable) {
    await polkadotService.disconnect();
  }
  console.log('✅ Servidor cerrado correctamente');
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});