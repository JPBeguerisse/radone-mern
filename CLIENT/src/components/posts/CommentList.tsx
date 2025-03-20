import { Heart, Trash2 } from "lucide-react";
import React, { useContext } from "react";
import { Post } from "src/types/post.types";
import { User } from "src/types/user.types";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import UserContext from "../AppContext";
interface CommentListProps {
  post: Post;
  usersData: User[];
  onDelete: (commentId: string, type: "post" | "comment") => void;
}

const CommentList: React.FC<CommentListProps> = ({
  post,
  usersData,
  onDelete,
}) => {
  const currentUserUid = useContext(UserContext);

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

  return (
    <div className="flex-1 overflow-auto p-2 gap-4">
      {post && post.comments?.length! > 0 ? (
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
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <p className="font-bold">
                        {user.firstName} {user.lastName}
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
                        <p className="text-xs text-gray-400">3 J'aime</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Heart
                        className="cursor-pointer"
                        width={15}
                        height={15}
                      />
                      {currentUserUid?.toString() === comment.commenterId && (
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
          )
        )
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
