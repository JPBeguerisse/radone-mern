import { useSelector } from "react-redux";
import { PostModalViewProps } from "../../types/post.types";
import { useState } from "react";
import { User } from "src/types/user.types";

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
  const usersData = useSelector((state: any) => state.usersReducer.users);

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 overflow-auto bg-black bg-opacity-80 z-50 md:hidden">
          {/* Mode mobile - Affichage en pleine page avec scroll */}
          <div className="w-full min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <button
                onClick={onClose}
                className="text-gray-500 font-bold text-lg"
              >
                ✖
              </button>
              <button
                className="text-gray-500 text-xl font-bold"
                onClick={() => setShowOptions(!showOptions)}
              >
                ⋮
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
            {/* Image */}
            <div className="flex justify-center items-center bg-black">
              <img
                className="max-h-[60vh] w-full object-contain"
                src={`${process.env.REACT_APP_API_URL}/${post?.picture?.replace(
                  /^\//,
                  ""
                )}`}
                alt="Post"
              />
            </div>
            {/* Contenu */}
            <div className="flex flex-col p-4 flex-grow overflow-auto">
              <p className="font-bold">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              {isEditing ? (
                <textarea
                  value={message}
                  onChange={(e) =>
                    setEditedMessage && setEditedMessage(e.target.value)
                  }
                  className="w-full p-2 border rounded mb-4"
                />
              ) : (
                <p className="text-gray-800">{post?.message}</p>
              )}
            </div>
            {/* Commentaires & Actions */}
            <div className="p-4 border-t flex flex-col gap-2 sticky bottom-0 bg-white z-10">
              {isEditing ? (
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
              ) : (
                <p className="text-gray-500 text-sm">{post?.createdAt}</p>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Desktop Modal */}
      {isOpen && (
        <div className="hidden md:flex fixed inset-0 items-center justify-center bg-black bg-opacity-80 z-50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 font-bold text-lg z-20"
          >
            ✖
          </button>
          <div className="flex bg-white rounded-lg shadow-lg w-full max-w-4xl h-[90vh] overflow-hidden">
            {/* Image */}
            <div className="w-1/2 bg-black flex items-center justify-center">
              <img
                className="max-h-full max-w-full object-contain"
                src={`${process.env.REACT_APP_API_URL}/${post?.picture?.replace(
                  /^\//,
                  ""
                )}`}
                alt="Post"
              />
            </div>
            {/* Contenu */}
            <div className="w-1/2 flex flex-col justify-between p-4 overflow-auto">
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 pb-2">
                    {usersData.map((user: User) =>
                      user._id === post.posterId ? (
                        <div key={user._id} className="flex items-center gap-2">
                          <div>
                            <img
                              src={`${process.env.REACT_APP_API_URL}/${user?.profilePicture}`}
                              alt="Profile"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold">
                              {user?.firstName} {user?.lastName}
                            </p>
                            {isEditing ? (
                              <textarea
                                value={message}
                                onChange={(e) =>
                                  setEditedMessage &&
                                  setEditedMessage(e.target.value)
                                }
                                className="w-full p-2 border rounded mb-4"
                              />
                            ) : (
                              <p className="text-gray-800">{post?.message}</p>
                            )}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
                <button
                  className="text-gray-500 text-xl font-bold"
                  onClick={() => setShowOptions(!showOptions)}
                >
                  ⋮
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
              <div className="flex-1 overflow-auto p-2 gap-4">
                {post &&
                  post.comments?.map((comment) =>
                    usersData.map(
                      (user: User) =>
                        user._id === comment.commenterId && (
                          <div key={user._id} className="flex gap-4 mb-4">
                            <div className="">
                              <img
                                src={`${process.env.REACT_APP_API_URL}/${user?.profilePicture}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold">
                                {user.firstName} {user.lastName}
                              </p>
                              <p>{comment.text}</p>
                            </div>
                          </div>
                        )
                    )
                  )}
              </div>
              <div className="border-t pt-2 flex gap-2">
                {isEditing ? (
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
                ) : (
                  <p className="text-gray-500 text-sm">{post?.createdAt}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
