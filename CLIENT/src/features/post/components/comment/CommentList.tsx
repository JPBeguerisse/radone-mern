import { Heart, Trash2 } from "lucide-react";
import React, { useCallback, useContext, useState } from "react";
import { Comment, Post } from "src/types/post.types";
import { User } from "src/types/user.types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { UserContext } from "../../../../components/AppContext";
import { useDispatch, useSelector } from "react-redux";
import {
  likeCommentRequested,
  unLikeCommentRequested,
} from "src/redux/reducers/posts.reducer";
import { useNavigate } from "react-router-dom";
import { getUserByUsernameRequested } from "src/redux/reducers/viewed-user.reducer";

interface CommentListProps {
  post: Post;
  usersData: User[];
  onDelete: (commentId: string, type: "post" | "comment") => void;
  onClose: () => void; // pour pouvoir fermer le modal aussi depuis ce composant
}

const CommentList: React.FC<CommentListProps> = ({
  post,
  usersData,
  onDelete,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.userReducer.user);
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;
  const [loginWarning, setLoginWarning] = useState<{ [key: string]: boolean }>(
    {}
  );

  const MAX_LENGTH = 100;
  const [isExpandedText, setIsExpandedText] = React.useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpandedText = (commentId: string) => {
    setIsExpandedText((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId], // ✅ Change uniquement l'état du commentaire cliqué
    }));
  };

  const handleLikeComment = useCallback(
    (postId: string, comment: Comment, userId: string) => {
      if (!currentUserUid) {
        setLoginWarning((prev) => ({ ...prev, [comment._id]: true })); //
        // setTimeout(() => {
        //   setLoginWarning((prev) => ({ ...prev, [comment._id]: false }));
        // }, 3000); // Le message disparaît après 3 secondes
        return;
      }
      dispatch(
        likeCommentRequested({
          postId: postId!,
          commentId: comment._id,
          userId: userId!,
        })
      );
    },
    [currentUserUid]
  );

  const handleUnlikeComment = useCallback(
    (postId: string, comment: Comment, userId: string) => {
      dispatch(
        unLikeCommentRequested({
          postId: postId!,
          commentId: comment._id,
          userId: userId!,
        })
      );
    },
    [currentUserUid] // relancer la fonction si currentUserUid change sinon on ne relance pas la fonction
  );

  const handleGoProfile = (userName: string) => {
    if (userName === user.userName) {
      navigate("/my-profil");
    } else {
      navigate(`/profil/${userName}?tab=posts`);
      dispatch(getUserByUsernameRequested(userName));
    }
  };

  return (
    <div className="flex-1 overflow-auto p-2 gap-4">
      {post && post.comments?.length! > 0 ? (
        post.comments?.map((comment) => {
          // const isLiked = includesUser(comment.likers, currentUserUid!)
          return usersData.map(
            (user: User) =>
              user._id === comment.commenterId && (
                <div key={user._id} className="flex gap-4 mb-4 relative">
                  <div className="">
                    <img
                      src={user.picture}
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <p
                        className="font-bold cursor-pointer"
                        onClick={() => handleGoProfile(user.userName!)}
                      >
                        {user.userName}
                      </p>
                      <p className="text-gray-800">
                        {isExpandedText[comment._id] ||
                        comment.text.length <= MAX_LENGTH
                          ? comment.text // ✅ Affiche le texte complet si le bouton est cliqué
                          : `${comment.text.substring(0, MAX_LENGTH)}...`}{" "}
                        {/* ✅ Tronque le texte */}
                      </p>
                      {/* ✅ Afficher "Voir plus" seulement si le texte est trop long */}
                      {comment.text.length > MAX_LENGTH && (
                        <button
                          onClick={() => toggleExpandedText(comment._id)}
                          className="text-gray-700 font-semibold hover:underline text-sm mt-1"
                        >
                          {isExpandedText[comment._id]
                            ? "Voir moins"
                            : "Voir plus"}
                        </button>
                      )}
                      <div className="flex gap-2">
                        <p className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(comment.timestamp!), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {comment.likers && comment.likers?.length > 0 && (
                            <span>{comment.likers.length} J'aime</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 relative">
                      {currentUserUid &&
                        (comment.likers?.includes(currentUserUid) ? (
                          <Heart
                            className="text-red-500 transition-all duration-200 ease-in-out"
                            width={15}
                            height={15}
                            fill="currentColor"
                            onClick={() =>
                              handleUnlikeComment(
                                post._id!,
                                comment,
                                currentUserUid!
                              )
                            }
                          />
                        ) : (
                          <Heart
                            className="cursor-pointer"
                            width={15}
                            height={15}
                            onClick={() =>
                              handleLikeComment(
                                post._id!,
                                comment,
                                currentUserUid!
                              )
                            }
                          />
                        ))}
                      {/* Afficher le bouton de suppression seulement si l'utilisateur est le propriétaire du commentaire */}
                      {currentUserUid &&
                        currentUserUid === comment.commenterId && (
                          <button
                            onClick={() => onDelete(comment._id, "comment")}
                          >
                            <Trash2
                              className="cursor-pointer"
                              width={15}
                              height={15}
                            />
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              )
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-lg font-bold">Aucun commentaire pour l’instant.</p>
          <p className="text-gray-400 text-sm">Lancer la conversation.</p>
        </div>
      )}
    </div>
  );
};

export default CommentList;
