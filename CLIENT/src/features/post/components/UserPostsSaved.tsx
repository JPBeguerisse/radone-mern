// Description: Composant d'affichage des publications sauvegardées de l'utilisateur connecté
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../../types/post.types";
import { PostImageCard } from "./card/PostImageCard";
import { PostDetails } from "./PostDetails";
import { UserContext } from "../../../components/AppContext";
import {
  getPostRequested,
  // updatePostRequested (si édition possible dans l'avenir)
} from "../../../redux/reducers/posts.reducer";
import { getPostsSavedRequested } from "src/redux/reducers/user.reducer";

const UserPostsSaved = () => {
  const dispatch = useDispatch();
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;

  const savedPosts = useSelector((state: any) => state.userReducer.savedPosts);
  const selectedPost = useSelector((state: any) => state.postsReducer.post);

  const [isLoading, setIsLoading] = useState(true); // État de chargement initial
  const [isOpen, setIsOpen] = useState<boolean>(false); //  État d'ouverture de la modale

  //  Récupère les posts sauvegardés au montage
  useEffect(() => {
    if (currentUserUid) {
      dispatch(getPostsSavedRequested(currentUserUid));
    }
  }, [currentUserUid, dispatch]);

  //  Met fin au chargement quand les posts sont disponibles
  useEffect(() => {
    if (savedPosts && savedPosts.length >= 0) {
      setIsLoading(false);
    }
  }, [savedPosts]);

  //  Ouvre la modale et charge le post sélectionné
  const handleOpenModal = (post: Post) => {
    setIsOpen(true);
    dispatch(getPostRequested(post._id!));
  };

  //  Ferme la modale
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {isLoading ? (
        <p className="text-center text-gray-500">Chargement des données...</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {savedPosts && savedPosts.length > 0 ? (
            savedPosts.map((post: Post) => (
              <PostImageCard
                key={post._id}
                post={post}
                onOpen={handleOpenModal}
              />
            ))
          ) : (
            <p className="text-gray-400">Aucun post sauvegardé</p>
          )}
        </div>
      )}

      {/*  Modale d'affichage du post */}
      {isOpen && selectedPost && (
        <PostDetails post={selectedPost} isOpen={isOpen} onClose={closeModal} />
      )}
    </div>
  );
};

export default UserPostsSaved;
