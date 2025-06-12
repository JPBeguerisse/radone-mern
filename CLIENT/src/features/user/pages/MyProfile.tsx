// Description : Composant qui affiche le profil de l'utilisateur connecté

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserContext } from "src/components/AppContext";
import FollowListModal from "src/features/user/components/FollowListModal";
import ProfileTabs from "src/features/user/components/ProfileTabs";

import { Post } from "src/types/post.types";
import { User } from "src/types/user.types";

export const MyProfile: React.FC = () => {
  const navigate = useNavigate();

  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;
  const postsUser = useSelector((state: any) => state.userReducer.posts);
  const user = useSelector((state: User) => state.userReducer.user);

  const [openModalFollow, setOpenModalFollow] = useState(false);
  const [postsUserLenght, setPostsUserLenght] = useState<number>(0);
  const [title, setTitle] = useState<string>();

  // Calcule le nombre de publications
  useEffect(() => {
    if (postsUser && user && postsUser.length > 0) {
      const countPost = postsUser.filter(
        (post: Post) => post.posterId === user._id
      ).length;
      setPostsUserLenght(countPost);
    }
  }, [postsUser, user]);

  // Ferme la modale
  const handleCloseModal = useCallback(() => {
    setOpenModalFollow(false);
  }, []);

  if (!user) {
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
            src={user.picture}
            alt="user"
            className="w-full h-full rounded-full object-cover object-center"
          />
        </div>

        {/* Section des informations de l'utilisateur */}
        <div className="user-info flex flex-col space-y-4 text-center md:text-left">
          {/* Nom de l'utilisateur et bouton de modification */}
          <div className="lg:flex lg:items-center lg:justify-between">
            <h1 className="text-2xl font-semibold">{user?.userName} </h1>
            {
              /* Vérifie si l'utilisateur est connecté et s'il s'agit de son propre profil */
              currentUserUid && currentUserUid === user._id && (
                // Si l'utilisateur est connecté et que c'est son propre profil, afficher le bouton de modification
                <button
                  onClick={() => navigate("/edit-profil")}
                  className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition duration-200"
                >
                  Modifier le profil
                </button>
              )
            }
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
              <span className="font-bold text-lg">
                {user?.followers?.length}
              </span>{" "}
              Followers
            </button>

            {/* stats */}
            <div
              className="user-following text-gray-600 cursor-pointer"
              onClick={() => {
                setOpenModalFollow(true);
                setTitle("following");
              }}
            >
              <span className="font-bold text-lg">
                {user?.following?.length}
              </span>{" "}
              Suivi(e)s
            </div>
          </div>

          {/* Biographie de l'utilisateur */}
          <div className="user-bio text-gray-700">
            <p className="font-bold text-black">{user?.name}</p>
            <p>{user?.bio}</p>
          </div>
        </div>
      </div>

      {/* Section des posts */}
      <div className="border-t-2 border-gray-300">
        {/* Affichage des posts de l'utilisateur 
         Passer l'ID de l'utilisateur au composant NavProfil avec le contexte */}
        {/* <ProfilUserContext.Provider value={userId}> */}
        <ProfileTabs user={user} />
        {/* </ProfilUserContext.Provider> */}
      </div>
      {/* Modal pour afficher la liste des followers et des personnes suivies */}
      {openModalFollow && (
        <FollowListModal
          title={title}
          onTitleChange={setTitle}
          onClose={handleCloseModal}
          page="myProfile"
        />
      )}
    </>
  );
};
