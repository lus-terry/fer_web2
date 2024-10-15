const { Pool } = require('pg');
require('dotenv').config();

// Konfiguracija baze podataka
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432, // Port je obično 5432 za PostgreSQL
  ssl: { rejectUnauthorized: false }
});

// Funkcija za dohvaćanje podataka iz baze
async function getTickets() {
  const tickets = [];
  try {
    const results = await pool.query('SELECT id FROM tickets');
    results.rows.forEach(row => {
      tickets.push({
        id: row.id,
        firstName: row.firstname,
        lastName: row.lastname
      });
    });
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
  return tickets;
}

module.exports = { getTickets };
