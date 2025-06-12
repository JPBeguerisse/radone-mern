// Description : Composant d'affichage en modal d'une publication, avec actions (éditer, supprimer, commenter, liker...)

import { useDispatch, useSelector } from "react-redux";
import { PostDetailsProps } from "../../../types/post.types";
import { useContext, useEffect, useRef, useState } from "react";
import { User } from "src/types/user.types";
import FormAddComment from "./comment/FormAddComment";
import useMediaQuery from "../../../hooks/useMediaQuery";
import {
  deleteCommentRequested,
  deletePostRequested,
} from "src/redux/reducers/posts.reducer";
import ConfirmDeleteModal from "./modal/ConfirmDeleteModal";
import CommentList from "./comment/CommentList";
import PostButtonAction from "./PostButtonAction";
import { UserContext } from "../../../components/AppContext";
import { FollowAction } from "../../user/components/FollowAction";
import { useNavigate } from "react-router-dom";
import { getUserByUsernameRequested } from "src/redux/reducers/viewed-user.reducer";
//@ts-ignore
import ShowMoreText from "react-show-more-text";

export const PostDetails: React.FC<PostDetailsProps> = ({
  post,
  message,
  isOpen,
  onClose,
  onSave,
  isEditing,
  setIsEditing,
  setEditedMessage,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;

  const [showOptions, setShowOptions] = useState(false);
  const usersData = useSelector((state: any) => state.usersReducer.users);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "post" | "comment";
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isDesktop = !isMobile;

  // Déclenche la suppression (post ou commentaire)
  const confirmDelete = (id: string, type: "post" | "comment") => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true);
  };

  // Ferme le modal si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Confirme la suppression d'un post ou commentaire
  const handleDeleteConfirmed = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === "comment") {
      dispatch(
        deleteCommentRequested({
          postId: post._id!,
          commentId: itemToDelete.id,
        })
      );
    } else {
      dispatch(
        deletePostRequested({
          postId: itemToDelete.id,
          userId: currentUserUid!,
        })
      );
      onClose();
    }
    setShowDeleteModal(false);
  };

  const handleGoProfile = (userName: string) => {
    navigate(`/profil/${userName}?tab=posts`);
    onClose();
    dispatch(getUserByUsernameRequested(userName));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-auto bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div
        className={`bg-white rounded-lg shadow-lg overflow-hidden ${
          isMobile
            ? "w-full min-h-screen flex flex-col"
            : "w-full max-w-4xl h-[90vh] flex"
        }`}
        ref={modalRef}
      >
        {isDesktop && (
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={onClose}
              className="text-white text-2xl font-bold bg-black/60 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black"
            >
              ✖
            </button>
          </div>
        )}
        {isMobile && (
          <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 border-b border-gray-200 bg-white z-50">
            <button onClick={onClose} className="text-lg">
              ✖
            </button>
            <p className="text-lg font-semibold">Publication</p>
            {currentUserUid === post.posterId ? (
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="text-xl font-bold"
              >
                ⋮
              </button>
            ) : (
              <div className="w-6" /> // pour équilibrer
            )}
          </div>
        )}
        {/* Boutons de fermeture / options */}
        {/* <div className="absolute top-4 w-full flex justify-between px-4">
          <button
            onClick={onClose}
            className="text-white font-bold text-lg z-20"
          >
            ✖
          </button>
          {isMobile && !isEditing && currentUserUid === post.posterId && (
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-white text-xl font-bold"
            >
              ⋮
            </button>
          )}
        </div> */}

        {/* Menu des options (modifier/supprimer) */}
        {showOptions && (
          <div className="absolute right-4 top-12 bg-white border rounded shadow-lg z-[999]">
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

        {/* Modal de confirmation suppression */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          title={`Supprimer ${
            itemToDelete?.type === "post" ? "la publication" : "le commentaire"
          } ?`}
          message={`Voulez-vous vraiment supprimer ${
            itemToDelete?.type === "post"
              ? "cette publication"
              : "ce commentaire"
          } ?`}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setShowDeleteModal(false)}
        />

        {/* Colonne image */}
        <div
          className={`bg-black flex items-center justify-center ${
            isMobile ? "w-full mt-[64px]" : "w-1/2"
          }`}
        >
          <img
            className=":max-h-full max-w-full object-contain"
            src={post.picture}
            alt="Post"
          />
        </div>

        {/* Colonne contenu */}
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
                    {/* Infos auteur */}
                    <div className="flex w-full items-center gap-2">
                      <div className="w-full">
                        <div className="flex justify-between items-center">
                          {/* Partie gauche : photo + nom + follow */}
                          <div className="flex items-center gap-2">
                            <img
                              src={user.picture}
                              alt="user"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <p
                              onClick={() => handleGoProfile(user.userName!)}
                              className="font-bold cursor-pointer"
                            >
                              {user?.userName}
                            </p>
                            <FollowAction followerId={user._id!} />
                          </div>

                          {/* Bouton ⋮ */}
                          <div>
                            {!isMobile &&
                              !isEditing &&
                              currentUserUid === post.posterId && (
                                <button
                                  onClick={() => setShowOptions(!showOptions)}
                                  className="text-gray-500 text-xl font-bold"
                                >
                                  ⋮
                                </button>
                              )}
                          </div>
                        </div>
                        <div className="pt-2">
                          {isEditing ? (
                            <textarea
                              value={message}
                              onChange={(e) =>
                                setEditedMessage?.(e.target.value)
                              }
                              className="flex-1 w-full border resize-none p-2 rounded outline-none bg-transparent text-gray-600"
                            />
                          ) : (
                            <ShowMoreText
                              lines={2}
                              more="Voir plus"
                              less="Voir moins"
                              className="text-gray-800"
                              anchorClass="text-blue-500 font-semibold"
                              expanded={false}
                              width={0}
                            >
                              <p className="text-gray-800">{post?.message}</p>
                            </ShowMoreText>
                          )}
                        </div>
                        {isEditing && isMobile && (
                          <div className="p-4 flex w-full gap-2 sticky bottom-0 bg-white z-10">
                            <button
                              onClick={() => setIsEditing?.(false)}
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
                  </div>
                )
            )}
          </div>

          {/* Section commentaires + actions */}
          {isMobile && (
            <PostButtonAction
              post={post}
              showComments={isCommentsOpen}
              onToggleComments={setIsCommentsOpen}
              isMobile={isMobile}
            />
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
                onClose={onClose}
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
                onClose={onClose}
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
                <div className="p-4 border-t w-full flex gap-2 sticky bottom-0 bg-white z-10">
                  <button
                    onClick={() => setIsEditing?.(false)}
                    className="px-4 py-2 w-full border rounded"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={onSave}
                    className="px-4 py-2 w-full bg-primary text-white rounded"
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
    </div>
  );
};
