import dotenv from 'dotenv';
import express from 'express';
import { Express, Request, Response, NextFunction} from 'express';
import cors from 'cors';
import { createTicket, getTicketById, getTicketCount, getTicketCountForOIB } from './db';
const { auth } = require('express-oauth2-jwt-bearer');
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode'
import { error } from 'console';


dotenv.config();

//const externalUrl = process.env.RENDER_EXTERNAL_URL;
const externalUrl = null
const port=5000
//const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 5000;


const app = express();


//app.use(cors());


/*app.use(cors({
  origin: 'https://qr-app-frontend.onrender.com'  // zamijeni s URL-om tvog frontenda
}));*/

//api

const jwtCheck = auth({
  audience: 'https://qr-api',
  issuerBaseURL: 'https://dev-wazzrvhywxioafwr.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});



// Jednostavni GET endpoint za testiranje
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! Your QR code app is running.');
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


app.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const { id } = req.params; 

  console.log(req.params.id)

  console.log('Request received to fetch ticket with ID:', id); // Logiraj primljeni ID


 try {
    console.log('Fetching ticket from the database...'); // Log prije poziva funkcije

    const ticket = await getTicketById(id); // Dohvati ulaznicu iz baze prema UUID-u

    if (!ticket) {
      console.log('No ticket found for ID:', id); // Log kada nema ulaznice za dati ID
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    console.log('Ticket found:', ticket); // Log kada je ulaznica uspješno pronađena
    res.json(ticket); // Vrati ulaznicu ako je nađena
  } catch (err) {
    console.error('Error fetching ticket:', err); // Logiraj grešku ako se dogodila
    res.status(500).json({ error: 'Error fetching ticket' });
  }
});





// Endpoint for creating a ticket
app.post('/api/tickets/create', jwtCheck, async (req: Request, res: Response)  => {
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

    // Insert the ticket into the database and get the QR code
    const qrCode = await createTicket(vatin, firstName, lastName, ticketId);

    // Send back the QR code image as a base64 string
    res.status(201).json({ qrCode });
    return;
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});





/*// Konfiguracija servera
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
}*/

app._router.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});

app.listen(5000, () => {
  console.log(`Server running at http://localhost:5000`);
});