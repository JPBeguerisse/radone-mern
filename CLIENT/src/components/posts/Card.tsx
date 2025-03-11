import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Post } from "src/types/post.types";

interface CardProps {
  post: Post;
  onOpen: (post: Post) => void;
}

export const Card: React.FC<CardProps> = ({ post, onOpen }) => {
  return (
    <div key={post._id} onClick={() => onOpen(post)} className="cursor-pointer">
      <img
        className="w-48 h-48 md:w-96 md:h-96 object-cover rounded-lg"
        src={
          post.picture
            ? `${process.env.REACT_APP_API_URL}/${post.picture.replace(
                /^\//,
                ""
              )}`
            : undefined
        }
        alt="post-picture"
      />
    </div>
  );
};
