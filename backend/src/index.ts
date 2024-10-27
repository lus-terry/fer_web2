import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  createTicket,
  getTicketById,
  getTicketCount,
  getTicketCountForOIB,
} from "./db";
const { auth } = require("express-oauth2-jwt-bearer");

dotenv.config();

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port =
  externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 5000;

const app = express();

app.use(cors({ origin: "https://qr-app-frontend.onrender.com" }));

app.use(express.json());

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
});

app.get("/", (req: Request, res: Response) => {
  res.send("QR code app is running.");
});

app.get("/api/tickets/count", async (req: Request, res: Response) => {
  try {
    const ticketsCount = await getTicketCount();
    res.json({ ticketsCount });
  } catch (err) {
    console.error("Error retrieving ticket count:", err);
    res.status(500).json({ error: "Error retrieving ticket count" });
  }
});

app.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(req.params.id);

  console.log("Request received to fetch ticket with ID:", id);

  try {
    console.log("Fetching ticket from the database");

    const ticket = await getTicketById(id);

    if (!ticket) {
      console.log("No ticket found for ID:", id);
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    console.log("Ticket found:", ticket);
    res.json(ticket);
  } catch (err) {
    console.error("Error fetching ticket:", err);
    res.status(500).json({ error: "Error fetching ticket" });
  }
});

app.post(
  "/api/tickets/create",
  jwtCheck,
  async (req: Request, res: Response) => {
    const { vatin, firstName, lastName } = req.body;

    if (!vatin || !firstName || !lastName) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const existingTicketsCount = await getTicketCountForOIB(vatin);

      if (existingTicketsCount >= 3) {
        res
          .status(400)
          .json({ error: "Cannot create more than 3 tickets for this OIB" });
        return;
      }
      const ticketId = uuidv4();

      const qrCode = await createTicket(vatin, firstName, lastName, ticketId);

      res.setHeader("Content-Type", "image/png");
      res.send(qrCode);

      return;
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }
);

if (externalUrl) {
  const hostname = "0.0.0.0";
  app.listen(port, hostname, () => {
    console.log(`Server locally running at http://${hostname}:${port}/ and from
      outside on ${externalUrl}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
