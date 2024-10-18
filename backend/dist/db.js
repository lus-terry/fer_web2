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
exports.getTickets = getTickets;
exports.getTicketCount = getTicketCount;
exports.getTicketCountForOIB = getTicketCountForOIB;
exports.createTicket = createTicket;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// Učitaj varijable iz .env datoteke
dotenv_1.default.config();
// Konfiguracija baze podataka
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432, // Tipiziraj port kao broj
    ssl: { rejectUnauthorized: false }
});
console.log("Povezujem se s bazom:", {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});
// Funkcija za dohvaćanje podataka iz baze
function getTickets() {
    return __awaiter(this, void 0, void 0, function* () {
        const tickets = [];
        try {
            console.log('Izvršavam upit na bazu...');
            const results = yield pool.query('SELECT id FROM tickets');
            results.rows.forEach((row) => {
                tickets.push({
                    id: row.id,
                });
            });
        }
        catch (err) {
            console.error('Error executing query', err);
            throw err;
        }
        return tickets;
    });
}
// Function to get the total number of tickets
function getTicketCount() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Executing query to count tickets...');
            const result = yield pool.query('SELECT COUNT(*) FROM tickets');
            return parseInt(result.rows[0].count, 10); // Return the count as a number
        }
        catch (err) {
            console.error('Error executing count query', err);
            throw err;
        }
    });
}
// Function to count how many tickets exist for a given OIB
function getTicketCountForOIB(vatin) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield pool.query('SELECT COUNT(*) FROM tickets WHERE vatin = $1', [vatin]);
            return parseInt(result.rows[0].count, 10);
        }
        catch (err) {
            console.error('Error fetching ticket count for OIB:', err);
            throw err;
        }
    });
}
// Function to create a new ticket
function createTicket(vatin, firstName, lastName, ticketId) {
    return __awaiter(this, void 0, void 0, function* () {
        const creationTime = new Date(); // Get the current time
        try {
            yield pool.query('INSERT INTO tickets (id, vatin, first_name, last_name, created_at) VALUES ($1, $2, $3, $4, $5)', [ticketId, vatin, firstName, lastName, creationTime]);
        }
        catch (err) {
            console.error('Error creating ticket:', err);
            throw err;
        }
    });
}
