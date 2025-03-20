import React, { useState } from "react";
import NavBar from "./SideBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false); // Contrôle l'ouverture de la sidebar

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <NavBar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Contenu principal */}
      <div
        className={`main-content flex-grow h-full min-h-screen bg-gray-100 pt-24 ${
          isOpen ? "ml-64" : "ml-0"
        } md:ml-64 transition-all duration-300`}
      >
        {/* Outlet rend le composant de la page en fonction de la route */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
