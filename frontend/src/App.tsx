import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import Navbar from "./components/Navbar";
import TicketDetails from "./components/TicketDetails"; // Import TicketDetails component
import HomePage from "./pages/Home";

interface AppState {
  returnTo?: string;
}

const onRedirectCallback = (appState?: AppState, user?: any) => {
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

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
      onRedirectCallback={onRedirectCallback} // Dodajemo onRedirectCallback
    >
      <Router>
        <Navbar />

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

  if (!isAuthenticated) {
    loginWithRedirect({ appState: { returnTo: window.location.pathname } });
    return null;
  }

  return <TicketDetails />;
};

export default App;
