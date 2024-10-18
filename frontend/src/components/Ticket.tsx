import React, { useEffect, useState } from 'react';

// Definiraj tip za jedan ticket
interface Tickets {
  id: string;
  firstName?: string;
  lastName?: string;
}

// Definiraj tip za backend podatke
interface BackendData {
  tickets: Tickets[];
}

const apiUrl = process.env.REACT_APP_API_URL || "https://qr-app-backend-rp2l.onrender.com";

const Ticket: React.FC = () => {
  const [backendData, setBackendData] = useState<BackendData>({ tickets: [] });

  useEffect(() => {
    console.log("API URL koji se koristi:", apiUrl);
    fetch(`${apiUrl}/api/tickets`)
      .then((response) => response.json())
      .then((data: BackendData) => {
        console.log(data); // Provjeri što stiže iz backend-a
        setBackendData(data); // Ovdje pohranjuješ cijeli objekt { tickets: [...] }
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error); // Prikaz greške
      });
  }, []);

  return (
    <div>
      {backendData.tickets.length === 0 ? (
        <p>Loading here...</p>
      ) : (
        backendData.tickets.map((ticket, i) => (
          <p key={i}>{ticket.id}</p>
        ))
      )}
    </div>
  );
}

export default Ticket;
