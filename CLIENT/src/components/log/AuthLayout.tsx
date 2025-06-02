import React, { Children, ReactNode, useState } from "react";
import { Login } from "./Login";
import { Register } from "./Register";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  // const handleModals = (e: React.MouseEvent<HTMLLIElement>) => {
  //   const target = e.target as HTMLElement;

  //   if (target.id === "register") {
  //     setSignUpModal(true);
  //     setSignInModal(false);
  //   } else if (target.id === "login") {
  //     setSignUpModal(false);
  //     setSignInModal(true);
  //   }
  // };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <ul className="flex justify-around mb-8 text-center">
          <li
            onClick={handleRegister}
            className={`cursor-pointer text-base md:text-lg lg:text-xl p-2 w-full md:w-1/2 ${
              isRegister
                ? "bg-primary text-white font-semibold"
                : "text-gray-700"
            } rounded-l-lg hover:bg-secondary hover:text-white`}
          >
            S'inscrire
          </li>

          <li
            onClick={handleLogin}
            className={`cursor-pointer text-base md:text-lg lg:text-xl p-2 w-full md:w-1/2 ${
              isLogin ? "bg-primary text-white font-semibold" : "text-gray-700"
            } rounded-r-lg hover:bg-secondary hover:text-white`}
          >
            Se connecter
          </li>
        </ul>
        {children}
      </div>
    </div>
  );
};
