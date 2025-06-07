import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../AppContext";
import { Logout } from "../log/Logout";
import { Home, Loader, Plus, Search, Settings } from "lucide-react";
import { searchUsers } from "src/services/userService";
import { User } from "src/types/user.types";
import SearchSidebar from "../home/SearchSidebar";
import { useSelector } from "react-redux";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, setIsOpen }) => {
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;
  const user = useSelector((state: any) => state.userReducer.user);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="relative">
      {/* Bouton pour ouvrir la sidebar en mode mobile */}
      {/* <button
        onClick={toggleSidebar}
        className="p-3 text-white bg-primary md:hidden fixed top-4 left-4 z-60"
      >
        {isOpen ? "✕" : "☰"}
      </button> */}

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
              onClick={toggleSidebar}
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

          {/* {currentUserUid ? (
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
          </div> */}

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
                {/* <Logout /> */}
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
      {/* Bottom nav mobile style */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 md:hidden z-50">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-black" : "text-gray-500"
            }`
          }
          onClick={() => setIsSearchOpen(false)}
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
