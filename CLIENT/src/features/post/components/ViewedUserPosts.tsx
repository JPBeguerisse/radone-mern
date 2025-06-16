// Description: Composant d'affichage des publications d'un utilisateur spécifique que l'on consulte
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../../types/post.types";
import { getPostRequested } from "../../../redux/reducers/posts.reducer";
import { getPostsByUserRequested } from "src/redux/reducers/viewed-user.reducer";
import { PostImageCard } from "./card/PostImageCard";
import { PostDetails } from "./PostDetails";
import { ProfilUserContext } from "../../../components/AppContext";

export const ViewedUserPosts: React.FC = () => {
  const dispatch = useDispatch();
  const userName = useContext(ProfilUserContext); // ✅ Nom d'utilisateur du profil consulté
  const postsUser = useSelector((state: any) => state.viewedUserReducer.posts);
  const selectedPost = useSelector((state: any) => state.postsReducer.post);

  const [isOpen, setIsOpen] = useState<boolean>(false); // ✅ Gère l'ouverture de la modale

  // ✅ Récupère les posts de l'utilisateur consulté
  useEffect(() => {
    if (userName) {
      dispatch(getPostsByUserRequested(userName));
    }
  }, [userName]);

  // ✅ Ouvre la modale avec le post sélectionné
  const handleOpenModal = (post: Post) => {
    setIsOpen(true);
    dispatch(getPostRequested(post._id!));
  };

  // ✅ Ferme la modale
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
        <p className="text-gray-400">Aucun post</p>
      )}

      {/* ✅ Modale pour afficher les détails du post */}
      {isOpen && selectedPost && (
        <PostDetails post={selectedPost} isOpen={isOpen} onClose={closeModal} />
      )}
    </div>
  );
};
