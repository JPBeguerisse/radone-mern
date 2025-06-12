import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../../types/user.types";
import ProfileTabs from "./ProfileTabs";
import { Post } from "src/types/post.types";
import { useNavigate } from "react-router-dom";
import { FollowAction } from "./FollowAction";
import { ProfilUserContext } from "../../../components/AppContext";
import {
  getPostsByUserRequested,
  getUserByUsernameRequested,
} from "src/redux/reducers/viewed-user.reducer";
import FollowListModal from "./FollowListModal";

const ViewedProfileInfo: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useContext(ProfilUserContext);

  const viewedUser = useSelector((state: User) => state.viewedUserReducer.user);
  const postsUser = useSelector((state: any) => state.viewedUserReducer.posts);

  const [postsUserLenght, setPostsUserLenght] = useState<number>(0);
  const [openModalFollow, setOpenModalFollow] = useState(false);
  const [title, setTitle] = useState<string>();

  // Récupération des posts de l'utilisateur consulté
  useEffect(() => {
    if (userName) {
      dispatch(getPostsByUserRequested(userName!));
    }
  }, [userName, dispatch]);

  // Récupération des données de l'utilisateur consulté par son nom d'utilisateur
  useEffect(() => {
    if (userName) {
      dispatch(getUserByUsernameRequested(userName));
    }
  }, [userName, navigate]);

  // Calcul du nombre de posts de l'utilisateur consulté
  useEffect(() => {
    if (postsUser && viewedUser && postsUser.length > 0) {
      const countPost = postsUser.filter(
        (post: Post) => post.posterId === viewedUser._id
      ).length;
      setPostsUserLenght(countPost);
    }
  }, [postsUser, viewedUser]);

  // Fonction pour fermer la modale de suivi
  const handleCloseModal = useCallback(() => {
    setOpenModalFollow(false);
  }, []);

  // Vérification si l'utilisateur consulté est disponible
  if (!userName || !viewedUser) {
    // Si l'utilisateur n'est pas trouvé ou si les données de l'utilisateur ne sont pas disponibles, afficher un message de chargement
    return (
      <p className="text-center text-gray-500">Chargement des données...</p>
    );
  }

  return (
    <>
      <div className="profil-view flex flex-col md:flex-row items-center md:items-start p-5 m-5 bg-white shadow-lg rounded-lg max-w-4xl md:mx-auto  space-y-6 md:space-y-0 md:space-x-6">
        {/* Section de l'image de profil */}
        <div className="user-picture flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-300 w-24 h-24 md:w-36 md:h-36">
          <img
            src={viewedUser.picture}
            alt="user"
            className="w-full h-full  rounded-full object-cover object-center"
          />
        </div>

        {/* Section des informations de l'utilisateur */}
        <div className="user-info flex flex-col space-y-4 text-center md:text-left">
          {/* Nom de l'utilisateur et bouton de modification */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              {viewedUser?.userName}
            </h1>
            {viewedUser && (
              <FollowAction followerId={viewedUser._id!} profilePage={true} />
            )}
          </div>

          {/* Informations de suivi */}
          <div className="flex justify-between gap-4">
            <div className="user-post text-gray-600">
              <span className="font-bold text-lg">{postsUserLenght}</span>{" "}
              publications
            </div>
            <button
              className="user-follower text-gray-600 cursor-pointer"
              onClick={() => {
                setOpenModalFollow(true);
                setTitle("followers");
              }}
            >
              {" "}
              <span className="font-bold text-lg">
                {viewedUser?.followers?.length}
              </span>{" "}
              Followers
            </button>
            <div
              className="user-following text-gray-600 cursor-pointer"
              onClick={() => {
                setOpenModalFollow(true);
                setTitle("following");
              }}
            >
              <span className="font-bold text-lg">
                {viewedUser?.following?.length}
              </span>{" "}
              Suivi(e)s
            </div>
          </div>

          {/* Biographie de l'utilisateur */}
          <div className="user-bio text-gray-700">
            <p className="font-bold text-black">{viewedUser?.name}</p>
            <p>{viewedUser?.bio}</p>
          </div>
        </div>
      </div>

      {/* Section des posts */}
      <div className="border-t-2 border-gray-300">
        {/* Affichage des posts de l'utilisateur 
         Passer l'ID de l'utilisateur au composant NavProfil avec le contexte */}
        {/* <ProfilUserContext.Provider value={userId}> */}
        <ProfileTabs user={viewedUser} />
        {/* </ProfilUserContext.Provider> */}
      </div>
      {openModalFollow && (
        <FollowListModal
          title={title}
          onTitleChange={setTitle}
          onClose={handleCloseModal}
          page="viewedProfile"
        />
      )}
    </>
  );
};

export default ViewedProfileInfo;
