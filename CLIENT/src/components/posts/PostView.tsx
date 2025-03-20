import { useDispatch, useSelector } from "react-redux";
import { PostModalViewProps } from "../../types/post.types";
import { useContext, useState } from "react";
import { User } from "src/types/user.types";
import FormAddComment from "./FormAddComment";
import useMediaQuery from "../../hooks/useMediaQuery"; // 🔹 Import du hook
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import {
  deleteCommentRequested,
  deletePostRequested,
} from "src/redux/reducers/posts.reducer";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import CommentList from "./CommentList";
import PostButtonAction from "./PostButtonAction";
import UserContext from "../AppContext";

export const PostView: React.FC<PostModalViewProps> = ({
  post,
  isOpen,
  onClose,
  message,
  setEditedMessage,
  isEditing,
  setIsEditing,
  onSave,
  // onDelete,
  //currentUser,
}) => {
  const currentUserUid = useContext(UserContext)?.toString();

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const usersData = useSelector((state: any) => state.usersReducer.users);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const dispatch = useDispatch();
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "post" | "comment";
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ✅ Détecte si l'utilisateur est sur mobile
  const isMobile = useMediaQuery("(max-width: 767px)");

  // ✅ Afficher les commentaires automatiquement sur desktop
  const isDesktop = !isMobile;

  // ✅ Ouvrir le modal de confirmation et lui donne les paramètre
  const confirmDelete = (id: string, type: "post" | "comment") => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    if (itemToDelete) {
      if (itemToDelete.type === "comment") {
        dispatch(
          deleteCommentRequested({
            postId: post._id!,
            commentId: itemToDelete.id,
          })
        );
      } else if (itemToDelete.type === "post") {
        dispatch(deletePostRequested(itemToDelete.id));
        onClose();
      }
    }
    setShowDeleteModal(false);
  };

  return isOpen ? (
    <div className="fixed inset-0 overflow-auto bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="absolute top-4 w-full flex justify-between px-4">
        <button
          onClick={onClose}
          className="text-gray-500 font-bold text-lg z-20"
        >
          ✖
        </button>
        {isMobile && !isEditing && currentUserUid === post.posterId && (
          <button
            className="text-gray-500 text-xl font-bold"
            onClick={() => setShowOptions(!showOptions)}
          >
            ⋮
          </button>
        )}
      </div>
      {showOptions && (
        <div className="absolute right-4 top-12 bg-white border rounded shadow-lg">
          <button
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => {
              setIsEditing?.(true);
              setShowOptions(false);
            }}
          >
            Modifier
          </button>
          <button
            className="block px-4 py-2 text-red-500 hover:bg-gray-100"
            onClick={() => {
              confirmDelete(post._id!, "post");
              setShowOptions(false);
            }}
          >
            Supprimer
          </button>
        </div>
      )}

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
            className=":max-h-full max-w-full object-contain"
            src={`${process.env.REACT_APP_API_URL}/${post?.picture?.replace(
              /^\//,
              ""
            )}`}
            alt="Post"
          />
        </div>

        <div
          className={`p-4 flex flex-col ${
            isMobile ? "flex-grow overflow-auto pb-8" : "w-1/2 overflow-auto"
          } relative`}
        >
          <div className="flex justify-between items-center border-b pb-2">
            {usersData.map(
              (user: User) =>
                user._id === post.posterId && (
                  <div
                    key={user._id}
                    className="flex justify-between items-center w-full"
                  >
                    {/*
                    ✅ Affichage de l'image de profil et du nom de l'utilisateur
                    */}
                    <div className="flex w-full items-center gap-2">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${user?.profilePicture}`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="w-full">
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
                            className="flex-1 w-full border resize-none p-2 rounded outline-none bg-transparent text-gray-600 placeholder-gray-400 focus:ring-0"
                          />
                        ) : (
                          <p className="text-gray-800">{post?.message}</p>
                        )}
                        {isEditing && isMobile && (
                          <div className="p-4 flex w-full gap-2 sticky bottom-0 bg-white z-10">
                            <button
                              onClick={() =>
                                setIsEditing && setIsEditing(false)
                              }
                              className="px-4 w-full py-2 border rounded"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={onSave}
                              className="px-4 w-full py-2 bg-primary text-white rounded"
                            >
                              Enregistrer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Affichage du bouton option de l'utilisateur */}
                    {!isMobile &&
                      !isEditing &&
                      currentUserUid === post.posterId && (
                        <button
                          className="text-gray-500 text-xl font-bold"
                          onClick={() => setShowOptions(!showOptions)}
                        >
                          ⋮
                        </button>
                      )}
                  </div>
                )
            )}
          </div>

          {/* ✅ Affichage des commentaires */}
          {isMobile && (
            <div>
              <PostButtonAction
                post={post}
                showComments={isCommentsOpen}
                onToggleComments={setIsCommentsOpen}
                isMobile={isMobile}
              />
            </div>
          )}

          {isCommentsOpen && isMobile && (
            <div className="fixed inset-0 bg-white flex flex-col z-50">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0">
                <button
                  onClick={() => setIsCommentsOpen(false)}
                  className="text-lg"
                >
                  ✖
                </button>
                <p className="text-lg font-semibold">Commentaires</p>
                <div></div>
              </div>

              <CommentList
                post={post}
                usersData={usersData}
                onDelete={confirmDelete}
              />
              <div className="w-full border-t border-gray-200 p-4 sticky bottom-0">
                <FormAddComment
                  postId={post._id!}
                  commenterId={currentUserUid!}
                />
              </div>
            </div>
          )}

          {isDesktop && (
            <>
              <CommentList
                post={post}
                usersData={usersData}
                onDelete={confirmDelete}
              />
              <div className="p-2 border-t border-gray-200">
                <PostButtonAction
                  post={post}
                  showComments={isCommentsOpen}
                  onToggleComments={setIsCommentsOpen}
                  isMobile={isMobile}
                />
              </div>

              {isEditing ? (
                <div className="p-4 border-t  w-full flex gap-2 sticky bottom-0 bg-white z-10">
                  <button
                    onClick={() => setIsEditing && setIsEditing(false)}
                    className="px-4 py-2 w-full border rounded"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={onSave}
                    className="px-4 py-2  w-full bg-primary text-white rounded"
                  >
                    Enregistrer
                  </button>
                </div>
              ) : (
                <div className="w-full border-t border-gray-200 p-4 sticky bottom-0">
                  <FormAddComment
                    postId={post._id!}
                    commenterId={currentUserUid!}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* ✅ Utilisation du composant `ConfirmModal` */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal} // ✅ Contrôle l'affichage du modal
        title={`Supprimer ${
          itemToDelete?.type === "post" ? "la publication" : "le commentaire"
        } ?`} // ✅ Titre dynamique
        message={`Voulez-vous vraiment supprimer ${
          itemToDelete?.type === "post" ? "cette publication" : "ce commentaire"
        } ?`} // ✅ Message dynamique
        onConfirm={handleDeleteConfirmed} // ✅ Fonction exécutée quand l’utilisateur clique sur "Supprimer"
        onCancel={() => setShowDeleteModal(false)} // ✅ Fonction exécutée quand l’utilisateur clique sur "Annuler"
      />
    </div>
  ) : null;
};
