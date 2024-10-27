import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import Navbar from "./components/Navbar";
import TicketDetails from "./components/TicketDetails";
import HomePage from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN || "";
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "";
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE || "";

  const onRedirectCallback = (appState: any) => {
    console.log("onRedirectCallback triggered");
    console.log("appState:", appState);
    console.log("returning to:", appState?.returnTo || window.location.pathname);

    window.history.replaceState(
      {},
      document.title,
      appState?.returnTo || window.location.pathname
    );
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: "openid profile email",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <Router>
        <Navbar />
        <div className="flex items-center justify-center" style={{ height: "50vh" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/tickets/:id"
              element={
                <ProtectedRoute>
                  <TicketDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </Auth0Provider>
  );
};

export default App;
