require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');



// Povezivanje s bazom podataka
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Middleware za parsiranje JSON tijela
app.use(express.json());

//CORS za sve rute
app.use(cors());  

// Jednostavni GET endpoint za testiranje
app.get('/', (req, res) => {
  res.send('Hello World! Your QR code app is running.');
});

app.get('/api', (req, res) => {
  res.json({"tickets": ["ticket1", "ticket2", "ticket3"]})
});

// Pokretanje servera
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
