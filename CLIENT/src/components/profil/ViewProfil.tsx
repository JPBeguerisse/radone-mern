import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProfilProps, User, UserState } from "../../types/user.types";
import NavProfil from "./NavProfil";
import { Post } from "src/types/post.types";
import { useNavigate } from "react-router-dom";
import { FollowAction } from "./FollowAction";
import { ProfilUserContext, UserContext } from "../AppContext";
import {
  getPostsByUserRequested,
  getUserByUsernameRequested,
} from "src/redux/reducers/viewed-user.reducer";

const ViewProfil: React.FC = () => {
  const userName = useContext(ProfilUserContext);
  const viewedUser = useSelector((state: User) => state.viewedUserReducer.user);
  const [postsUserLenght, setPostsUserLenght] = useState<number>(0);
  const postsUser = useSelector((state: any) => state.viewedUserReducer.posts);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userName) {
      dispatch(getPostsByUserRequested(userName!));
    }
  }, [userName, dispatch]);

  useEffect(() => {
    if (userName) {
      dispatch(getUserByUsernameRequested(userName));
    }
  }, [userName, navigate]);

  useEffect(() => {
    if (postsUser && viewedUser && postsUser.length > 0) {
      const countPost = postsUser.filter(
        (post: Post) => post.posterId === viewedUser._id
      ).length;
      setPostsUserLenght(countPost);
    }
  }, [postsUser, viewedUser]);

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
            src={`${
              process.env.REACT_APP_API_URL
            }/${viewedUser?.picture?.replace(/^\//, "")}`}
            alt="user"
            className="w-full h-full rounded-full object-cover object-center"
          />
        </div>

        {/* Section des informations de l'utilisateur */}
        <div className="user-info flex flex-col space-y-4 text-center md:text-left">
          {/* Nom de l'utilisateur et bouton de modification */}
          <div className="user-name">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              {viewedUser?.userName} <span className="text-sm">●</span>
            </h1>
            {viewedUser && <FollowAction followerId={viewedUser._id!} />}
          </div>

          {/* Informations de suivi */}
          <div className="flex justify-between gap-4">
            <div className="user-post text-gray-600">
              <span className="font-bold text-lg">{postsUserLenght}</span>{" "}
              publications
            </div>
            <div className="user-follower text-gray-600">
              <span className="font-bold text-lg">
                {viewedUser?.followers?.length}
              </span>{" "}
              Followers
            </div>
            <div className="user-following text-gray-600">
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
        <NavProfil user={viewedUser} />
        {/* </ProfilUserContext.Provider> */}
      </div>
    </>
  );
};

export default ViewProfil;
