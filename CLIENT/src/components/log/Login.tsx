import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginUser } from "src/services/userService";
import { z } from "zod";
import { UserContext } from "../AppContext";
import { api } from "src/api/api";
import { Eye, EyeClosed } from "lucide-react";

export const userLoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le password est requis"),
});

const Login = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  type userLoginForm = z.infer<typeof userLoginSchema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<userLoginForm>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: userLoginForm) => {
    try {
      const res = await loginUser(data);

      // Récupération du token d'authentification dans la réponse du serveur
      const accessToken = res.token;
      //console.log(accessToken);

      const profile = await api.get(
        `${process.env.REACT_APP_API_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      userContext?.setUid(profile.data);
      //console.log("Profile", profile);

      // Stockage du token dans le localStorage du navigateur
      localStorage.setItem("accessToken", accessToken);

      navigate("/");
      //window.location.href = "/";
    } catch (error: any) {
      const serverErrors = error.response;
      if (serverErrors) {
        setError("password", {
          type: "server", // Utilisation de type 'manual' car l'erreur vient du serveur
          message: serverErrors.data.message,
        });
      }
    }
  };
  // Rendu du formulaire de connexion
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        Connexion
      </h2>
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
          <div className="text-red-500 text-sm">{errors.password.message}</div>
        )}
      </div>
      <button
        type="submit"
        className="w-full p-2 text-white bg-primary rounded-md hover:bg-secondary transition"
      >
        Se connecter
      </button>
    </form>
  );
};

export default Login;
