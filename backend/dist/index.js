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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const db_1 = require("./db");
const { auth } = require("express-oauth2-jwt-bearer");
dotenv_1.default.config();
const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 5000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "https://qr-app-frontend.onrender.com" }));
app.use(express_1.default.json());
const jwtCheck = auth({
    audience: "https://qr-api",
    issuerBaseURL: "https://dev-wazzrvhywxioafwr.us.auth0.com/",
    tokenSigningAlg: "RS256",
});
app.get("/", (req, res) => {
    res.send("QR code app is running.");
});
app.get("/api/tickets/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticketsCount = yield (0, db_1.getTicketCount)();
        res.json({ ticketsCount });
    }
    catch (err) {
        console.error("Error retrieving ticket count:", err);
        res.status(500).json({ error: "Error retrieving ticket count" });
    }
}));
app.get("/api/tickets/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(req.params.id);
    console.log("Request received to fetch ticket with ID:", id);
    try {
        console.log("Fetching ticket from the database...");
        const ticket = yield (0, db_1.getTicketById)(id);
        if (!ticket) {
            console.log("No ticket found for ID:", id);
            res.status(404).json({ error: "Ticket not found" });
            return;
        }
        console.log("Ticket found:", ticket);
        res.json(ticket);
    }
    catch (err) {
        console.error("Error fetching ticket:", err);
        res.status(500).json({ error: "Error fetching ticket" });
    }
}));
app.post("/api/tickets/create", jwtCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vatin, firstName, lastName } = req.body;
    if (!vatin || !firstName || !lastName) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    try {
        const existingTicketsCount = yield (0, db_1.getTicketCountForOIB)(vatin);
        if (existingTicketsCount >= 3) {
            res
                .status(400)
                .json({ error: "Cannot create more than 3 tickets for this OIB" });
            return;
        }
        const ticketId = (0, uuid_1.v4)();
        const qrCode = yield (0, db_1.createTicket)(vatin, firstName, lastName, ticketId);
        res.setHeader("Content-Type", "image/png");
        res.send(qrCode);
        return;
    }
    catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}));
if (externalUrl) {
    const hostname = "0.0.0.0";
    app.listen(port, hostname, () => {
        console.log(`Server locally running at http://${hostname}:${port}/ and from
      outside on ${externalUrl}`);
    });
}
else {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
