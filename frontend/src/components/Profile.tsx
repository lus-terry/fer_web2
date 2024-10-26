import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <div>
      <img
        src={user?.picture}
        alt={user?.name}
        className="h-12 w-auto object-contain"
      />
    </div>
  ) : null;
};

export default Profile;
