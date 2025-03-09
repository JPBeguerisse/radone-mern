import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../redux/types/user.types";
import ViewProfil from "../components/profil/ViewProfil";

const Profil: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Gérer l'ouverture de la sidebar

  //  useEffect(() => {
  //    dispatch({ type: "GET_USERS_REQUESTED" });
  //  }, [dispatch]);

  //  const users = useSelector((state: any ) => state.usersReducer.users);
  //  console.log(users);
  return (
    <div
      className="
    bg-gray-100"
    >
      <ViewProfil />
    </div>
  );
};

export default Profil;
