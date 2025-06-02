import React from "react";

export const Logout = () => {
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Si vous stockez le token dans le localStorage
    window.location.href = "/login"; //
  };
  return (
    <li onClick={handleLogout} className="nav-link nav-footer">
      Se déconnecter
    </li>
  );
};
