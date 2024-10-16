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
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
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
// Pokretanje servera
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
