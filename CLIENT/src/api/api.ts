import axios from "axios";

// Créez une instance Axios avec une configuration par défaut
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API :", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
