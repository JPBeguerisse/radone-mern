import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { User } from "src/types/user.types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  removePictureRequested,
  updatePictureRequested,
  updateUserRequested,
} from "src/redux/reducers/user.reducer";
import { toast } from "react-toastify";
import { setSelectedPicture } from "src/redux/sagas/user.saga";
import { Eye, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const updateUserSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  userName: z.string().min(2, "Le nom d'utilisateur est requis"),
  email: z.string().email("Email invalide"),
  bio: z.string().optional(),
  newPassword: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // facultatif
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(val);
      },
      {
        message:
          "Le mot de passe doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      }
    ),
  oldPassword: z.string().optional(),
});

export const EditProfil = () => {
  const currentUser: User = useSelector((state: any) => state.userReducer.user);
  const errorsServer = useSelector((state: any) => state.userReducer.error);
  const defaultPicture = "uploads/profil/random-user.jpeg";
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  type UpdateUserForm = z.infer<typeof updateUserSchema>;
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: currentUser?.name || "",
      userName: currentUser?.userName || "",
      email: currentUser?.email || "",
      bio: currentUser?.bio || "",
    },
  });

  // ✅ Dès que currentUser est dispo → on injecte les valeurs dans le formulaire
  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name || "",
        userName: currentUser.userName || "",
        email: currentUser.email || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser, reset]);

  useEffect(() => {
    if (errorsServer && typeof errorsServer === "object") {
      // 🔁 Logique de mapping côté front pour afficher au bon champ
      if (errorsServer.oldPassword) {
        setError("oldPassword", { message: errorsServer.oldPassword });
      }

      if (errorsServer.newPassword) {
        setError("newPassword", { message: errorsServer.newPassword });
      }

      if (errorsServer.email) {
        setError("email", { message: errorsServer.email });
      }

      if (errorsServer.userName) {
        setError("userName", { message: errorsServer.userName });
      } else {
        // erreur générale
        toast.error(errorsServer);
      }
    }
  }, [errorsServer]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login"); // ✅ Redirection vers la page de login
    }
  }, [currentUser, navigate]);

  //toujours mettre ça en dessous des hooks
  // if (!currentUser) {
  //   return (
  //     <p className="text-center text-gray-500">Chargement des données...</p>
  //   );
  // }

  const onSubmit = (data: UpdateUserForm) => {
    dispatch(updateUserRequested({ id: currentUser._id!, data }));
    // optionnel : toast ou redirection ici
  };

  const handleUpdatePicture = (e: any) => {
    const file = e.target.files?.[0];
    setSelectedPicture(file || null);
    dispatch(updatePictureRequested(currentUser._id!));
  };

  const deleteProfilePicture = () => {
    dispatch(removePictureRequested(currentUser._id!));
  };

  return (
    <div className="px-4 sm:px-8 md:px-48">
      <h1 className="font-bold text-xl sm:text-2xl mb-4">Modifier le profil</h1>

      {/* 🧍‍♂️ Bloc utilisateur avec image + infos */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 mt-6 w-full bg-white rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <div className="flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-300 w-20 h-20">
            <img
              src={`${
                currentUser && process.env.REACT_APP_API_URL
              }/${currentUser.picture?.replace(/^\//, "")}`}
              alt="user"
              className="w-full h-full rounded-full object-cover object-center"
            />
          </div>

          <input
            type="file"
            id="file-upload"
            name="profileImage"
            accept=".png, .jpg, .jpeg"
            className="hidden"
            onChange={handleUpdatePicture}
          />
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg">{currentUser.userName}</h3>
            <h5 className="text-gray-600">{currentUser.name}</h5>
          </div>
        </div>
        <div className="md:flex gap-4">
          <div className="w-full sm:w-auto flex items-center">
            <label
              htmlFor="file-upload"
              className="w-full  flex textrr-center cursor-pointer px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition duration-300"
            >
              Modifier la photo
            </label>
          </div>

          <div className="w-full sm:w-auto flex items-center">
            {currentUser.picture && currentUser.picture !== defaultPicture && (
              <button
                onClick={deleteProfilePicture}
                className="w-full sm:w-auto bg-red-500 text-white font-bold hover:bg-secondary px-4 py-2 rounded-lg transition"
              >
                Supprimer la photo
              </button>
            )}
          </div>
        </div>
      </div>
      {/* <UpdatePictureForm /> */}

      {/* 📋 Formulaire */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 rounded-lg flex flex-col gap-6 pb-16"
      >
        {/* Champ Nom */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-1">
            Nom complet
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Champ Username */}
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-semibold mb-1"
          >
            Nom d'utilisateur
          </label>
          <input
            {...register("userName")}
            id="userName"
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {errors.userName && (
            <p className="text-sm text-red-500">{errors.userName.message}</p>
          )}
        </div>

        {/* Champ Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Champ Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-semibold mb-1">
            Bio
          </label>
          <textarea
            {...register("bio")}
            id="bio"
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {errors.bio && (
            <p className="text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>

        {/* Champ Ancien mot de passe */}
        <div className="relative">
          <label
            htmlFor="oldPassword"
            className="block text-sm font-semibold mb-1"
          >
            Ancien mot de passe
          </label>
          <input
            {...register("oldPassword")}
            id="oldPassword"
            type={showOldPassword ? "text" : "password"}
            className="w-full border border-gray-300 rounded-md p-2"
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-10 text-gray-800"
          >
            {showOldPassword ? (
              <EyeClosed width={15} height={15} />
            ) : (
              <Eye width={15} height={15} />
            )}
          </button>
          {errors.oldPassword && (
            <p className="text-sm text-red-500">{errors.oldPassword.message}</p>
          )}
        </div>

        {/* Champ Nouveau mot de passe */}
        <div className="relative">
          <label
            htmlFor="newPassword"
            className="block text-sm font-semibold mb-1"
          >
            Nouveau mot de passe
          </label>
          <input
            {...register("newPassword")}
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            className="w-full border border-gray-300 rounded-md p-2"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-10 text-gray-800"
          >
            {showNewPassword ? (
              <EyeClosed width={15} height={15} />
            ) : (
              <Eye width={15} height={15} />
            )}
          </button>
          {errors.newPassword && (
            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Bouton Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white font-bold px-6 py-2 rounded-lg hover:bg-secondary transition w-full sm:w-auto"
          >
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};
