import React, { useContext, useEffect, useState } from "react";
import { Post } from "../../types/post.types";
import { useDispatch, useSelector } from "react-redux";
import { PostImgCard } from "./PostImgCard";
import { getPostRequested } from "../../redux/reducers/posts.reducer";
import { PostView } from "./PostView";
import { UserContext } from "../AppContext";
import { getPostsSavedRequested } from "src/redux/reducers/user.reducer";

const PostSaved = () => {
  const [isLoading, setIsLoading] = useState(true); // Gère l'état de chargement
  const [isOpen, setIsOpen] = useState<boolean>();
  const selectedPost = useSelector((state: any) => state.postsReducer.post);
  const savedPosts = useSelector((state: any) => state.userReducer.savedPosts);
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;

  const dispatch = useDispatch();

  // Lance une action pour récupérer les posts sauvegardés de l'utilisateur
  useEffect(() => {
    dispatch(getPostsSavedRequested(currentUserUid!));
  }, [currentUserUid, dispatch]);

  // Vérifie si les posts sauvegardés sont chargés
  useEffect(() => {
    if (savedPosts && savedPosts.length > 0) setIsLoading(false);
  }, [savedPosts]);

  // ouvrir le modal du post selectionné
  const handleOpenModal = (post: Post) => {
    setIsOpen(true);
    const postSelect = dispatch(getPostRequested(post._id!));
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
          {savedPosts && savedPosts.length > 0 ? (
            savedPosts.map((post: Post) => (
              <PostImgCard
                key={post._id}
                post={post}
                onOpen={handleOpenModal}
              />
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
