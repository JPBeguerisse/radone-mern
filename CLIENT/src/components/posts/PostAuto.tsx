import { useSelector } from "react-redux";
import { PostModalViewProps } from "../../types/post.types";
import { useState } from "react";
import { User } from "src/types/user.types";
import FormAddComment from "./FormAddComment";
import useMediaQuery from "../../hooks/useMediaQuery"; // 🔹 Import du hook

export const PostModal: React.FC<PostModalViewProps> = ({
  post,
  isOpen,
  onClose,
  message,
  setEditedMessage,
  isEditing,
  setIsEditing,
  onSave,
  // onDelete,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const usersData = useSelector((state: any) => state.usersReducer.users);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // ✅ Détecte si l'utilisateur est sur mobile
  const isMobile = useMediaQuery("(max-width: 767px)");

  // ✅ Afficher les commentaires automatiquement sur desktop
  const shouldShowComments = !isMobile || isCommentsOpen;

  return isOpen ? (
    <div className="fixed inset-0 overflow-auto bg-black bg-opacity-80 z-50 md:flex items-center justify-center">
      <div
        className={`${
          isMobile &&
          "flex justify-between w-full items-center p-4 border-b sticky top-0 bg-white z-10"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 ${
            isMobile ? "left-4" : "right-4"
          } text-gray-500 font-bold text-lg z-20`}
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
                // onDelete && onDelete(post._id!);
                onClose();
              }}
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
      <div
        className={`bg-white rounded-lg shadow-lg overflow-hidden ${
          isMobile
            ? "w-full min-h-screen flex flex-col"
            : "w-full max-w-4xl h-[90vh] flex"
        }`}
      >
        <div
          className={`bg-black flex items-center justify-center ${
            isMobile ? "w-full" : "w-1/2"
          }`}
        >
          <img
            className={` max-w-full object-contain ${
              isMobile ? "max-h-[60vh]" : "max-h-full"
            } `}
            src={`${process.env.REACT_APP_API_URL}/${post?.picture?.replace(
              /^\//,
              ""
            )}`}
            alt="Post"
          />
        </div>

        <div
          className={`p-4 flex flex-col ${
            isMobile ? "flex-grow overflow-auto pb-16" : "w-1/2 overflow-auto"
          } relative`}
        >
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center gap-2">
              {usersData.map(
                (user: User) =>
                  user._id === post.posterId && (
                    <div key={user._id} className="flex items-center gap-2">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${user?.picture}`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <p className="font-bold">
                        {user?.name} {user?.userName}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>

          {isEditing ? (
            <textarea
              value={message}
              onChange={(e) => setEditedMessage?.(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
          ) : (
            <p className="text-gray-800">{post?.message}</p>
          )}

          {!isMobile && <div className="mt-4 border-t pt-2" />}

          <div className="flex gap-4 mt-4">
            <button onClick={() => setIsCommentsOpen(false)}>Like</button>
            {isMobile && (
              <button onClick={() => setIsCommentsOpen(!isCommentsOpen)}>
                Commentaires
              </button>
            )}
          </div>

          {shouldShowComments && (
            <div className="mt-4 border-t pt-2 flex-grow overflow-auto">
              {post.comments?.length ? (
                post.comments.map((comment) =>
                  usersData.map(
                    (user: User) =>
                      user._id === comment.commenterId && (
                        <div key={user._id} className="flex gap-4 mb-4">
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${user?.picture}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-bold">
                              {user.name} {user.userName}
                            </p>
                            <p>{comment.text}</p>
                          </div>
                        </div>
                      )
                  )
                )
              ) : (
                <p className="text-center text-gray-500">
                  Aucun commentaire pour l’instant.
                </p>
              )}
            </div>
          )}

          {(shouldShowComments || !isMobile) && (
            <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t flex items-center gap-2">
              {/* <FormAddComment
                postId={post._id!}
                commenterId={currentUser?._id!}
              /> */}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};
