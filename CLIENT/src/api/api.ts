import axios from "axios";

// Créez une instance Axios avec une configuration par défaut
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requêtes : ajoute le token d'authentification si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🧼 Nettoyage et affichage clair des erreurs

    console.error("Erreur API :", error.response?.data || error.message);

    // redirection automatique en cas de token expiré ou invalide
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken"); // Supprime le token expiré
      window.location.href = "/login"; // Redirige vers la page de connexion
    }

    return Promise.reject(error);
  }
);
