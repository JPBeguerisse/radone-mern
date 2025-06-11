import React, { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

// Layout utilisé pour les pages d'authentification (login, register)
export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex h-screen">
      {/* Partie gauche : image (affichée uniquement sur les écrans moyens et plus) */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50">
        <img
          src="/logImage.png"
          alt="Illustration"
          className="w-[600px] max-w-full"
        />
      </div>

      {/* Partie droite : zone du formulaire d'authentification */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 bg-white shadow-lg">
        {children}
      </div>
    </div>
  );
};
