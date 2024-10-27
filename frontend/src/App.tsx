import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import TicketDetails from "./components/TicketDetails"; // Import TicketDetails component

const App: React.FC = () => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN || "";
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "";
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE || "";

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: "openid profile email",
      }}
    >
      <Router>
        <Navbar />

        <div className="flex items-center justify-center" style={{ height: "50vh" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tickets/:id" element={<ProtectedTicketDetails />} />
          </Routes>
        </div>
      </Router>
    </Auth0Provider>
  );
};

// ProtectedRoute component to handle authentication for protected routes
const ProtectedTicketDetails: React.FC = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    loginWithRedirect();
    return null; // Prevents rendering the component until authentication is resolved
  }

  return <TicketDetails />; // Render TicketDetails if authenticated
};

export default App;
