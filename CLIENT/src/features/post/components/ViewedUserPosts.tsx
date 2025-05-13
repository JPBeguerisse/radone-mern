// Description: Composant d'affichage des publications d'un utilisateur spécifique  que l'on consulte
import React, { useContext, useEffect, useState } from "react";
import { Post } from "../../../types/post.types";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePostRequested,
  getPostRequested,
  getPostsRequested,
  updatePostRequested,
  updatePostSuccess,
} from "../../../redux/reducers/posts.reducer";
import { PostDetails } from "./PostDetails";
import { PostImageCard } from "./card/PostImageCard";
import { User } from "src/types/user.types";
import { ProfilUserContext } from "../../../components/AppContext";
import { api } from "src/api/api";
import { getPostsByUser } from "src/services/postService";
import { useUserPosts } from "src/hooks/useUserPosts";
import { getPostsByUserRequested } from "src/redux/reducers/viewed-user.reducer";

//Ce composant affiche les posts d'un utilisateur spécifique qu'on est en train de consulter

interface PostsUserProps {
  userId?: string;
}

export const ViewedUserPosts: React.FC<PostsUserProps> = () => {
  const userName = useContext(ProfilUserContext);
  const postsUser = useSelector((state: any) => state.viewedUserReducer.posts);
  const [isOpen, setIsOpen] = useState<boolean>();
  const selectedPost = useSelector((state: any) => state.postsReducer.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userName) {
      dispatch(getPostsByUserRequested(userName!));
    }
  }, [userName]);

  const handleOpenModal = (post: Post) => {
    setIsOpen(true);
    //lancer une action pour récupérer le post
    dispatch(getPostRequested(post._id!));
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-0.5 justify-center">
      {postsUser && postsUser.length > 0 ? (
        postsUser.map((post: Post) => (
          <PostImageCard key={post._id} post={post} onOpen={handleOpenModal} />
        ))
      ) : (
        <p>Aucun post</p>
      )}

      {isOpen && selectedPost && (
        <PostDetails post={selectedPost} isOpen={isOpen} onClose={closeModal} />
      )}
    </div>
  );
};
