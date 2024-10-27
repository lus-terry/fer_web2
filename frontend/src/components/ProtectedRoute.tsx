import React, { ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const location = useLocation();

  console.log("ProtectedRoute loaded");
  console.log("isAuthenticated:", isAuthenticated);
  console.log("current location:", location.pathname);

  if (isLoading) {
    console.log("Auth0 is loading...");
    return <div>Loading...</div>; // Prikaži loading indikator dok Auth0 proverava autentifikaciju
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    loginWithRedirect({
      appState: { returnTo: location.pathname }
    });
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
