const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Configuración CORS más permisiva
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Ruta de prueba para verificar que el servidor funciona
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente', timestamp: new Date().toISOString() });
});

// Ruta para hotspots (mantén tu código original pero con manejo de errores)
app.get('/api/hotspots', (req, res) => {
  try {
    // Si tienes un archivo data.json, úsalo, sino devuelve datos de prueba
    const dataPath = path.join(__dirname, 'data.json');
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json(data);
    } else {
      // Datos de prueba si no existe el archivo
      const testData = [
        { 
          id: 1, 
          lat: -16.3989, 
          lon: -71.5375, 
          name: 'Zona Desértica - Phoenix', 
          rarity: 'Común', 
          pollinatorActivity: '45%', 
          price: '15 $BLOOM' 
        },
        { 
          id: 2, 
          lat: -16.3900, 
          lon: -71.5300, 
          name: 'Zona Montañosa', 
          rarity: 'Raro', 
          pollinatorActivity: '60%', 
          price: '25 $BLOOM' 
        }
      ];
      res.json(testData);
    }
  } catch (error) {
    console.error('Error en /api/hotspots:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas para usuarios (las que te pasé antes)
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  
  const usersPath = path.join(__dirname, 'users.json');
  let users = [];
  
  try {
    if (fs.existsSync(usersPath)) {
      users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading users file:', error);
  }
  
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }
  
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'El email ya está registrado' });
  }
  
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  try {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    res.json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar usuario' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const usersPath = path.join(__dirname, 'users.json');
  let users = [];
  
  try {
    if (fs.existsSync(usersPath)) {
      users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading users file:', error);
  }
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({ 
      message: 'Login exitoso',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`✅ Ruta de prueba: http://localhost:${PORT}/api/test`);
});