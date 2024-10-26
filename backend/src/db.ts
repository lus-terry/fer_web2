import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as QRCode from 'qrcode';


// Učitaj varijable iz .env datoteke
dotenv.config();

// Definiranje tipova podataka za ulaznicu (ticket)
interface Ticket {
  id: string;
  vatin: string;  // OIB ili ekvivalentni broj
  firstName: string;
  lastName: string;
  createdAt: Date; // ili string, ovisno o formatu koji koristiš
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
export async function createTicket(vatin: string, firstName: string, lastName: string, ticketId: string): Promise<string> {
  const creationTime = new Date();  // Get the current time

  try {
     // 1. Kreiraj ulaznicu u bazi
     await pool.query(
      'INSERT INTO tickets (id, vatin, "firstName", "lastName", created_at) VALUES ($1, $2, $3, $4, $5)',
      [ticketId, vatin, firstName, lastName, creationTime]
    );

    // 2. Generiraj QR kod za ovu ulaznicu
    const url = `http://localhost:3000/tickets/${ticketId}`;  // Ovo je URL ulaznice koji QR kod sadrži
    const qrCodeData = await QRCode.toDataURL(url);  // Generiraj QR kod kao Base64 string

    // 3. Vrati generirani QR kod
    return qrCodeData;  // Vraćamo QR kod klijentu

   } catch (err) {
    console.error('Error creating ticket:', err);
    throw err;
  }
}

// Funkcija za dohvaćanje ulaznice prema UUID-u
export async function getTicketById(ticketId: string): Promise<Ticket | null> {
  console.log('getTicketById called with ticketId:', ticketId); // Log za provjeru ulaznog parametra

  try {
    // Log za početak izvršavanja SQL upita
    console.log('Executing query to fetch ticket by ID...');
    
    const result = await pool.query(
      'SELECT * FROM tickets WHERE id = $1',
      [ticketId]
    );
    
    // Log za provjeru rezultata upita
    console.log('Query result:', result);

    if (result.rows.length === 0) {
      console.log('No ticket found for the given ID:', ticketId); // Log za slučaj kada nema rezultata
      return null; // Ulaznica nije pronađena
    }

    const row = result.rows[0];

    // Log za prikaz pronađenih podataka iz baze
    console.log('Ticket data retrieved:', row);

    return {
      id: row.id,
      vatin: row.vatin,
      firstName: row.firstName,
      lastName: row.lastName,
      createdAt: row.created_at,
    };
  } catch (err: any) {
    console.error('Error fetching ticket by ID:', err); // Logiraj cijelu grešku
    console.error('Error details:', {
      name: err.name,            // Tip greške, npr. 'TypeError' ili 'DatabaseError'
      message: err.message,      // Poruka greške
      stack: err.stack,          // Stack trace za detaljno praćenje greške
      code: err.code,            // Kod greške, specifičan za bazu podataka, npr. 'ECONNREFUSED' ili 'ETIMEDOUT'
      detail: err.detail         // Dodatne informacije o grešci, ako ih baza vraća
    });
    throw err;
}

}


