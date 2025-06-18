import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { forgotPassword } from "src/services/userService";
import { z } from "zod";
import { AuthLayout } from "./AuthLayout";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export const ForgotPasswordForm = () => {
  const nagivate = useNavigate();
  type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
  const [responseMessage, setMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Soumission du formulaire de mot de passe oublié
  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setMessage(null); // Réinitialiser le message de réponse
    try {
      // Appel à la fonction de service pour envoyer l'email de réinitialisation
      const response = await forgotPassword(data.email);
      setMessage(response.message);
    } catch (error: any) {
      setError("email", {
        type: "manual",
        message:
          error.response.data.message || "Erreur lors de l'envoi de l'email",
      });
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
        <h2 className="text-xl font-bold mb-4">Mot de passe oublié</h2>

        <input
          type="email"
          placeholder="Votre adresse e-mail"
          {...register("email")}
          required
          className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
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
              Chargement...
            </span>
          ) : (
            "Envoyer"
          )}
        </button>
        {responseMessage && (
          <p className="text-green-500 text-sm mt-2">{responseMessage}</p>
        )}
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Vous avez un compte ?{" "}
        <button
          onClick={() => nagivate("/login")}
          className="text-blue-500 hover:underline"
        >
          Connectez-vous
        </button>
      </p>
    </AuthLayout>
  );
};
