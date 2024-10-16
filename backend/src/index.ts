import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { getTickets } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware za parsiranje JSON tijela
app.use(express.json());

// CORS za sve rute
app.use(cors());

// Jednostavni GET endpoint za testiranje
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! Your QR code app is running.');
});

// Ruta za dohvaćanje ulaznica (tickets)
app.get('/api', async (req: Request, res: Response) => {
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
