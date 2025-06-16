import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "src/services/userService";
import { z } from "zod";
import { UserContext } from "../AppContext";
import { api } from "src/api/api";
import { Eye, EyeClosed } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { toast } from "react-toastify";

// Schéma de validation Zod pour le formulaire de connexion
export const userLoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le password est requis"),
});

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userContext = useContext(UserContext);

  const [confirmationMessage, setConfirmationMessage] = useState<
    string | null
  >();
  const [showPassword, setShowPassword] = useState(false);

  type userLoginForm = z.infer<typeof userLoginSchema>;

  // Affiche un message de confirmation s’il existe dans le state de l’URL
  useEffect(() => {
    if (location.state?.confirmationMessage) {
      setConfirmationMessage(location.state.confirmationMessage);
      navigate(location.pathname, { replace: true }); // nettoie le state
    }
  }, [location, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<userLoginForm>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: { email: "" },
  });

  // Soumission du formulaire principal
  const onSubmit = async (data: userLoginForm) => {
    try {
      const res = await loginUser(data);
      const accessToken = res.token;

      // Récupération du profil utilisateur
      const profile = await api.get(
        `${process.env.REACT_APP_API_URL}/profile`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Stockage du token et du profil
      localStorage.setItem("accessToken", accessToken);
      userContext?.setUid(profile.data);

      navigate("/");
    } catch (error: any) {
      const serverErrors = error.response;
      if (serverErrors) {
        setError("password", {
          type: "server",
          message: serverErrors.data.message,
        });
      }
    }
  };

  // Connexion en tant qu’invité
  const handleGuestLogin = async () => {
    try {
      const res = await api.post("/user/login-guest");
      const accessToken = res.data.token;

      const profile = await api.get(
        `${process.env.REACT_APP_API_URL}/profile`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      localStorage.setItem("accessToken", accessToken);
      userContext?.setUid(profile.data);

      navigate("/");
    } catch (err) {
      toast.error("Connexion en tant qu'invité échouée.");
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Connexion
        </h2>

        {/* Champ Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            name="email"
            className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email.message}</div>
          )}
        </div>

        {/* Champ Mot de passe */}
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600"
          >
            Mot de passe
          </label>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-gray-800"
          >
            {showPassword ? (
              <EyeClosed width={15} height={15} />
            ) : (
              <Eye width={15} height={15} />
            )}
          </button>
          {errors.password && (
            <div className="text-red-500 text-sm">
              {errors.password.message}
            </div>
          )}
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          className="w-full p-2 text-white bg-primary rounded-md hover:bg-secondary transition"
        >
          Se connecter
        </button>

        {/* Message de confirmation email */}
        {confirmationMessage && (
          <p className="text-green-500 text-sm text-center">
            {confirmationMessage}
          </p>
        )}
      </form>

      {/* Connexion visiteur */}
      <button
        onClick={handleGuestLogin}
        className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Continuer en tant que visiteur
      </button>

      {/* Redirection vers l'inscription */}
      <p className="mt-4 text-sm text-gray-600">
        Pas de compte ?{" "}
        <button
          onClick={() => navigate("/register")}
          className="text-blue-500 hover:underline"
        >
          S'inscrire
        </button>
      </p>
      <p className="mt-2 text-sm text-gray-600">
        Mot de passe oublié ?{" "}
        <button
          onClick={() => navigate("/forgot-password")}
          className="text-blue-500 hover:underline"
        >
          Réinitialiser
        </button>
      </p>
    </AuthLayout>
  );
};
