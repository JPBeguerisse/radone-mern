import { createPostRequested } from "../redux/reducers/posts.reducer";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "src/services/posts/uploadToCloudinary";

const AddPost: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const MAX_FILE_SIZE_MB = 5; // Taille maximale du fichier en Mo
  const ALLOWED_FILE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ]; // Types de fichiers autorisés

  const user = useSelector((state: any) => state.userReducer.user);

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [picture, setPicture] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isNext, setIsNext] = useState<boolean>(false);
  const isGuest = user?.isGuest || false;

  // Gestion de l'image sélectionnée
  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPicture(URL.createObjectURL(file));
    }
  };

  // Gestion du message de l'utilisateur
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // Gestion de la création de la publication
  const handleCreatePost = async () => {
    if (!user?._id) {
      console.error("Erreur : posterId manquant !");
      return;
    }

    const file = selectedFile;
    if (!file) return;

    // Vérification de la taille du fichier
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(
        `La taille du fichier ne doit pas dépasser ${MAX_FILE_SIZE_MB} Mo.`
      );
      return;
    }
    // Vérification du type de fichier
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error(
        "Type de fichier non autorisé. Veuillez télécharger une image au format PNG, JPEG, JPG ou WEBP."
      );
      return;
    }

    try {
      const { secure_url, public_id } = await uploadToCloudinary(file);
      dispatch(
        createPostRequested({
          posterId: user._id,
          message: message,
          pictureUrl: secure_url,
          publicId: public_id,
        })
      );
    } catch (error) {
      console.error("Erreur lors de la création de la publication :", error);
      return;
    }
    // Fermer le modal et rediriger vers la page d'accueil
    handleCloseModal();
  };

  // Fermeture du modal
  const handleCloseModal = () => {
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-lg md:max-w-2xl w-full mx-4 relative transform transition-all scale-95 md:scale-100">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleCloseModal}
                className="text-gray-500 font-bold text-2xl hover:text-gray-700 transition"
              >
                &times;
              </button>

              {/* Bouton pour aller à l'étape suivante */}
              {picture && !isNext && (
                <button
                  onClick={() => setIsNext(true)}
                  className="text-white bg-primary px-4 py-2 rounded-lg font-semibold hover:bg-secondary transition"
                >
                  Suivant
                </button>
              )}

              {/* Bouton pour partager la publication */}
              {isNext && (
                <button
                  onClick={handleCreatePost}
                  className={`text-white bg-primary px-4 py-2 rounded-lg font-semibold hover:bg-secondary transition" ${
                    isGuest ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isGuest}
                >
                  Partager
                </button>
              )}
            </div>

            {/* Contenu du modal */}
            <div>
              <div className="border-b pb-3 text-center text-lg font-semibold text-gray-700">
                Créer une nouvelle publication
                {isNext && isGuest && (
                  <div className="mt-4 text-red-500 text-center">
                    Vous êtes en mode invité, vous ne pouvez pas publier.
                  </div>
                )}
              </div>

              <div
                className={`flex ${
                  isNext ? "flex-col md:flex-row gap-6" : "flex-col"
                } mt-4`}
              >
                {/* Image et upload */}
                <div
                  className={`${
                    isNext ? "w-full md:w-1/2" : "w-full"
                  } flex flex-col items-center gap-6`}
                >
                  <div className="w-full md:w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
                    {picture ? (
                      <img
                        src={picture}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="img/image-galery.png"
                        alt=""
                        className="w-24 h-24 opacity-50"
                      />
                    )}
                  </div>

                  <input
                    type="file"
                    id="file-upload"
                    name="postImage"
                    accept=".png, .jpg, .jpeg ,.webp"
                    required
                    className="hidden"
                    onChange={handlePictureChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition duration-300"
                  >
                    Importer une photo
                  </label>
                </div>

                {/* Zone de texte */}
                {isNext && (
                  <div className=" w-full md:w-1/2 p-4 flex flex-col gap-4 rounded-lg shadow-md">
                    {/* Infos utilisateur */}
                    <div className="flex gap-3 items-center">
                      <img
                        src={user.picture}
                        alt="user"
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                      />
                      <h5 className="text-lg font-medium text-gray-700">
                        {user.firstName} {user.lastName}
                      </h5>
                    </div>

                    {/* Zone de texte */}
                    <div className="relative">
                      <textarea
                        value={message}
                        onChange={handleMessageChange}
                        name="message"
                        id="message"
                        placeholder="Écrivez un message..."
                        className="w-full h-28 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-700 resize-none transition"
                      />
                      <span className="absolute bottom-2 right-2 text-gray-400 text-sm">
                        {message.length}/280
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPost;
