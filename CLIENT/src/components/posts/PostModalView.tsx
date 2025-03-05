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
  //   const [showOptions, setShowOptions] = useState(false);
  //   const [editMode, setEditMode] = useState(false);
  //   const [editedMessage, setEditedMessage] = useState<string>("");

  const [showOptions, setShowOptions] = useState<boolean>(false);

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-sm md:max-w-lg w-full mx-4 relative">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={onClose}
                className="text-gray-500 font-bold text-lg self-end"
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
                      setIsEditing(true);
                      setShowOptions(false);
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    className="block px-4 py-2 text-red-500 hover:bg-gray-100"
                    onClick={() => {
                      onDelete(post._id!);
                      onClose();
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            <img
              className="w-full h-auto mb-4 rounded-lg"
              src={`${process.env.REACT_APP_API_URL}/${
                post && post.picture && post.picture.replace(/^\//, "")
              }`}
              alt="Post"
            />
            <div className="text-sm md:text-base">
              {post && currentUser._id === post.posterId && (
                <p className="mb-2">
                  <strong>Posté par :</strong> {currentUser.firstName}{" "}
                  {currentUser.lastName}
                </p>
              )}
              <div className="mb-2">
                {isEditing ? (
                  <textarea
                    value={message}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                  />
                ) : (
                  <p>
                    <strong>Message :</strong> {post && post.message}
                  </p>
                )}
                <div className="flex gap-4">
                  {isEditing && (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
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
                <strong>Date :</strong> {post && post.createdAt}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
