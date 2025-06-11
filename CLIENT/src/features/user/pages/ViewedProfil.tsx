// Description : Page de profil d'un autre utilisateur (profil consulté)
import React from "react";
import { useParams } from "react-router-dom";
import ViewedProfileInfo from "../components/ViewedProfileInfo";
import { ProfilUserContext } from "src/components/AppContext";

const ViewedProfil: React.FC = () => {
  const { id: userName } = useParams(); // Récupère le nom d'utilisateur depuis l'URL

  return (
    <div>
      {/* Fournit le nom d'utilisateur au contexte pour les composants enfants */}
      <ProfilUserContext.Provider value={userName!}>
        <ViewedProfileInfo />
      </ProfilUserContext.Provider>
    </div>
  );
};

export default ViewedProfil;
