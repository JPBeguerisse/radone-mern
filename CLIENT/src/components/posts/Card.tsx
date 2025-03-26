import React from "react";
import { Post } from "src/types/post.types";

interface CardProps {
  post: Post;
  onOpen: (post: Post) => void;
}

export const Card: React.FC<CardProps> = ({ post, onOpen }) => {
  return (
    <div
      key={post._id}
      onClick={() => onOpen(post)}
      className="cursor-pointer overflow-hidden flex items-center justify-center w-32 h-32 md:w-80 md:h-80 rounded-lg bg-gray-200"
    >
      <img
        className="w-full h-full object-cover aspect-square rounded-lg"
        src={
          post.picture
            ? `${process.env.REACT_APP_API_URL}/${post.picture.replace(
                /^\//,
                ""
              )}`
            : "/placeholder.jpg" // 🔹 Ajoute une image par défaut si `post.picture` est vide
        }
        alt="post-picture"
      />
    </div>
  );
};
