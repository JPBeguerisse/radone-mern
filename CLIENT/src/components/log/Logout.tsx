import { LogOut } from "lucide-react";

// Composant pour gérer la déconnexion de l'utilisateur
export const Logout = () => {
  // Supprime le token et redirige vers la page de connexion
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
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
