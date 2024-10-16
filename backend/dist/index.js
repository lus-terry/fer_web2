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
dotenv_1.default.config();
const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 5000;
const app = (0, express_1.default)();
// Middleware za parsiranje JSON tijela
app.use(express_1.default.json());
// CORS za sve rute
app.use((0, cors_1.default)());
// Jednostavni GET endpoint za testiranje
app.get('/', (req, res) => {
    res.send('Hello World! Your QR code app is running.');
});
// Ruta za dohvaćanje ulaznica (tickets)
app.get('/api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield (0, db_1.getTickets)();
        res.json({ tickets });
    }
    catch (err) {
        res.status(500).send('Error retrieving tickets');
    }
}));
// Konfiguracija servera
if (externalUrl) {
    // Ako smo u Render okruženju (externalUrl je dostupan)
    const hostname = '0.0.0.0'; // Potrebno za pokretanje na Renderu
    app.listen(port, hostname, () => {
        console.log(`Server locally running at http://${hostname}:${port}/ and from
      outside on ${externalUrl}`);
    });
}
else {
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
