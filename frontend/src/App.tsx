import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useParams,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import TicketDetails from "./components/TicketDetails";
import HomePage from "./pages/Home"; // Component for generating tickets

const App: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const domain = process.env.REACT_APP_AUTH0_DOMAIN || "";
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "";
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE || "";

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience, // Postavi audience API-ja
        scope: "openid profile email", // OpenID Connect postavke za prijavu korisnika
      }}
    >
      <Router>
        {/* Navbar included here */}
        <Navbar />

        {/* Define routes for different pages */}
        <div
          className="flex items-center justify-center"
          style={{ height: "50vh" }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/tickets/:id" element={<ProtectedTicketDetails />} />
          </Routes>
        </div>
      </Router>
    </Auth0Provider>
  );
};

const ProtectedTicketDetails: React.FC = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { id } = useParams();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login, preserving the intended URL for after login
      loginWithRedirect({
        appState: { targetUrl: `/tickets/${id}` },
      });
    }
  }, [isAuthenticated, loginWithRedirect, id]);

  // Render TicketDetails only if authenticated
  return isAuthenticated ? <TicketDetails /> : null;
};

export default App;
