import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
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

            {isAuthenticated && <Route path="/tickets/:id" />}
          </Routes>
        </div>
      </Router>
    </Auth0Provider>
  );
};

export default App;
