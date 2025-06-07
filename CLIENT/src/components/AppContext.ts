import React, { Dispatch, SetStateAction } from "react";

type UserContextType = {
  uid?: null;
  setUid: Dispatch<SetStateAction<any>>;
  isLoading: boolean; // chargement lorsque l'utilisateur est en cours de récupération
};

export const UserContext = React.createContext<UserContextType | null>(null);
export const ProfilUserContext = React.createContext<string | null>(null);
