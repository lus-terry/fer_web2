import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Profile from './components/Profile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home'; // Component for generating tickets
import { Auth0Provider } from '@auth0/auth0-react';
import TicketDetails from './components/TicketDetails';


const App: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const domain = process.env.REACT_APP_AUTH0_DOMAIN || '';
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || '';
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE || '';

  return (
    <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
    redirect_uri: window.location.origin,
    audience: audience,  // Postavi audience API-ja
    scope: 'openid profile email',  // OpenID Connect postavke za prijavu korisnika
  }}
  >

    <Router>
      <div>
        {/* If the user is not authenticated, show login button */}
        {!isAuthenticated ? (
          <div>
            <h2>Welcome! Please log in.</h2>
            <button onClick={() => loginWithRedirect()}>Log in</button>
          </div>
        ) : (
          <div>
            <h2>You are successfully logged in!</h2>
            <Profile /> {/* Display user's profile */}
            <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log out</button>
          </div>
        )}

        {/* Define routes for different pages */}
        <Routes>
          {/* Publicly accessible home page */}
          <Route path="/home" element={<HomePage />} />


          {/* Ruta za prikaz detalja ulaznice po UUID-u */}
          {/*{isAuthenticated && (*/}
          <Route path="/tickets/:id" element={<TicketDetails />} />

          
          
        </Routes>
      </div>
    </Router>
    </Auth0Provider>
  );
};

export default App;
