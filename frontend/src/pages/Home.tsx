import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";

const HomePage: React.FC = () => {
  const [ticketCount, setTicketCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth0();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTicketCount = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/tickets/count`);
        if (!response.ok) {
          throw new Error("Failed to fetch ticket count");
        }
        const data = await response.json();
        setTicketCount(data.ticketsCount);
      } catch (err) {
        setError("Error while fetching ticket count");
      }
    };
    fetchTicketCount();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center">
      {isAuthenticated ? (
        <h1 className="text-3xl font-bold">Welcome {user?.name}!</h1>
      ) : (
        <h1 className="text-3xl font-bold">Welcome!</h1>
      )}

      {error ? (
        <p>{error}</p>
      ) : ticketCount === null ? (
        <p>Loading...</p>
      ) : (
        <p className="text-2xl mt-4">Ticket count: {ticketCount}</p>
      )}
    </div>
  );
};

export default HomePage;
