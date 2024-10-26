import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TicketDetails = () => {
  const { id } = useParams(); // Dohvaća UUID iz URL-a
  const [ticket, setTicket] = useState<any>(null); // Podaci o ulaznici
  const [loading, setLoading] = useState<boolean>(true); // Status učitavanja
  const [error, setError] = useState<string | null>(null); // Poruka o grešci
  const apiUrl = process.env.REACT_APP_API_URL 

  useEffect(() => {
    const fetchTicket = async () => {
      console.log("Fetching ticket details for ID:", id);

      try {
        // API poziv za dohvaćanje detalja ulaznice prema UUID-u
        console.log(`${apiUrl}/api/tickets/${id}`);
        const response = await fetch(`${apiUrl}/api/tickets/${id}`);

        console.log(response);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch ticket details: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setTicket(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError("Error while fetching ticket details. Please try again.");
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Ticket Details</h2>
      {ticket ? (
        <div>
          <p>
            <strong>OIB:</strong> {ticket.vatin}
          </p>
          <p>
            <strong>First Name:</strong> {ticket.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {ticket.lastName}
          </p>
          <p>
            <strong>Created At:</strong> {ticket.createdAt}
          </p>
        </div>
      ) : (
        <p>No ticket found.</p>
      )}
    </div>
  );
};

export default TicketDetails;
