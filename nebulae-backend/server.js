const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// 'cors' es un middleware de seguridad para permitir que tu frontend (en puerto 3000)
// pueda hacer peticiones a tu backend (en puerto 3001).
app.use(cors());

// Este es tu "endpoint" de la API. Cuando el frontend visite http://localhost:3001/api/hotspots,
// se ejecutará esta función.
app.get('/api/hotspots', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    const rawData = fs.readFileSync(dataPath);
    const hotspots = JSON.parse(rawData);
    res.json(hotspots);
  } catch (error) {
    console.error("Error al leer el archivo data.json:", error);
    res.status(500).json({ message: "Error interno del servidor. Revisa que data.json exista." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor de Nebulae corriendo en http://localhost:${3000}`);
  console.log('📡 Sirviendo datos desde el archivo data.json');
});