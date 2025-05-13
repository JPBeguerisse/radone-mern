import React, { useState } from "react";
import { Login } from "./Login";
import { Register } from "./Register";

export const Form = () => {
  const [signUpModal, setSignUpModal] = useState<boolean>(false);
  const [signInModal, setSignInModal] = useState<boolean>(true);

  const handleModals = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLElement;

    if (target.id === "register") {
      setSignUpModal(true);
      setSignInModal(false);
    } else if (target.id === "login") {
      setSignUpModal(false);
      setSignInModal(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <ul className="flex justify-around mb-8 text-center">
          <li
            onClick={handleModals}
            id="register"
            className={`cursor-pointer text-base md:text-lg lg:text-xl p-2 w-full md:w-1/2 ${
              signUpModal
                ? "bg-primary text-white font-semibold"
                : "text-gray-700"
            } rounded-l-lg hover:bg-secondary hover:text-white`}
          >
            S'inscrire
          </li>

          <li
            onClick={handleModals}
            id="login"
            className={`cursor-pointer text-base md:text-lg lg:text-xl p-2 w-full md:w-1/2 ${
              signInModal
                ? "bg-primary text-white font-semibold"
                : "text-gray-700"
            } rounded-r-lg hover:bg-secondary hover:text-white`}
          >
            Se connecter
          </li>
        </ul>
        {signUpModal && <Register />}
        {signInModal && <Login />}
      </div>
    </div>
  );
};
