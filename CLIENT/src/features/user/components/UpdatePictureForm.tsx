import React, { useState } from "react";
import { useSelector } from "react-redux";
import { User } from "src/types/user.types";

const UpdatePictureForm = () => {
  const currentUser: User = useSelector((state: any) => state.userReducer.user);
  //console.log(currentUser);
  const [file, setFile] = useState(); // Stocke l'image sélectionnée

  return (
    <form action="">
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 mt-6 w-full bg-white rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="user-picture flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-300 w-20 h-20">
              <img
                src={`${process.env.REACT_APP_API_URL}${
                  currentUser && currentUser.picture?.replace(/^\//, "")
                }`}
                alt="user"
                className="w-full h-full rounded-full object-cover object-center"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-lg">
                {currentUser && currentUser.userName}
              </h3>
              <h5 className="text-gray-600">
                {currentUser && currentUser.name}
              </h5>
            </div>
          </div>
          {file && <input type="submit" value="Envoyer" />}
          {/* Bouton pour soumettre le formulaire */}
          <div className="w-full sm:w-auto flex items-center">
            <button className="w-full sm:w-auto bg-primary text-white font-bold hover:bg-secondary px-4 py-2 rounded-lg transition">
              Modifier la photo
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UpdatePictureForm;
