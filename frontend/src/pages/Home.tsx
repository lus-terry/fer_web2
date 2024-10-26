import React, { useEffect, useState } from 'react';

const HomePage: React.FC = () => {
    const [ticketCount, setTicketCount] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTicketCount = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/tickets/count")
                if(!response.ok) {
                    throw new Error ("Failed to fetch ticket count")
                }
                const data = await response.json();
                setTicketCount(data.ticketsCount)
            } catch (err) {
                setError("Error while fetching ticket count")
            }
        };
        fetchTicketCount();
    }, []);

    return (
        <div>
            <h1>Home page</h1>
            {error ? (
                <p>{error}</p>
            ) : ticketCount == null ? (
                <p>Loading...</p>
            ) : (
                <p> Ticket count: {ticketCount} </p>
            )}
        </div>
    )
};

export default HomePage;