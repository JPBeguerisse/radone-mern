import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/api";

const ConfirmEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const confirm = async () => {
      try {
        await api.get(`/user/confirm-email/${token}`);
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000); // redirige après 3 sec
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
