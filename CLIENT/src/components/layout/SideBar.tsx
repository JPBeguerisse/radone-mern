import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../AppContext";
import { Logout } from "../log/Logout";
import { Loader, Plus, Search } from "lucide-react";
import { searchUsers } from "src/services/userService";
import { User } from "src/types/user.types";
import SearchSidebar from "../home/SearchSidebar";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, setIsOpen }) => {
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;

  const toggleSidebar = () => setIsOpen(!isOpen);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // const [searchTerm, setSearchTerm] = useState("");
  // const [searchResults, setSearchResults] = useState<User[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  // const navigate = useNavigate();

  // const handleSearch = async () => {
  //   if (!searchTerm.trim()) return;

  //   try {
  //     setLoading(true);
  //     const users = await searchUsers(searchTerm.trim());
  //     setSearchResults(users);
  //     setError("");
  //   } catch (err: any) {
  //     setError("Erreur lors de la recherche.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     // Vérifie si l'utilisateur a arrêté de taper
  //     if (searchTerm.trim()) {
  //       handleSearch();
  //     } else {
  //       setSearchResults([]);
  //     }
  //   }, 500); // Attends 500ms après que l’utilisateur ait arrêté de taper

  //   return () => clearTimeout(delay);
  // }, [searchTerm]);

  return (
    <div className="relative">
      {/* Bouton pour ouvrir la sidebar en mode mobile */}
      <button
        onClick={toggleSidebar}
        className="p-3 text-white bg-primary md:hidden fixed top-4 left-4 z-60"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full bg-white text-black w-64 p-4 transform border-r-2 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 z-50`}
      >
        <div className="sidebar flex flex-col h-full justify-between">
          <div className="logo mb-8">
            <img src="/logo192.png" alt="logo" className="w-16 h-16 mx-auto" />
          </div>

          <div className="nav-link flex flex-col gap-4">
            <NavLink
              to="/"
              className="hover:text-gray-300"
              onClick={toggleSidebar}
            >
              Accueil
            </NavLink>

            {currentUserUid ? (
              <>
                <NavLink
                  to="/ajouter"
                  onClick={toggleSidebar}
                  className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Créer
                </NavLink>
                <div
                  className="hover:text-gray-300 flex items-center gap-2"
                  onClick={() => {
                    toggleSidebar(); // ferme la sidebar principale
                    setIsSearchOpen(true); // ouvre la recherche
                  }}
                >
                  <Search width={15} height={15} />
                  Rechercher
                </div>
                <NavLink
                  to={"/my-profil"}
                  className="hover:text-gray-300"
                  onClick={toggleSidebar}
                >
                  Profil
                </NavLink>
              </>
            ) : (
              <NavLink
                to="/login"
                className="hover:text-gray-300"
                onClick={toggleSidebar}
              >
                Se connecter
              </NavLink>
            )}
          </div>

          <div className="nav-footer mt-auto">
            {currentUserUid && (
              <>
                <NavLink
                  to="/profil"
                  className="hover:text-gray-300"
                  onClick={toggleSidebar}
                >
                  Paramètre
                </NavLink>
                <Logout />
              </>
            )}
          </div>
        </div>
      </nav>
      <SearchSidebar
        isSidebarOpen={isOpen}
        onSidebarOpen={setIsOpen}
        isSearchOpen={isSearchOpen}
        onSearchOpen={setIsSearchOpen}
      />
    </div>
  );
};

export default SideBar;
