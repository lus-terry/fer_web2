import React from 'react';
import Ticket from './components/Ticket'
import { useAuth0 } from '@auth0/auth0-react';
import Profile from './components/Profile';

const App: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div>
      {!isAuthenticated ? (
        <div>
          <h2>Dobrodošli! Molimo prijavite se.</h2>
          <button onClick={() => loginWithRedirect()}>Prijava</button>
        </div>
      ) : (
        <div>
           <h2>Uspješno ste prijavljeni!</h2>
           <Profile /> {/* Prikaz korisničkog profila */}
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Odjava</button>

            <Ticket/>
        </div>
      )}
    </div>
  );
};

export default App;
