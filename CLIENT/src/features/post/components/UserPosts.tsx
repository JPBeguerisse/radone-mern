// Description: Composant d'affichage des publications de l'utilisateur connecté
import React, { useEffect, useState, useContext } from "react";
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
  const dispatch = useDispatch();
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;

  const postsUser = useSelector((state: any) => state.userReducer.posts);
  const selectedPost = useSelector((state: any) => state.postsReducer.post);

  const [isOpen, setIsOpen] = useState<boolean>(false); // Gère l'ouverture de la modale
  const [editedMessage, setEditedMessage] = useState<string>(""); // Contenu modifié du post
  const [editMode, setEditMode] = useState<boolean>(false); // Active/désactive le mode édition

  // Récupération des posts de l'utilisateur au chargement
  useEffect(() => {
    if (currentUserUid) {
      dispatch(getPostsUserRequested(currentUserUid));
    }
  }, [currentUserUid]);

  // Met à jour le message quand un post est sélectionné
  useEffect(() => {
    if (selectedPost) {
      setEditedMessage(selectedPost.message || "");
    }
  }, [selectedPost]);

  // Ouvre la modale et charge le post sélectionné
  const handleOpenModal = (post: Post) => {
    setIsOpen(true);
    dispatch(getPostRequested(post._id!));
  };

  // Ferme la modale et désactive le mode édition
  const closeModal = () => {
    setEditMode(false);
    setIsOpen(false);
  };

  // Sauvegarde la modification du message
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
      {/* Affiche les posts de l'utilisateur */}
      {postsUser && postsUser.length > 0 ? (
        postsUser.map((post: Post) => (
          <PostImageCard key={post._id} post={post} onOpen={handleOpenModal} />
        ))
      ) : (
        <p>Aucun post</p>
      )}

      {/* Modale d'affichage et édition du post */}
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
