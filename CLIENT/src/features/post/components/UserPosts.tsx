// Description: Composant d'affichage des publications de l'utilisateur connecté
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "src/types/post.types";
import {
  getPostRequested,
  updatePostRequested,
} from "src/redux/reducers/posts.reducer";
import { PostImageCard } from "./card/PostImageCard";
import { PostDetails } from "./PostDetails";
import { UserContext } from "../../../components/AppContext";
import { getPostsUserRequested } from "src/redux/reducers/user.reducer";

export const UserPosts: React.FC = () => {
  const userContext = React.useContext(UserContext);
  const currentUserUid = userContext?.uid;
  const postsUser = useSelector((state: any) => state.userReducer.posts);
  const [isOpen, setIsOpen] = useState<boolean>();
  const selectedPost = useSelector((state: any) => state.postsReducer.post);

  useEffect(() => {
    if (currentUserUid) {
      dispatch(getPostsUserRequested(currentUserUid));
    }
  }, [currentUserUid]);

  const [editedMessage, setEditedMessage] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
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
    setEditMode(false);
    setIsOpen(false);
  };

  const handleSave = () => {
    try {
      const updatedData = { message: editedMessage };
      dispatch(
        updatePostRequested({ _id: selectedPost?._id, data: updatedData })
      );
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du post :", error.message);
    }
    setEditMode(false);
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
        <PostDetails
          post={selectedPost}
          isOpen={isOpen}
          onClose={closeModal}
          message={editedMessage}
          setEditedMessage={setEditedMessage}
          isEditing={editMode}
          setIsEditing={setEditMode}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
