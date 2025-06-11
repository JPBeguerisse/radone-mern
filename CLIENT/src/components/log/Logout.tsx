import { LogOut, Settings } from "lucide-react";
import React from "react";

export const Logout = () => {
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Si vous stockez le token dans le localStorage
    window.location.href = "/login"; //
  };
  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
    >
      <LogOut className="w-6 h-6" />
      Se déconnecter
    </button>
  );
};
