import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../types/user.types";
import ViewProfil from "../components/profil/ViewProfil";

const Profil: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Gérer l'ouverture de la sidebar

  return (
    <div className="">
      <ViewProfil />
    </div>
  );
};

export default Profil;
