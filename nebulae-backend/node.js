// --- Backend simple para la Hackathon (PARA PROGRAMADOR #2) ---

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors()); // Permite peticiones desde el frontend de React

// Endpoint principal para obtener los datos de floración
app.get('/api/hotspots', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    const rawData = fs.readFileSync(dataPath);
    const hotspots = JSON.parse(rawData);
    res.json(hotspots);
  } catch (error) {
    console.error("Error al leer el archivo data.json:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de Nebulae corriendo en http://localhost:${PORT}`);
  console.log('Sirviendo datos desde el archivo data.json');
});