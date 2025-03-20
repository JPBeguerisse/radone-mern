import { useState } from "react";
import { useDispatch } from "react-redux";
import { createCommentRequested } from "src/redux/reducers/posts.reducer";
import { AddCommentProps } from "src/types/post.types";

export const FormAddComment: React.FC<AddCommentProps> = ({
  postId,
  commenterId,
}) => {
  const [isAddComment, setIsAddComment] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const dispatch = useDispatch();
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
        className={`ml-2 text-blue-500 font-semibold ${
          !isAddComment || !message.trim()
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-blue-700"
        }`}
        disabled={!isAddComment || !message.trim()}
      >
        Publier
      </button>
    </div>
  );
};

export default FormAddComment;
