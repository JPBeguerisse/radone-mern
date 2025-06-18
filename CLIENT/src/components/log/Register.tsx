import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "src/services/userService";
import { Eye, EyeClosed, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";

// Schéma de validation des champs avec Zod
export const userRegisterSchema = z
  .object({
    name: z.string().min(2, "Le nom est requis"),
    userName: z.string().min(2, "Le nom d'utilisateur est requis"),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .refine(
        (val) =>
          !val || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(val),
        {
          message:
            "Le mot de passe doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
        }
      ),
    passwordRepeat: z.string(),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Les mot de passe ne correspondent pas",
    path: ["passwordRepeat"],
  });

export const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  type userRegisterForm = z.infer<typeof userRegisterSchema>;

  // Hook React Hook Form avec validation Zod
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<userRegisterForm>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      name: "",
      userName: "",
      email: "",
    },
  });

  // Soumission du formulaire d'inscription
  const onSubmit = async (data: userRegisterForm) => {
    setIsLoading(true);
    try {
      const res = await createUser(data);
      navigate("/login", { state: { confirmationMessage: res.message } });
    } catch (error: any) {
      const serverErrors = error.response?.data?.errors;
      // Affichage des erreurs serveur champ par champ
      if (serverErrors && typeof serverErrors === "object") {
        Object.entries(serverErrors).forEach(([field, message]) => {
          setError(field as keyof userRegisterForm, {
            type: "server",
            message: message as string,
          });
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Inscription
        </h2>

        {/* Champ Nom */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-600"
          >
            Nom complet
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Champ Nom de profil */}
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-medium text-gray-600"
          >
            Nom de profil
          </label>
          <input
            {...register("userName")}
            type="text"
            id="userName"
            className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
          />
          {errors.userName && (
            <p className="text-red-500 text-sm">{errors.userName.message}</p>
          )}
        </div>

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
            className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
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
            className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
          />
          <button
            type="button"
            className="absolute right-2 top-10 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeClosed width={15} height={15} />
            ) : (
              <Eye width={15} height={15} />
            )}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Champ Confirmation Mot de passe */}
        <div className="relative">
          <label
            htmlFor="passwordRepeat"
            className="block text-sm font-medium text-gray-600"
          >
            Confirmation mot de passe
          </label>
          <input
            {...register("passwordRepeat")}
            type={showPasswordRepeat ? "text" : "password"}
            id="passwordRepeat"
            className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
          />
          <button
            type="button"
            className="absolute right-2 top-10 text-gray-500"
            onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
          >
            {showPasswordRepeat ? (
              <EyeClosed width={15} height={15} />
            ) : (
              <Eye width={15} height={15} />
            )}
          </button>
          {errors.passwordRepeat && (
            <p className="text-red-500 text-sm">
              {errors.passwordRepeat.message}
            </p>
          )}
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-2 text-white rounded-md transition ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-primary hover:bg-secondary"
          }`}
        >
          {isLoading ? (
            <span className="flex justify-center items-center gap-2">
              <Loader className="animate-spin" width={18} height={18} />
              Inscription...
            </span>
          ) : (
            "S'inscrire"
          )}
        </button>
      </form>

      {/* Lien vers la connexion */}
      <p className="mt-4 text-sm text-gray-600">
        Vous avez déjà un compte ?{" "}
        <a
          onClick={() => navigate("/login")}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          Se connecter
        </a>
      </p>
    </AuthLayout>
  );
};
