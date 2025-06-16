import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createCommentRequested } from "src/redux/reducers/posts.reducer";
import { AddCommentProps } from "src/types/post.types";
import { UserContext } from "../../../../components/AppContext";

export const FormAddComment: React.FC<AddCommentProps> = ({
  postId,
  commenterId,
}) => {
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;
  const dispatch = useDispatch();

  const [isAddComment, setIsAddComment] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Gère l'ajout d'un commentaire
  const handleAddPost = () => {
    if (!message) return;

    try {
      dispatch(
        createCommentRequested({
          _id: postId,
          commenterId: commenterId,
          text: message,
        })
      );
      setMessage("");
    } catch (error: any) {
      console.error("Erreur l'ajout du post :", error.message);
    }
  };

  // Vérifie si l'utilisateur est connecté
  useEffect(() => {
    if (currentUserUid) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });
  return (
    <div className="flex items-center w-full  p-2">
      {/* Champ de texte */}
      <textarea
        onChange={(e) => {
          setIsAddComment(true);
          setMessage(e.target.value);
        }}
        value={message}
        placeholder="Ajouter un commentaire..."
        className="flex-1 resize-none border-none outline-none bg-transparent text-gray-600 placeholder-gray-400 focus:ring-0"
        rows={1}
      ></textarea>

      {/* Bouton Publier */}
      <button
        onClick={handleAddPost}
        className={`ml-2 text-blue-500 font-semibold cursor-pointer ${
          !isAddComment || !message.trim() || !isLoggedIn
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-blue-700"
        }`}
        disabled={!isAddComment || !message.trim() || !isLoggedIn}
      >
        Publier
      </button>
    </div>
  );
};

export default FormAddComment;
