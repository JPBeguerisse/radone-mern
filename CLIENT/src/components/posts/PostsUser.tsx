import React, { useContext, useEffect, useState } from "react";
import { Post } from "../../types/post.types";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePostRequested,
  getPostRequested,
  getPostsRequested,
  updatePostRequested,
  updatePostSuccess,
} from "../../redux/reducers/posts.reducer";
import { PostView } from "./PostView";
import { PostImgCard } from "./PostImgCard";
import { User } from "src/types/user.types";
import { ProfilUserContext } from "../AppContext";
import { api } from "src/api/api";
import { getPostsByUser } from "src/services/postService";
import { useUserPosts } from "src/hooks/useUserPosts";
import { getPostsByUserRequested } from "src/redux/reducers/viewed-user.reducer";

interface PostsUserProps {
  userId?: string;
}

export const PostsUser: React.FC<PostsUserProps> = () => {
  const userName = useContext(ProfilUserContext);
  const postsUser = useSelector((state: any) => state.viewedUserReducer.posts);
  const [isOpen, setIsOpen] = useState<boolean>();
  const selectedPost = useSelector((state: any) => state.postsReducer.post);

  useEffect(() => {
    if (userName) {
      dispatch(getPostsByUserRequested(userName!));
    }
  }, [userName]);

  const [editedMessage, setEditedMessage] = useState<string>("");
  const dispatch = useDispatch();

  const handleOpenModal = (post: Post) => {
    setIsOpen(true);
    //lancer une action pour récupérer le post
    dispatch(getPostRequested(post._id!));
    //console.log("POST ", postSelect);
  };

  useEffect(() => {
    if (selectedPost) {
      setEditedMessage(selectedPost.message || ""); // ✅ Met à jour `editedMessage` quand Redux change
    }
  }, [selectedPost]);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-0.5 justify-center">
      {postsUser && postsUser.length > 0 ? (
        postsUser.map((post: Post) => (
          <PostImgCard key={post._id} post={post} onOpen={handleOpenModal} />
        ))
      ) : (
        <p>Aucun post</p>
      )}

      {isOpen && selectedPost && (
        <PostView
          post={selectedPost}
          isOpen={isOpen}
          onClose={closeModal}
          message={editedMessage}
          setEditedMessage={setEditedMessage}
        />
      )}
    </div>
  );
};
