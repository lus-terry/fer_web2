"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getTicketCount = getTicketCount;
exports.getTicketCountForOIB = getTicketCountForOIB;
exports.createTicket = createTicket;
exports.getTicketById = getTicketById;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const QRCode = __importStar(require("qrcode"));
dotenv_1.default.config();
// Konfiguracija baze podataka
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432, // Tipiziraj port kao broj
    ssl: { rejectUnauthorized: false },
});
console.log("Povezujem se s bazom:", {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
});
const appUrl = process.env.REACT_APP_URL;
// Function to get the total number of tickets
function getTicketCount() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Executing query to count tickets...");
            const result = yield pool.query("SELECT COUNT(*) FROM tickets");
            return parseInt(result.rows[0].count, 10); // Return the count as a number
        }
        catch (err) {
            console.error("Error executing count query", err);
            throw err;
        }
    });
}
// Function to count how many tickets exist for a given OIB
function getTicketCountForOIB(vatin) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield pool.query("SELECT COUNT(*) FROM tickets WHERE vatin = $1", [vatin]);
            return parseInt(result.rows[0].count, 10);
        }
        catch (err) {
            console.error("Error fetching ticket count for OIB:", err);
            throw err;
        }
    });
}
// Function to create a new ticket
function createTicket(vatin, firstName, lastName, ticketId) {
    return __awaiter(this, void 0, void 0, function* () {
        const creationTime = new Date(); // Get the current time
        try {
            // 1. Kreiraj ulaznicu u bazi
            yield pool.query('INSERT INTO tickets (id, vatin, "firstName", "lastName", created_at) VALUES ($1, $2, $3, $4, $5)', [ticketId, vatin, firstName, lastName, creationTime]);
            console.log("ticket created");
            // 2. Generiraj QR kod za ovu ulaznicu
            const url = `${appUrl}/tickets/${ticketId}`; // Ovo je URL ulaznice koji QR kod sadrži
            const qrCodeBuffer = yield QRCode.toBuffer(url);
            return qrCodeBuffer;
        }
        catch (err) {
            console.error("Error creating ticket:", err);
            throw err;
        }
    });
}
// Funkcija za dohvaćanje ulaznice prema UUID-u
function getTicketById(ticketId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("getTicketById called with ticketId:", ticketId); // Log za provjeru ulaznog parametra
        try {
            // Log za početak izvršavanja SQL upita
            console.log("Executing query to fetch ticket by ID...");
            const result = yield pool.query("SELECT * FROM tickets WHERE id = $1", [
                ticketId,
            ]);
            // Log za provjeru rezultata upita
            console.log("Query result:", result);
            if (result.rows.length === 0) {
                console.log("No ticket found for the given ID:", ticketId); // Log za slučaj kada nema rezultata
                return null; // Ulaznica nije pronađena
            }
            const row = result.rows[0];
            // Log za prikaz pronađenih podataka iz baze
            console.log("Ticket data retrieved:", row);
            return {
                id: row.id,
                vatin: row.vatin,
                firstName: row.firstName,
                lastName: row.lastName,
                createdAt: row.created_at,
            };
        }
        catch (err) {
            console.error("Error fetching ticket by ID:", err); // Logiraj cijelu grešku
            console.error("Error details:", {
                name: err.name, // Tip greške, npr. 'TypeError' ili 'DatabaseError'
                message: err.message, // Poruka greške
                stack: err.stack, // Stack trace za detaljno praćenje greške
                code: err.code, // Kod greške, specifičan za bazu podataka, npr. 'ECONNREFUSED' ili 'ETIMEDOUT'
                detail: err.detail, // Dodatne informacije o grešci, ako ih baza vraća
            });
            throw err;
        }
    });
}
