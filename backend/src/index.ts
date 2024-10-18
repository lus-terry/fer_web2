import dotenv from 'dotenv';
import express from 'express';
import { Express, Request, Response} from 'express';
import cors from 'cors';
import { createTicket, getTicketCount, getTicketCountForOIB, getTickets } from './db';
const { auth } = require('express-oauth2-jwt-bearer');
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode'


dotenv.config();

//const externalUrl = process.env.RENDER_EXTERNAL_URL;
const externalUrl = null
const port=5000
//const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 5000;


const app = express();
// Middleware za parsiranje JSON tijela
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));


/*app.use(cors({
  origin: 'https://qr-app-frontend.onrender.com'  // zamijeni s URL-om tvog frontenda
}));*/

//api

const jwtCheck = auth({
  audience: 'https://qr-api',
  issuerBaseURL: 'https://dev-wazzrvhywxioafwr.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

// enforce on all endpoints
app.use(jwtCheck);

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});



// Jednostavni GET endpoint za testiranje
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! Your QR code app is running.');
});

// Ruta za dohvaćanje ulaznica (tickets)
app.get('/api/tickets', async (req: Request, res: Response) => {
  console.log('Ruta /api/tickets je pozvana');
  try {
    const tickets = await getTickets();
    res.json({tickets});
  } catch (err) {
    res.status(500).send('Error retrieving tickets');
  }
});

// Endpoint for ticket count
app.get('/api/tickets/count', async (req: Request, res: Response) => {
  try {
    const ticketsCount = await getTicketCount();
    res.json({ticketsCount});
  } catch (err) {
    console.error('Error retrieving ticket count:', err);
    res.status(500).json({ error: 'Error retrieving ticket count' });
  }
});

// Endpoint for creating a ticket
app.post('/api/tickets/create', async (req: Request, res: Response) => {
  const { vatin, firstName, lastName } = req.body;

  // Validate the request body
  if (!vatin || !firstName || !lastName) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    // Check how many tickets exist for this OIB
    const existingTicketsCount = await getTicketCountForOIB(vatin);
    
    if (existingTicketsCount >= 3) {
      res.status(400).json({ error: 'Cannot create more than 3 tickets for this OIB' });
      return;
    }

    // Generate UUID for the new ticket
    const ticketId = uuidv4();

    // Insert the ticket into the database
    await createTicket(vatin, firstName, lastName, ticketId);

    // Generate a QR code containing the ticket URL
    const ticketUrl = `http://localhost:3000/ticket/${ticketId}`;
    const qrCode = await QRCode.toDataURL(ticketUrl);

    // Send back the QR code image as a base64 string
    res.status(201).json({ qrCode });
    return;
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }

});

// Konfiguracija servera
if (externalUrl) {
  const hostname = '0.0.0.0'; // Potrebno za pokretanje na Renderu
  app.listen(port, hostname, () => {
    console.log(`Server locally running at http://${hostname}:${port}/ and from
      outside on ${externalUrl}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}