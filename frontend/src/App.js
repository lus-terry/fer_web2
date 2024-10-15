import React, { useEffect, useState } from 'react';

function App() {

  const [backendData, setBackendData] = useState({ tickets: [] });

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
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
