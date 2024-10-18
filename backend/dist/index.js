"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const { auth } = require('express-oauth2-jwt-bearer');
const uuid_1 = require("uuid");
const qrcode_1 = __importDefault(require("qrcode"));
dotenv_1.default.config();
//const externalUrl = process.env.RENDER_EXTERNAL_URL;
const externalUrl = null;
const port = 5000;
//const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 5000;
const app = (0, express_1.default)();
// Middleware za parsiranje JSON tijela
app.use(express_1.default.json());
app.use((0, cors_1.default)({
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
app.get('/', (req, res) => {
    res.send('Hello World! Your QR code app is running.');
});
// Ruta za dohvaćanje ulaznica (tickets)
app.get('/api/tickets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Ruta /api/tickets je pozvana');
    try {
        const tickets = yield (0, db_1.getTickets)();
        res.json({ tickets });
    }
    catch (err) {
        res.status(500).send('Error retrieving tickets');
    }
}));
// Endpoint for ticket count
app.get('/api/tickets/count', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticketsCount = yield (0, db_1.getTicketCount)();
        res.json({ ticketsCount });
    }
    catch (err) {
        console.error('Error retrieving ticket count:', err);
        res.status(500).json({ error: 'Error retrieving ticket count' });
    }
}));
// Endpoint for creating a ticket
app.post('/api/tickets/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vatin, firstName, lastName } = req.body;
    // Validate the request body
    if (!vatin || !firstName || !lastName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        // Check how many tickets exist for this OIB
        const existingTicketsCount = yield (0, db_1.getTicketCountForOIB)(vatin);
        if (existingTicketsCount >= 3) {
            return res.status(400).json({ error: 'Cannot create more than 3 tickets for this OIB' });
        }
        // Generate UUID for the new ticket
        const ticketId = (0, uuid_1.v4)();
        // Insert the ticket into the database
        yield (0, db_1.createTicket)(vatin, firstName, lastName, ticketId);
        // Generate a QR code containing the ticket URL
        const ticketUrl = `http://localhost:3000/ticket/${ticketId}`;
        const qrCode = yield qrcode_1.default.toDataURL(ticketUrl);
        // Send back the QR code image as a base64 string
        return res.status(201).json({ qrCode });
    }
    catch (error) {
        console.error('Error creating ticket:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
// Konfiguracija servera
if (externalUrl) {
    const hostname = '0.0.0.0'; // Potrebno za pokretanje na Renderu
    app.listen(port, hostname, () => {
        console.log(`Server locally running at http://${hostname}:${port}/ and from
      outside on ${externalUrl}`);
    });
}
else {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
