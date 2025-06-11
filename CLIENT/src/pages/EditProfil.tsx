import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { User } from "src/types/user.types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getUserRequested,
  removePictureRequested,
  removeProfilePictureRequested,
  updatePictureRequested,
  updateProfilePictureRequested,
  updateUserRequested,
} from "src/redux/reducers/user.reducer";
import { toast } from "react-toastify";
import { setSelectedPicture } from "src/redux/sagas/user.saga";
import { Eye, EyeClosed } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "src/components/AppContext";
import { uploadToCloudinary } from "src/services/uploadToCloudinary";
import { updatePicture } from "src/services/userService";

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
  const user = useSelector((state: User) => state.userReducer.user);
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;
  // console.log("User", user);
  // console.log("currentUserUid", currentUserUid);

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
      name: user?.name || "",
      userName: user?.userName || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });

  // ✅ Dès que currentUser est dispo → on injecte les valeurs dans le formulaire
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        userName: user.userName || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user, reset]);

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

  // En cours de chargement (token en cours de vérification)
  if (userContext?.isLoading) {
    return <div>Chargement...</div>; // ou un spinner
  }

  // ❌ Pas connecté
  if (!userContext?.uid) {
    return <Navigate to="/login" replace />;
  }

  const onSubmit = (data: UpdateUserForm) => {
    dispatch(updateUserRequested({ id: user._id!, data }));
  };

  // const handleUpdatePicture = (e: any) => {
  //   //const file = e.target.files?.[0];
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("profileImage", file); // doit correspondre au nom utilisé dans `multer`
  //   formData.append("userId", currentUserUid!);
  //   setSelectedPicture(file || null);
  //   //dispatch(updatePictureRequested(currentUserUid!));
  //   dispatch(updatePictureRequested(formData));
  // };

  const deleteProfilePicture = () => {
    dispatch(removeProfilePictureRequested(currentUserUid!));
  };

  const handleUpdatePicture = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { secure_url, public_id } = await uploadToCloudinary(file);
      dispatch(
        updateProfilePictureRequested({
          userId: currentUserUid!,
          pictureUrl: secure_url,
          public_id: public_id,
        })
      );
    } catch (err) {
      console.error("Erreur d'upload :", err);
      alert("Erreur pendant l'upload de l'image.");
    }
  };

  // Vérifie si l'utilisateur est un invité pour afficher ou non certaines options
  const isGuest = user?.isGuest;

  return (
    <div className="px-4 sm:px-8 md:px-48">
      <div>
        <h1 className="font-bold text-xl sm:text-2xl mb-4">
          Modifier le profil
        </h1>
        {isGuest && (
          <p className="text-red-500 mb-4">
            Vous êtes connecté en tant qu'invité. Certaines fonctionnalités sont
            désactivées.
          </p>
        )}
      </div>

      {/*  Bloc utilisateur avec image + infos */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 mt-6 w-full bg-white rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <div className="flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-300 w-20 h-20">
            {user && (
              <img
                src={user.picture}
                alt="user"
                className="w-full h-full rounded-full object-cover object-center"
              />
            )}
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
            <h3 className="font-bold text-lg">{user && user.userName}</h3>
            <h5 className="text-gray-600">{user && user.name}</h5>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
          <div className="w-full sm:w-auto flex justify-center items-center">
            <label
              htmlFor="file-upload"
              className={`w-full sm:w-auto text-center px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition duration-300 cursor-pointer ${
                isGuest ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{
                pointerEvents: isGuest ? "none" : "auto",
              }}
            >
              Modifier la photo
            </label>
          </div>

          <div className="w-full sm:w-auto flex items-center">
            {user && user.picture && user.picture !== defaultPicture && (
              <button
                onClick={deleteProfilePicture}
                className={`w-full sm:w-auto bg-red-500 text-white font-bold hover:bg-secondary px-4 py-2 rounded-lg transition" ${
                  isGuest ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isGuest}
              >
                Supprimer la photo
              </button>
            )}
          </div>
        </div>
      </div>
      {/* <UpdatePictureForm /> */}

      {/* Formulaire */}
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
            disabled={isGuest}
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
            disabled={isGuest} // Désactive le champ si l'utilisateur est un invité
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
            disabled={isGuest} // Désactive le champ si l'utilisateur est un invité
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
            disabled={isGuest}
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
            disabled={isGuest}
            className={`bg-primary text-white font-bold px-6 py-2 rounded-lg hover:bg-secondary transition w-full sm:w-auto ${
              isGuest ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};
