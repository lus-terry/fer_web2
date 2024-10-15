require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getTickets } = require('./db.js'); // Importiraj funkciju iz db.js

const app = express();
const port = process.env.PORT || 5000;

// Middleware za parsiranje JSON tijela
app.use(express.json());

// CORS za sve rute
app.use(cors());

// Jednostavni GET endpoint za testiranje
app.get('/', (req, res) => {
  res.send('Hello World! Your QR code app is running.');
});

// Ruta za dohvaćanje ulaznica (tickets)
app.get('/api', async (req, res) => {
  try {
    const tickets = await getTickets();
    res.json({tickets});
  } catch (err) {
    res.status(500).send('Error retrieving tickets');
  }
});

// Pokretanje servera
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
