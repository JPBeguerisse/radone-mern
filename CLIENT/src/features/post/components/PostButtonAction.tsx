import { Bookmark, Heart, MessageCircle } from "lucide-react";
import React, { useContext, useState } from "react";
import { Post } from "src/types/post.types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserContext } from "../../../components/AppContext";
import { useDispatch } from "react-redux";
import {
  unLikePostRequested,
  likePostRequested,
  savePostRequested,
  unSavePostRequested,
} from "src/redux/reducers/posts.reducer";
import { usePostStatus } from "src/hooks/usePostStatus";

interface PostButtonActionProps {
  post: Post;
  showComments: boolean;
  onToggleComments?: (value: boolean) => void;
  onOpenPostView?: () => void;
  isMobile?: boolean;
}

const PostButtonAction: React.FC<PostButtonActionProps> = ({
  post,
  showComments,
  onToggleComments,
  onOpenPostView,
  isMobile,
}) => {
  const dispatch = useDispatch();

  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;

  const { isLiked } = usePostStatus(post, currentUserUid!);
  const { isSaved } = usePostStatus(post, currentUserUid!);

  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const [showSaveWarning, setShowSaveWarning] = useState(false);

  // Gère l'action de like sur un post
  const handleLike = () => {
    if (!currentUserUid) {
      setShowLoginWarning(true);
      return;
    }
    dispatch(
      likePostRequested({
        postId: post._id!,
      })
    );
  };

  // Gère l'action de unlike sur un post
  const handleUnlike = () => {
    if (!currentUserUid) {
      return null; // Ne pas afficher le bouton si l'utilisateur n'est pas connecté
    }
    dispatch(
      unLikePostRequested({
        postId: post._id!,
      })
    );
  };

  // Gérer les favoris
  const handleSave = () => {
    if (!currentUserUid) {
      setShowSaveWarning(true);
      setTimeout(() => {
        setShowSaveWarning(false);
      }, 3000); // Le message disparaît après 3 secondes
      return;
    }
    dispatch(
      savePostRequested({
        postId: post._id!,
        userId: currentUserUid!,
      })
    );
  };

  // Gère l'action de un-save sur un post
  const handleUnsave = () => {
    if (!currentUserUid) {
      return null; // Ne pas afficher le bouton si l'utilisateur n'est pas connecté
    }
    dispatch(
      unSavePostRequested({
        postId: post._id!,
        userId: currentUserUid!,
      })
    );
  };

  return (
    <div>
      {/* Boutons d'action principaux */}
      <div className="flex justify-between">
        <div className="flex gap-2 mt-4 relative ">
          {isLiked ? (
            <button onClick={handleUnlike}>
              <Heart
                className="text-red-500 transition-all duration-200 ease-in-out"
                width={30}
                height={30}
                fill="currentColor"
              />
            </button>
          ) : (
            <button onClick={handleLike}>
              <Heart width={30} height={30} />
            </button>
          )}
          {/* Avertissement si non connecté */}
          {showLoginWarning && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow w-auto sm:max-w-[90vw] lg:w-max">
              Vous devez être connecté pour aimer cette publication.
            </div>
          )}

          {/* Bouton pour afficher les commentaires */}
          <button
            onClick={() => {
              onToggleComments && onToggleComments(!showComments);
              onOpenPostView && onOpenPostView(); // Ouvre le modal de la publication = handleOpenModal
            }}
          >
            <MessageCircle width={30} height={30} />
          </button>
        </div>
        {/* Bouton de sauvegarde */}
        <div className="relative">
          {isSaved ? (
            <div className="flex gap-2 mt-4 ">
              <Bookmark
                className="cursor-pointer text-black-500 transition-all duration-200 ease-in-out"
                width={30}
                height={30}
                fill="currentColor"
                onClick={
                  handleUnsave // Appelle la fonction pour retirer le post des favoris
                }
              />
            </div>
          ) : (
            <div className="flex gap-2 mt-4 relative">
              <Bookmark
                className="cursor-pointer"
                width={30}
                height={30}
                onClick={handleSave} // Appelle la fonction pour ajouter le post aux favoris
              />
            </div>
          )}

          {/* Avertissement si non connecté pour la sauvegarde */}
          {showSaveWarning && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow w-auto sm:max-w-[90vw] lg:w-max z-0">
              Vous devez être connecté pour enregistrer cette publication.
            </div>
          )}
        </div>
      </div>

      {/* Informations supplémentaires sur le post */}
      <div className="mt-2">
        {post.likers?.length && post.likers?.length > 0 ? (
          <p>{post.likers?.length} J'aime</p>
        ) : null}
        {isMobile && post.comments?.length! > 0 && (
          <p
            onClick={() => {
              onToggleComments && onToggleComments(!showComments);
              onOpenPostView && onOpenPostView(); // Ouvre le modal de la publication = handleOpenModal
            }}
            className="text-gray-400 text-sm"
          >
            Afficher les {post.comments?.length} commentaires
          </p>
        )}
        <p className="text-gray-400 text-sm">
          {format(new Date(post.createdAt!), "dd MMMM yyyy", {
            locale: fr,
          })}
        </p>
      </div>
    </div>
  );
};

export default PostButtonAction;
