import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

// Layout utilisé pour les pages d'authentification (login, register)
export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex sm:h-screen overflow-hidden">
      {/* Partie gauche : image (desktop uniquement) */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50">
        <img
          src="/logImage.png"
          alt="Illustration"
          className="w-[600px] max-w-full"
        />
      </div>

      {/* Partie droite */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 bg-white shadow-lg overflow-x-hidden">
        <img src="/socialapp2.png" alt="Logo" className="w-52 max-w-full" />
        {children}
      </div>
    </div>
  );
};
