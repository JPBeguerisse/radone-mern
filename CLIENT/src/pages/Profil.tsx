import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../types/user.types";
import ViewProfil from "../components/profil/ViewProfil";
import UserContext from "src/components/AppContext";

const Profil: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Gérer l'ouverture de la sidebar
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;

  return (
    <div className="">
      <ViewProfil userId={currentUserUid!} />
    </div>
  );
};

export default Profil;
