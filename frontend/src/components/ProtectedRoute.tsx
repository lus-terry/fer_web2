import React, { ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation();

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: location.pathname } // Sačuvaj trenutni URL
    });
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
