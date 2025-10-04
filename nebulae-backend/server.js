const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;
app.use(cors());
app.get('/api/hotspots', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    const rawData = fs.readFileSync(dataPath);
    res.json(JSON.parse(rawData));
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
  }
});
app.listen(PORT, () => {
  console.log(`✅ Servidor de Nebulae corriendo en http://localhost:${3001}`);
});