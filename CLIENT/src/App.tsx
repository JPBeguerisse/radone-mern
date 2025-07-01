import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import { UserContext } from "./components/AppContext";
import { getUserRequested } from "./redux/reducers/user.reducer";
import { ToastContainer } from "react-toastify";
import Routes from "./components/Routes/Index";

function App() {
  // Utilisation du hook `useState` pour gérer l'état de l'UID, initialisé à `null`
  const [uid, setUid] = useState(null);

  // Utilisation du hook `useDispatch` pour dispatcher des actions dans le store Redux
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  //si la page se rechage on récupère le token s'il est toujours disponible
  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Récupérer le token du localStorage
        const token = localStorage.getItem("accessToken");
        if (token) {
          // Requête pour récupérer le profil de l'utilisateur
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
              },
            }
          );
          // Mise à jour de l'état avec l'UID
          //console.log("res", response);
          setUid(response.data);
          console.log("UID récupéré :", response.data);
        }
      } catch (error) {
        console.log("Erreur de récupération du token ou du profil", error);
        localStorage.removeItem("accessToken"); // Supprimer le token en cas d'erreur (expiration, etc.)
      } finally {
        setIsLoading(false); // Mettre à jour l'état de chargement une fois la récupération terminée
      }
    };

    fetchToken();
  }, []); // L'effet est exécuté uniquement au premier rendu

  useEffect(() => {
    // Ne dispatcher l'action que lorsque l'UID est défini
    if (uid) {
      dispatch(getUserRequested(uid)); // Dispatch pour récupérer les données utilisateur
    }
  }, [uid, dispatch]); // Ce `useEffect` est appelé seulement lorsque `uid` est mis à jour
  // Rendu du composant
  return (
    // Fournir l'UID au contexte UserContext pour le rendre accessible aux autres composants
    <UserContext.Provider value={{ uid, setUid, isLoading }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        aria-label={undefined}
      />
      {/* Rend les routes de l'application */}
      <Routes />
    </UserContext.Provider>
  );
}

export default App;
