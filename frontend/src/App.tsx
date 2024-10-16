import React, { useEffect, useState } from 'react';

// Definiraj tip za jedan ticket
interface Ticket {
  id: string;
  firstName?: string;
  lastName?: string;
}

// Definiraj tip za backend podatke
interface BackendData {
  tickets: Ticket[];
}

const App: React.FC = () => {
  // Koristi tip za useState
  const [backendData, setBackendData] = useState<BackendData>({ tickets: [] });

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data: BackendData) => {
        console.log(data); // Provjeri što stiže iz backend-a
        setBackendData(data); // Ovdje pohranjuješ cijeli objekt { tickets: [...] }
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

export default App;
