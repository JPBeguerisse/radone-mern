import React, { useContext, useEffect, useState } from "react";
import { Post } from "../../types/post.types";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "./Card";
import { getPostRequested } from "../../redux/reducers/posts.reducer";
import { PostView } from "./PostView";
import { UserContext } from "../AppContext";
import { usePostStatus } from "src/hooks/usePostStatus";

const PostSaved = () => {
  const posts = useSelector((state: any) => state.postsReducer.posts);
  const [isLoading, setIsLoading] = useState(true); // Gère l'état de chargement
  // const userData = useSelector((state: any) => state.userReducer.user);
  const [isOpen, setIsOpen] = useState<boolean>();
  const selectedPost = useSelector((state: any) => state.postsReducer.post);

  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;

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

  const savedPosts = posts?.filter((post: Post) =>
    post.savedBy?.includes(currentUserUid!)
  );

  return (
    <div className="p-4">
      {isLoading ? (
        <p className="text-center text-gray-500">Chargement des données...</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {savedPosts && savedPosts.length > 0 ? (
            savedPosts.map((post: Post) => (
              <Card key={post._id} post={post} onOpen={handleOpenModal} />
            ))
          ) : (
            <p>Aucun post liké</p>
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

export default PostSaved;
