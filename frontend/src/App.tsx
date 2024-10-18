import React from 'react';
import Ticket from './components/Ticket';
import { useAuth0 } from '@auth0/auth0-react';
import Profile from './components/Profile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home'; // Component for generating tickets
import TicketForm from './components/TicketForm';

const App: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
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
          <Route path="/" element={<HomePage />} />

          {/* Route for generating a ticket, only accessible when authenticated */}
          {isAuthenticated && (
          <Route path="/generate-ticket" element={<TicketForm />} />
      
          )}

          {/* Route for displaying all tickets, only accessible when authenticated */}
          {isAuthenticated && (
            <Route path="/tickets" element={<Ticket />} />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
