import React, { useEffect, useState } from "react";
import { Post } from "../../redux/types/post.types";
import { useSelector } from "react-redux";

const PostLikedUser = () => {
  const userData = useSelector((state: any) => state.userReducer.user);
  const userDataError = useSelector((state: any) => state.userReducer.error);
  const posts = useSelector((state: any) => state.postsReducer.posts);
  const [isLoading, setIsLoading] = useState(true); // Gère l'état de chargement

  useEffect(() => {
    if ((userData && posts && posts.length > 0) || userDataError) {
      setIsLoading(false);
    }
  }, [userData, posts, userDataError]);
  return (
    <div>
      {isLoading ? (
        <p>Chargement des données...</p>
      ) : (
        <div className="">
          {posts && posts.length > 0 ? (
            posts.some((post: Post) => post.likers.includes(userData._id)) ? (
              posts.map(
                (post: Post) =>
                  post.likers.includes(userData._id) && (
                    <div key={post._id}>
                      <p>{post.message}</p>
                    </div>
                  )
              )
            ) : (
              <p>Aucun post liké</p>
            )
          ) : (
            <p>Aucun post</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostLikedUser;
