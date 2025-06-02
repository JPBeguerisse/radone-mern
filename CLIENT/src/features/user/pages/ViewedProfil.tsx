import React from "react";
import ViewedProfileInfo from "../components/ViewedProfileInfo";
import { ProfilUserContext } from "src/components/AppContext";
import { useParams } from "react-router-dom";

const ViewedProfil: React.FC = () => {
  const { id: userName } = useParams();
  return (
    <div className="">
      <ProfilUserContext.Provider value={userName!}>
        <ViewedProfileInfo />
      </ProfilUserContext.Provider>
    </div>
  );
};

export default ViewedProfil;
