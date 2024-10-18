import { Pool } from 'pg';
import dotenv from 'dotenv';

// Učitaj varijable iz .env datoteke
dotenv.config();

// Definiranje tipova podataka za ulaznicu (ticket)
interface Ticket {
    id: string;

  }

// Konfiguracija baze podataka
const pool = new Pool({
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
export async function getTickets(): Promise<Ticket[]> {
const tickets: Ticket[] = [];
  try {
    console.log('Izvršavam upit na bazu...');
    const results = await pool.query('SELECT id FROM tickets');
    results.rows.forEach((row : any) => {
      tickets.push({
        id: row.id,
 
      });
    });
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
  return tickets;
}

