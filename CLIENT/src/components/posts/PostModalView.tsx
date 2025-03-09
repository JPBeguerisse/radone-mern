import { PostModalViewProps } from "../../redux/types/post.types";
import { useState } from "react";

export const PostModal: React.FC<PostModalViewProps> = ({
  post,
  isOpen,
  onClose,
  message,
  setEditedMessage,
  isEditing,
  setIsEditing,
  onSave,
  onDelete,
  currentUser,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* ✅ Fixer la taille du modal */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-sm md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-auto mx-4 relative">
            {/* ✅ Boutons fermer et options */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={onClose}
                className="text-gray-500 font-bold text-lg"
              >
                X
              </button>
              <button
                className="text-gray-500 text-xl font-bold"
                onClick={() => setShowOptions(!showOptions)}
              >
                ...
              </button>
              {showOptions && (
                <div className="absolute right-4 top-12 bg-white border rounded shadow-lg">
                  <button
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsEditing && setIsEditing(true);
                      setShowOptions(false);
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    className="block px-4 py-2 text-red-500 hover:bg-gray-100"
                    onClick={() => {
                      onDelete && onDelete(post._id!);
                      onClose();
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            {/* ✅ Image responsive */}
            <img
              className="w-full max-h-[60vh] object-contain rounded-lg"
              src={`${process.env.REACT_APP_API_URL}/${post?.picture?.replace(
                /^\//,
                ""
              )}`}
              alt="Post"
            />

            {/* ✅ Contenu texte */}
            <div className="text-sm md:text-base mt-4">
              {post && currentUser && currentUser._id === post.posterId && (
                <p className="mb-2">
                  <strong>Posté par :</strong>{" "}
                  {currentUser && currentUser.firstName}{" "}
                  {currentUser && currentUser.lastName}
                </p>
              )}
              <div className="mb-2">
                {isEditing ? (
                  <textarea
                    value={message}
                    onChange={(e) =>
                      setEditedMessage && setEditedMessage(e.target.value)
                    }
                    className="w-full p-2 border rounded mb-4"
                  />
                ) : (
                  <p>
                    <strong>Message :</strong> {post?.message}
                  </p>
                )}
                <div className="flex gap-4">
                  {isEditing && (
                    <>
                      <button
                        onClick={() => setIsEditing && setIsEditing(false)}
                        className="px-4 py-2 border rounded"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={onSave}
                        className="px-4 py-2 bg-primary text-white rounded"
                      >
                        Enregistrer
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p>
                <strong>Date :</strong> {post?.createdAt}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
