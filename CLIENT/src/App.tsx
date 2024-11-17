import React, { useEffect, useState } from "react";
import "./App.css";
import Routes from "./components/Routes";
import { useDispatch } from "react-redux";
import axios from "axios";
import UserContext from "./components/AppContext";
import { getUserRequested } from "./redux/reducers/user.reducer";

function App() {
  // Utilisation du hook `useState` pour gérer l'état de l'UID, initialisé à `null`
  const [uid, setUid] = useState(null);

  // Utilisation du hook `useDispatch` pour dispatcher des actions dans le store Redux
  const dispatch = useDispatch();

  // Hook `useEffect` qui exécute un effet après chaque rendu et quand `dispatch` ou `uid` changent
  useEffect(() => {
    // Fonction asynchrone pour récupérer le token de localStorage et l'UID
    const fetchToken = async () => {
      try {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem("accessToken");
        if (token) {
          // Si le token existe, faire une requête au serveur pour récupérer le profil de l'utilisateur
          axios
            .get(`${process.env.REACT_APP_API_URL}profile`, {
              headers: {
                Authorization: `Bearer ${token}`, // Ajouter le token dans les en-têtes de la requête
              },
            })
            .then((res) => {
              // Si la requête réussit, mettre à jour l'état avec l'UID de l'utilisateur
              setUid(res.data);
            });
        }
      } catch (error) {
        // En cas d'erreur, afficher un message dans la console
        console.log("No token", error);
      }
    };

    // Appeler la fonction pour récupérer le token
    fetchToken();

    // Si un UID est disponible, dispatcher une action (getUserRequested) pour récupérer l'utilisateur
    if (uid) dispatch(getUserRequested(uid));
  }, [dispatch, uid]); // Le hook se déclenche lorsque `dispatch` ou `uid` changent

  // Rendu du composant
  return (
    // Fournir l'UID au contexte UserContext pour le rendre accessible aux autres composants
    <UserContext.Provider value={uid}>
      {/* Rend les routes de l'application */}
      <Routes />
    </UserContext.Provider>
  );
}

export default App;
