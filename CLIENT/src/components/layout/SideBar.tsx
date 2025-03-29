import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../AppContext";
import Logout from "../log/Logout";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavBar: React.FC<SideBarProps> = ({ isOpen, setIsOpen }) => {
  const user = useContext(UserContext);

  const toggleSidebar = () => setIsOpen(!isOpen);

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
        className={`fixed top-0 left-0 h-full bg-white text-black w-64 p-4 transform ${
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

            {user?.uid ? (
              <>
                <NavLink
                  to="/ajouter"
                  className="hover:text-gray-300"
                  onClick={toggleSidebar}
                >
                  Créer +
                </NavLink>
                <NavLink
                  to="/profil"
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
            {user?.uid && (
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

      {/* Overlay pour fermer la sidebar en cliquant en dehors (mobile uniquement) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default NavBar;
