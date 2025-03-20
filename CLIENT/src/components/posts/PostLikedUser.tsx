import React, { useEffect, useState } from "react";
import { Post } from "../../types/post.types";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "./Card";
import { getPostRequested } from "../../redux/reducers/posts.reducer";
import { PostView } from "./PostView";

const PostLikedUser = () => {
  const posts = useSelector((state: any) => state.postsReducer.posts);
  const [isLoading, setIsLoading] = useState(true); // Gère l'état de chargement
  const userData = useSelector((state: any) => state.userReducer.user);
  const [isOpen, setIsOpen] = useState<boolean>();
  const selectedPost = useSelector((state: any) => state.postsReducer.post);

  const dispatch = useDispatch();
  useEffect(() => {
    if (posts.length > 0) setIsLoading(false);
  }, [posts]);

  const handleOpenModal = (post: Post) => {
    setIsOpen(true);
    const postSelect = dispatch(getPostRequested(post._id!));
    console.log("POST ", postSelect);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <p className="text-center text-gray-500">Chargement des données...</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {posts && posts.length > 0 ? (
            posts.some(
              (post: Post) => post.likers && post.likers.includes(userData._id)
            ) ? (
              posts.map(
                (post: Post) =>
                  post.likers &&
                  post.likers.includes(userData._id) && (
                    <Card key={post._id} post={post} onOpen={handleOpenModal} />
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

      {isOpen && selectedPost && (
        <PostView
          post={selectedPost}
          isOpen={isOpen}
          onClose={closeModal}
          //currentUser={userData}
        />
      )}
    </div>
  );
};

export default PostLikedUser;
