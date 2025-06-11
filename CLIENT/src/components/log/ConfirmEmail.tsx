import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/api";

// Composant de confirmation d'adresse email
const ConfirmEmail = () => {
  const { token } = useParams(); // Récupère le token de l'URL
  const navigate = useNavigate();

  // État du statut de confirmation : en attente, réussi ou erreur
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );

  useEffect(() => {
    const confirm = async () => {
      try {
        // Appel à l'API pour confirmer l'adresse e-mail
        await api.get(`/user/confirm-email/${token}`);
        setStatus("success");

        // Redirection vers la page de login après 3 secondes
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setStatus("error");
      }
    };

    if (token) confirm();
  }, [token, navigate]);

  return (
    <div className="p-10 text-center">
      {status === "pending" && <p>Confirmation en cours...</p>}
      {status === "success" && (
        <p className="text-green-600 font-bold">
          Votre compte a été activé. Vous allez être redirigé vers la connexion.
        </p>
      )}
      {status === "error" && (
        <p className="text-red-600 font-bold">
          Le lien est invalide ou expiré.
        </p>
      )}
    </div>
  );
};

export default ConfirmEmail;
