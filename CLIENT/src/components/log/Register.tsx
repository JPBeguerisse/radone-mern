import axios from "axios";
import React, { useState } from "react";
import Login from "./Login";

const Register = () => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Met à jour le champ correspondant dans l'état
    });

    // Effacer l'erreur spécifique dès qu'on tape
    setErrors({
      ...errors,
      [name]: "", // Remet à zéro l'erreur pour ce champ
    });
  };

  // const validateForm = () => {
  //     let valid = true;
  //     const newErrors = { name: "", userName: "", email: "", password: "", passwordRepeat: "" };

  //     // Vérifications simples côté client
  //     if (!formData.name) {
  //         newErrors.name = "Le prénom est requis.";
  //         valid = false;
  //     }
  //     if (!formData.userName) {
  //         newErrors.userName = "Le nom est requis.";
  //         valid = false;
  //     }
  //     if (!formData.email) {
  //         newErrors.email = "L'adresse email est requise.";
  //         valid = false;
  //     }
  //     if (!formData.password) {
  //         newErrors.password = "Le mot de passe est requis.";
  //         valid = false;
  //     }
  //     if (formData.password.length < 6) {
  //         newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
  //         valid = false;
  //     }
  //     if (formData.password !== formData.passwordRepeat) {
  //         newErrors.passwordRepeat = "Les mots de passe ne correspondent pas.";
  //         valid = false;
  //     }

  //     setErrors(newErrors);
  //     return valid;
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // if (!validateForm()) {
    //     return;  // Si le formulaire n'est pas valide, arrête la soumission
    // }

    if (formData.password === formData.passwordRepeat) {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/user/register`,
          {
            name: formData.name,
            userName: formData.userName,
            email: formData.email,
            password: formData.password,
          }
        );
        console.log(res);
        setIsSubmit(true);
      } catch (err: any) {
        if (err.response && err.response.data) {
          const errorData = err.response.data;
          console.log("Errors", errorData);
          // Si le backend renvoie des erreurs pour des champs spécifiques
          if (errorData.message.includes("Le nom complet est requis")) {
            setErrors((prev) => ({
              ...prev,
              name: "Le nom complet est requis",
            }));
          }

          if (
            errorData.message.includes(
              "Le nom complet doit contenir 3 caractères minimum."
            )
          ) {
            setErrors((prev) => ({ ...prev, name: errorData.message }));
          }

          if (
            errorData.message.includes(
              "Le nom de profil doit contenir 2 caractères minimum."
            )
          ) {
            setErrors((prev) => ({ ...prev, userName: errorData.message }));
          }

          if (errorData.message.includes("Le nom est requis")) {
            setErrors((prev) => ({ ...prev, userName: errorData.message }));
          }

          if (errorData.message.includes("Ce nom de profil existe déjà!")) {
            setErrors((prev) => ({ ...prev, userName: errorData.message }));
          }

          if (errorData.message.includes("Le nom de profil est requis.")) {
            setErrors((prev) => ({ ...prev, userName: errorData.message }));
          }

          if (
            errorData.message.includes(
              "Le username doit contenir 2 caractères minimum."
            )
          ) {
            setErrors((prev) => ({ ...prev, userName: errorData.message }));
          }

          if (errorData.message.includes("L'adresse email est requise")) {
            setErrors((prev) => ({ ...prev, email: errorData.message }));
          }
          if (errorData.message.includes("mot de passe")) {
            setErrors((prev) => ({ ...prev, password: errorData.message }));
          }
          if (errorData.message.includes("Cette adresse email existe déjà")) {
            setErrors((prev) => ({ ...prev, email: errorData.message }));
          }

          if (errorData.message.includes("L'adresse email n'est pas valide")) {
            setErrors((prev) => ({ ...prev, email: errorData.message }));
          }
        }
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        passwordRepeat: "Les mots de passe ne correspondent pas.",
      }));
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
        <form onSubmit={handleSubmit} className="space-y-6">
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
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
            />
            {errors.name && (
              <div className="text-red-500 text-sm">{errors.name}</div>
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
              type="text"
              id="userName"
              name="userName"
              value={formData.userName.toLocaleLowerCase().replace(/\s/g, "")}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
            />
            {errors.userName && (
              <div className="text-red-500 text-sm">{errors.userName}</div>
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
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
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
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
            />
            {errors.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
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
              type="password"
              id="passwordRepeat"
              name="passwordRepeat"
              value={formData.passwordRepeat}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-md focus:border-blue-400"
            />
            {errors.passwordRepeat && (
              <div className="text-red-500 text-sm">
                {errors.passwordRepeat}
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
