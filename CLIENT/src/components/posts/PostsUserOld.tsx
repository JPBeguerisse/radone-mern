import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Post } from "../../redux/types/post.types";

const PostsUser = () => {
  const posts = useSelector((state: any) => state.postsReducer.posts);
  const [isLoading, setIsLoading] = useState(true); // Gère l'état de chargement

  useEffect(() => {
    if (posts.length > 0) {
      setIsLoading(false);
    }
  }, [posts]);

  return (
    <div className="p-4">
      {/* {isLoading ? (
        <p className="text-center text-gray-500">Chargement des données...</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {posts && posts.length > 0 ? (
            <CardPostProfile />
          ) : (
            <p className="text-center">Aucun post</p>
          )}
        </div>
      )} */}
    </div>
  );
};

export default PostsUser;
