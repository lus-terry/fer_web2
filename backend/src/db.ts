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

// Function to get the total number of tickets
export async function getTicketCount(): Promise<number> {
  try {
    console.log('Executing query to count tickets...');
    const result = await pool.query('SELECT COUNT(*) FROM tickets');
    return parseInt(result.rows[0].count, 10); // Return the count as a number
  } catch (err) {
    console.error('Error executing count query', err);
    throw err;
  }
}

// Function to count how many tickets exist for a given OIB
export async function getTicketCountForOIB(vatin: string): Promise<number> {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM tickets WHERE vatin = $1', [vatin]);
    return parseInt(result.rows[0].count, 10);
  } catch (err) {
    console.error('Error fetching ticket count for OIB:', err);
    throw err;
  }
}

// Function to create a new ticket
export async function createTicket(vatin: string, firstName: string, lastName: string, ticketId: string): Promise<void> {
  const creationTime = new Date();  // Get the current time

  try {
    await pool.query(
      'INSERT INTO tickets (id, vatin, first_name, last_name, created_at) VALUES ($1, $2, $3, $4, $5)',
      [ticketId, vatin, firstName, lastName, creationTime]
    );
  } catch (err) {
    console.error('Error creating ticket:', err);
    throw err;
  }
}

