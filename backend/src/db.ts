import { Pool } from "pg";
import * as QRCode from "qrcode";

interface Ticket {
  id: string;
  vatin: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: { rejectUnauthorized: false },
});

console.log("Connecting with db", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

const appUrl = process.env.REACT_APP_URL;

export async function getTicketCount(): Promise<number> {
  try {
    console.log("Executing query to count tickets");
    const result = await pool.query("SELECT COUNT(*) FROM tickets");
    return parseInt(result.rows[0].count, 10);
  } catch (err) {
    console.error("Error executing count query", err);
    throw err;
  }
}

export async function getTicketCountForOIB(vatin: string): Promise<number> {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM tickets WHERE vatin = $1",
      [vatin]
    );
    return parseInt(result.rows[0].count, 10);
  } catch (err) {
    console.error("Error fetching ticket count for OIB:", err);
    throw err;
  }
}

export async function createTicket(
  vatin: string,
  firstName: string,
  lastName: string,
  ticketId: string
): Promise<Buffer> {
  const creationTime = new Date();
  try {
    await pool.query(
      'INSERT INTO tickets (id, vatin, "firstName", "lastName", created_at) VALUES ($1, $2, $3, $4, $5)',
      [ticketId, vatin, firstName, lastName, creationTime]
    );

    console.log("ticket created");

    const url = `${appUrl}/tickets/${ticketId}`;
    const qrCodeBuffer = await QRCode.toBuffer(url);
    return qrCodeBuffer;
  } catch (err) {
    console.error("Error creating ticket:", err);
    throw err;
  }
}

export async function getTicketById(ticketId: string): Promise<Ticket | null> {
  console.log("getTicketById, ticketId:", ticketId);

  try {
    console.log("Fetching ticket by Id");

    const result = await pool.query("SELECT * FROM tickets WHERE id = $1", [
      ticketId,
    ]);

    console.log("Query result:", result);

    if (result.rows.length === 0) {
      console.log("No ticket found for the given ID:", ticketId);
      return null;
    }

    const row = result.rows[0];

    console.log("Ticket data retrieved:", row);

    return {
      id: row.id,
      vatin: row.vatin,
      firstName: row.firstName,
      lastName: row.lastName,
      createdAt: row.created_at,
    };
  } catch (err: any) {
    console.error("Error fetching ticket by ID:", err);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
      detail: err.detail,
    });
    throw err;
  }
}
