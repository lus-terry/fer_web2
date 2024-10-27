import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import TicketDetails from "./components/TicketDetails";
import HomePage from "./pages/Home";

const App: React.FC = () => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN || "";
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "";
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE || "";
  const navigate = useNavigate();

  const onRedirectCallback = (appState: any) => {
    const returnTo = appState?.returnTo || window.location.pathname;
    navigate(returnTo, { replace: true });
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
      cacheLocation="localstorage"
    >
      <Navbar />
      <div
        className="flex items-center justify-center"
        style={{ height: "50vh" }}
      >
        <Routes>
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Auth0Provider>
  );
};

export default App;
