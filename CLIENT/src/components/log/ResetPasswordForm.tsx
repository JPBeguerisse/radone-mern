import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "src/services/userService";
import { z } from "zod";
import { AuthLayout } from "./AuthLayout";
import { Eye, EyeClosed, Loader } from "lucide-react";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .refine(
        (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(val),
        {
          message:
            "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.",
        }
      ),
    passwordRepeat: z.string(),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Les mot de passe ne correspondent pas",
    path: ["passwordRepeat"],
  });

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const param = useParams();
  const token = param.token;

  type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      passwordRepeat: "",
    },
  });
  if (!token) {
    navigate("/login", { state: { errorMessage: "Token manquant" } });
    return null;
  }

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    try {
      // Appel à la fonction de service pour réinitialiser le mot de passe
      const response = await resetPassword(token, data.password);
      setTimeout(() => {
        navigate("/login", {
          state: {
            confirmationMessage:
              response.message || "Mot de passe réinitialisé avec succès",
          },
        });
      }, 3000);
    } catch (error: any) {
      setError("password", {
        type: "manual",
        message:
          error.response?.data?.message ||
          "Erreur lors de la réinitialisation du mot de passe",
      });
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6"
      >
        <h2 className="text-xl font-bold text-center text-gray-700 mb-6">
          Réinitialisation du mot de passe
        </h2>
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
              Réinitialisation...
            </span>
          ) : (
            "Réinitialiser le mot de passe"
          )}
        </button>
      </form>
      {responseMessage && (
        <p className="text-green-500 text-sm mt-2 text-center">
          {responseMessage}
        </p>
      )}
      <p className="mt-4 text-center text-sm text-gray-600">
        Vous avez un compte ?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-blue-500 hover:underline"
        >
          Connectez-vous
        </button>
      </p>
    </AuthLayout>
  );
};

export default ResetPasswordForm;
