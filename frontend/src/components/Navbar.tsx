import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Link } from "react-router-dom";
import Profile from "./Profile";

const Navbar: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const logoUrl = process.env.LOGO_URL;

  return (
    <nav className="bg-gray-200 px-5 py-2 flex justify-between items-center">
      <div className="flex-shrink-0">
        <Link to="/" className="text-white text-xl font-bold">
          <img
            src={logoUrl}
            alt="logo"
            className="h-14 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {!isAuthenticated ? (
          <button
            onClick={() => loginWithRedirect()}
            className="text-white px-4 py-2 rounded"
            style={{ backgroundColor: "#006f74" }}
          >
            Log in
          </button>
        ) : (
          <>
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              className="text-white px-4 py-2 rounded"
              style={{ backgroundColor: "#006f74" }}
            >
              Log out
            </button>

            <div className=" text-white p-1 rounded ">
              <Profile />
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
