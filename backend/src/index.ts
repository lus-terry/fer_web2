import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { getTickets } from './db';
import fs from 'fs';
import https from 'https';

dotenv.config();

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 5000;

const app = express();


// Middleware za parsiranje JSON tijela
app.use(express.json());

app.use(cors({
  origin: 'https://qr-app-frontend.onrender.com'  // zamijeni s URL-om tvog frontenda
}));


// Jednostavni GET endpoint za testiranje
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! Your QR code app is running.');
});

// Ruta za dohvaćanje ulaznica (tickets)
app.get('/api/tickets', async (req: Request, res: Response) => {
  try {
    const tickets = await getTickets();
    res.json({tickets});
  } catch (err) {
    res.status(500).send('Error retrieving tickets');
  }
});


// Konfiguracija servera
if (externalUrl) {
  // Ako smo u Render okruženju (externalUrl je dostupan)
  const hostname = '0.0.0.0'; // Potrebno za pokretanje na Renderu
  app.listen(port, hostname, () => {
    console.log(`Server locally running at http://${hostname}:${port}/ and from
      outside on ${externalUrl}`);
  });
} else {
  // Ako smo lokalno, pokreni HTTPS server
  /*https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)
  .listen(port, function() {
    console.log(`Server running at https://localhost:${port}`);
  });*/
  
    // Ako smo lokalno, koristi samo HTTP (ne HTTPS)
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
}
