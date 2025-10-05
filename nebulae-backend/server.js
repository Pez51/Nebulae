// En tu server.js del backend
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para registro de usuarios
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // Leer usuarios existentes
  const usersPath = path.join(__dirname, 'users.json');
  let users = [];
  
  try {
    if (fs.existsSync(usersPath)) {
      users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading users file:', error);
  }
  
  // Verificar si el usuario ya existe
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }
  
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'El email ya está registrado' });
  }
  
  // Agregar nuevo usuario (en producción, hashear la contraseña)
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password, // ¡En producción usar bcrypt!
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

// Ruta para login
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

// Mantén tus otras rutas existentes...
app.get('/api/hotspots', (req, res) => {
  // Tu código existente para hotspots
});

app.listen(3001, () => {
  console.log('Servidor corriendo en puerto 3001');
});