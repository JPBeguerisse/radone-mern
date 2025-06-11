import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { UserContext } from "../AppContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const userContext = useContext(UserContext);

  if (!userContext) return null;

  // En cours de chargement (token en cours de vérification)
  if (userContext.isLoading) {
    return <Loader />;
  }

  // Pas connecté
  if (!userContext.uid) {
    return <Navigate to="/login" replace />;
  }

  // Connecté
  return children;
};
