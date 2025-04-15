import React, { useContext, useEffect, useState } from "react";
import ViewProfil from "../components/profil/ViewProfil";
import { ProfilUserContext, UserContext } from "src/components/AppContext";
import { useParams } from "react-router-dom";

const Profil: React.FC = () => {
  //const currentUserUid = userContext?.uid;
  //const { id: userId } = useParams();
  const { id: userName } = useParams();
  // console.log("userName profil", userName);
  return (
    <div className="">
      <ProfilUserContext.Provider value={userName!}>
        <ViewProfil />
      </ProfilUserContext.Provider>
    </div>
  );
};

export default Profil;
