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
    <div className="flex h-screen">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50">
        <img
          src="/logImage.png"
          alt="Illustration"
          className="w-[600px] max-w-full"
        />
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 bg-white shadow-lg">
        {children}
      </div>
    </div>
  );
};
