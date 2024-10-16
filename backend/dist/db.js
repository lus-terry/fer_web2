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
// Funkcija za dohvaćanje podataka iz baze
function getTickets() {
    return __awaiter(this, void 0, void 0, function* () {
        const tickets = [];
        try {
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
