import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const TestAuthorized = () => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchAuthorizedData = async () => {
      try {
        // Dohvati token iz Auth0
        const token = await getAccessTokenSilently();

        // Pošalji zahtjev na backend s tokenom
        const response = await fetch('http://localhost:5000/authorized', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,  // Dodaj token
          },
        });

        // Dohvati odgovor i ispiši ga
        const data = await response.text();
        console.log('Odgovor s autorizirane rute:', data);
      } catch (error) {
        console.error('Greška prilikom dohvaćanja autoriziranih podataka:', error);
      }
    };

    fetchAuthorizedData(); // Pozovi funkciju unutar useEffect-a
  }, [getAccessTokenSilently]); // Token dohvaćamo samo kada je useEffect pokrenut

  return (
    <div>
      <h2>Test Authorized Route</h2>
    </div>
  );
};

export default TestAuthorized;
