import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TicketDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth0();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTicket = async () => {
      console.log("Fetching ticket details for ID:", id);

      try {
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
        setError("Error while fetching ticket details.");
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
    <div className="flex flex-col items-center justify-center h-full w-full text-center">
      {isAuthenticated && user && (
        <h1 className="text-3xl font-bold m-3">Welcome {user?.name}!</h1>
      )}

      <h2 className="text-4xl font-bold mb-6">Ticket Details:</h2>

      {ticket ? (
        <div className="flex space-x-10 text-left">
          <div className="flex flex-col space-y-2 text-left">
            <p className="font-semibold text-lg">OIB:</p>
            <p className="font-semibold text-lg">First Name:</p>
            <p className="font-semibold text-lg">Last Name:</p>
            <p className="font-semibold text-lg">Created At:</p>
          </div>

          <div className="flex flex-col space-y-2 text-left">
            <p className="text-lg">{ticket.vatin}</p>
            <p className="text-lg">{ticket.firstName}</p>
            <p className="text-lg">{ticket.lastName}</p>
            <p className="text-lg">{ticket.createdAt}</p>
          </div>
        </div>
      ) : (
        <h2 className="text-4xl font-bold">No ticket found.</h2>
      )}
    </div>
  );
};

export default TicketDetails;
