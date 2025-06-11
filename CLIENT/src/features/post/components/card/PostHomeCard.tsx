import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "src/types/post.types";
import { User } from "src/types/user.types";
import PostButtonAction from "../PostButtonAction";
import { PostDetails } from "../PostDetails";
import { useNavigate } from "react-router-dom";
import { getUserByUsernameRequested } from "src/redux/reducers/viewed-user.reducer";
import {
  getPostRequested,
  updatePostRequested,
} from "src/redux/reducers/posts.reducer";

interface PostHomeCardProps {
  post: Post;
}

export const PostHomeCard: React.FC<PostHomeCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.userReducer.user);
  const users = useSelector((state: any) => state.usersReducer.users);
  const selectedPost = useSelector((state: any) => state.postsReducer.post);

  const poster = users.find((user: User) => user._id === post.posterId);

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedMessage, setEditedMessage] = useState<string>("");

  // Gère l'ouverture du modal pour afficher les détails du post
  const handleOpenModal = () => {
    setIsOpen(true);
    dispatch(getPostRequested(post._id!));
  };

  // Gère la fermeture du modal
  const closeModal = () => {
    setIsOpen(false);
  };

  // Gère la redirection vers le profil de l'utilisateur
  const handleGoProfile = (userName: string) => {
    if (user && userName === user.userName) {
      navigate("/my-profil");
    } else {
      navigate(`/profil/${userName}?tab=posts`);
      dispatch(getUserByUsernameRequested(userName));
    }
  };

  // Sauvegarde l'édition du message du post
  const handleSave = () => {
    try {
      const updatedData = { message: editedMessage };
      dispatch(
        updatePostRequested({ _id: selectedPost._id, data: updatedData })
      );
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du post :", error.message);
    }
    setEditMode(false);
  };

  // Met à jour le message édité si le post sélectionné change
  useEffect(() => {
    if (selectedPost) {
      setEditedMessage(selectedPost.message || ""); // ✅ Met à jour `editedMessage` quand Redux change
    }
  }, [selectedPost]);

  if (!poster) return null;

  return (
    <>
      {/* Carte du post */}
      <div className="flex flex-col gap-2 p-4 border-b border-gray-300 lg:w-[470px] lg:mx-auto">
        {/* Header avec photo, nom et date */}
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-300 w-10 h-10">
            <img
              src={poster.picture}
              alt="user"
              className="w-full h-full rounded-full object-cover object-center"
            />
          </div>
          <p
            onClick={() => handleGoProfile(poster.userName)}
            className="text-sm font-semibold cursor-pointer hover:text-gray-600"
          >
            {poster.userName}
          </p>
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(post.createdAt!), {
              addSuffix: true,
              locale: fr,
            })}
          </p>
        </div>

        {/* Image du post */}
        <div>
          <img
            className="w-full h-auto aspect-square object-cover rounded-lg sm:w-[468px] sm:h-[468px] cursor-pointer"
            src={post.picture}
            alt="post"
            onClick={handleOpenModal}
          />
        </div>

        {/* Actions like / save / comment */}
        <PostButtonAction
          post={post}
          showComments={isCommentsOpen}
          onOpenPostView={handleOpenModal}
        />

        {/* Description du post */}
        <div className="flex gap-2">
          <p className="text-sm font-semibold">{poster.userName}</p>
          <p className="text-sm text-gray-500">{post.message}</p>
        </div>

        {/* Lien vers les commentaires */}
        {post.comments?.length! > 0 && (
          <p
            onClick={handleOpenModal}
            className="text-gray-400 text-sm cursor-pointer hover:text-gray-600"
          >
            Afficher les {post.comments?.length} commentaires
          </p>
        )}
      </div>

      {/* Modale PostDetails */}
      {isOpen && selectedPost && (
        <PostDetails
          post={selectedPost}
          isOpen={isOpen}
          onClose={closeModal}
          isEditing={editMode}
          setIsEditing={setEditMode}
          message={editedMessage}
          setEditedMessage={setEditedMessage}
          onSave={handleSave}
        />
      )}
    </>
  );
};
