import { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../AppContext";
import { Logout } from "../log/Logout";
import { Home, Plus, Search, Settings } from "lucide-react";
import SearchSidebar from "../home/SearchSidebar";
import { useSelector } from "react-redux";

interface SideBarProps {
  isOpen: boolean; // Indique si la sidebar est ouverte
  setIsOpen: (isOpen: boolean) => void; // Fonction pour basculer l'état d'ouverture de la sidebar
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, setIsOpen }) => {
  const currentUserUid = useContext(UserContext)?.uid;
  const user = useSelector((state: any) => state.userReducer.user);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Bascule l'état d'ouverture de la sidebar
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* Sidebar principale */}
      <nav
        className={`fixed top-0 left-0 h-full bg-white text-black w-64 p-4 transform border-r-2 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 z-50`}
      >
        <div className="sidebar flex flex-col h-full justify-between">
          {/* Logo */}
          <div className="logo ">
            <img
              src="/socialapp2.png"
              alt="logo"
              className="w-24 h-24 mx-auto"
            />
          </div>

          {/* Liens de navigation */}
          <div className="nav-link flex flex-col gap-4">
            <NavLink
              to="/"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();

                  navigate("/temps", { replace: true });
                  console.log(location.pathname);
                  setTimeout(() => {
                    navigate("/");
                  }, 10);
                } else {
                  toggleSidebar();
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 transition ${
                  isActive ? "text-black font-semibold" : "text-gray-600"
                }`
              }
            >
              <Home className="w-6 h-6" />
              <span className="hidden sm:inline text-base">Accueil</span>
            </NavLink>

            <NavLink
              to="/ajouter"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 transition ${
                  isActive ? "text-black font-semibold" : "text-gray-600"
                }`
              }
            >
              <Plus className="w-6 h-6" />
              <span className="hidden sm:inline text-base">Créer</span>
            </NavLink>

            {/* Ouvre la barre de recherche */}
            <div
              onClick={() => {
                toggleSidebar();
                setIsSearchOpen(true);
              }}
              className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer transition"
            >
              <Search className="w-6 h-6" />
              <span className="hidden sm:inline text-base">Rechercher</span>
            </div>

            {/* Lien vers le profil utilisateur */}
            <NavLink
              to="/my-profil"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 transition ${
                  isActive ? "text-black font-semibold" : "text-gray-600"
                }`
              }
            >
              <img
                src={user?.picture || "/default-avatar.png"}
                className="w-6 h-6 rounded-full object-cover"
                alt="avatar"
              />
              <span className="hidden sm:inline text-base">Profil</span>
            </NavLink>
          </div>

          {/* Liens du bas de la sidebar (paramètres et déconnexion) */}
          <div className="nav-footer mt-auto">
            {currentUserUid && (
              <>
                <NavLink
                  to="/edit-profil"
                  onClick={toggleSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 transition ${
                      isActive ? "text-black font-semibold" : "text-gray-600"
                    }`
                  }
                >
                  <Settings className="w-6 h-6" />
                  <span className="hidden sm:inline text-base">Paramètre</span>
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={toggleSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 transition ${
                      isActive ? "text-black font-semibold" : "text-gray-600"
                    }`
                  }
                >
                  <Logout />
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Barre latérale de recherche */}
      <SearchSidebar
        isSidebarOpen={isOpen}
        onSidebarOpen={setIsOpen}
        isSearchOpen={isSearchOpen}
        onSearchOpen={setIsSearchOpen}
      />

      {/* Barre de navigation mobile en bas de l'écran */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 md:hidden z-50">
        <NavLink
          to="/"
          onClick={(e) => {
            setIsSearchOpen(false);
            if (location.pathname === "/") {
              e.preventDefault();

              navigate("/temps", { replace: true });
              console.log(location.pathname);
              setTimeout(() => {
                navigate("/");
              }, 10);
            }
          }}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-black" : "text-gray-500"
            }`
          }
          // onClick={() => setIsSearchOpen(false)}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px]">Accueil</span>
        </NavLink>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center text-gray-500 text-xs"
        >
          <Search className="w-6 h-6" />
          <span className="text-[10px]">Recherche</span>
        </button>

        <NavLink
          to="/ajouter"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-black" : "text-gray-500"
            }`
          }
          onClick={() => setIsSearchOpen(false)}
        >
          <Plus className="w-6 h-6" />
          <span className="text-[10px]">Créer</span>
        </NavLink>

        <NavLink
          to="/my-profil"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-black" : "text-gray-500"
            }`
          }
          onClick={() => setIsSearchOpen(false)}
        >
          <img
            src={user?.picture || "/default-avatar.png"}
            className="w-6 h-6 rounded-full object-cover"
            alt="avatar"
          />
          <span className="text-[10px]">Profil</span>
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
