import React, { useState } from "react";
import Login from "./Login";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "src/services/userService";
import { toast } from "react-toastify";

export const userRegisterSchema = z
  .object({
    name: z.string().min(2, "Le nom est requis"),
    userName: z.string().min(2, "Le nom d'utilisateur est requis"),
    email: z.string().email("Email invalide"),
    password: z.string().refine(
      (val) => {
        if (!val) return true; // facultatif
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(val);
      },
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

const Register = () => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  type userRegisterForm = z.infer<typeof userRegisterSchema>;

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

  const onSubmit = async (data: userRegisterForm) => {
    try {
      const newUser = await createUser(data); // service API
      setIsSubmit(true);
    } catch (error: any) {
      const serverErrors = error.response?.data?.errors;

      // ✅ Gestion des erreurs champ par champ
      if (serverErrors && typeof serverErrors === "object") {
        Object.entries(serverErrors).forEach(([field, message]) => {
          setError(field as keyof userRegisterForm, {
            type: "server",
            message: message as string,
          });
        });
      }
    }
  };

  return (
    <>
      {isSubmit ? (
        <>
          <Login />
          <h4 className="text-green-500 text-center mt-4">
            Inscription réussie, veuillez vous connecter.
          </h4>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            Inscription
          </h2>
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
              name="name"
              className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
            />
            {errors.name && (
              <div className="text-red-500 text-sm">{errors.name.message}</div>
            )}
          </div>
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
              name="userName"
              className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
            />
            {errors.userName && (
              <div className="text-red-500 text-sm">
                {errors.userName.message}
              </div>
            )}
          </div>
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
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Mot de passe
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              name="password"
              className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
            />
            {errors.password && (
              <div className="text-red-500 text-sm">
                {errors.password.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="passwordRepeat"
              className="block text-sm font-medium text-gray-600"
            >
              Confirmation mot de passe
            </label>
            <input
              {...register("passwordRepeat")}
              type="password"
              id="passwordRepeat"
              name="passwordRepeat"
              className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
            />
            {errors.passwordRepeat && (
              <div className="text-red-500 text-sm">
                {errors.passwordRepeat.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-2 text-white bg-primary rounded-md hover:bg-secondary transition"
          >
            S'inscrire
          </button>
        </form>
      )}
    </>
  );
};

export default Register;
