import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { User } from "../../types/user.types";
import NavProfil from "./NavProfil";
import { Post } from "src/types/post.types";
import { useNavigate } from "react-router-dom";
import { FollowAction } from "./FollowAction";

interface ProfilProps {
  userId?: string;
}

const ViewProfil: React.FC<ProfilProps> = ({ userId }) => {
  const users = useSelector((state: User) => state.usersReducer.users);
  const posts = useSelector((state: any) => state.postsReducer.posts);
  const [userData, setUserData] = useState<User>();

  const [postsUserLenght, setPostsUserLenght] = useState<number>(0);
  // const userData = users.find((user: User) => user._id === userId);
  //console.log("currentUserData", currentUserData);

  const navigate = useNavigate();
  useEffect(() => {
    if (posts && userId && posts.length > 0) {
      const countPost = posts.filter(
        (post: Post) => post.posterId === userId
      ).length;
      setPostsUserLenght(countPost);
    }
  }, [posts, userId]);

  useEffect(() => {
    if (userId && users.length > 0) {
      //extraire le user dans le state
      const user = users.find((user: User) => user._id === userId);
      setUserData(user); // Met à jour l'état avec les données de l'utilisateur
      if (!user) {
        navigate("/"); // Redirige vers la page d'accueil si l'utilisateur n'existe pas
      }
    }
  }, [userId, users, navigate]);

  //console.log("NB", postsUserLenght);

  if (!userId) {
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
            src={`${process.env.REACT_APP_API_URL}/${userData?.picture?.replace(
              /^\//,
              ""
            )}`}
            alt="user"
            className="w-full h-full rounded-full object-cover object-center"
          />
        </div>

        {/* Section des informations de l'utilisateur */}
        <div className="user-info flex flex-col space-y-4 text-center md:text-left">
          {/* Nom de l'utilisateur et bouton de modification */}
          <div className="user-name">
            <h1 className="text-2xl font-semibold">{userData?.userName} </h1>
            <button
              onClick={() => navigate("/edit-profil")}
              className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition duration-200"
            >
              Modifier le profil
            </button>
            {/* {userData?._id && <FollowAction followerId={userData._id!} />} */}
          </div>

          {/* Informations de suivi */}
          <div className="flex justify-between gap-4">
            <div className="user-post text-gray-600">
              <span className="font-bold text-lg">{postsUserLenght}</span>{" "}
              publications
            </div>
            <div className="user-follower text-gray-600">
              <span className="font-bold text-lg">
                {userData?.followers?.length}
              </span>{" "}
              Followers
            </div>
            <div className="user-following text-gray-600">
              <span className="font-bold text-lg">
                {userData?.following?.length}
              </span>{" "}
              Suivi(e)s
            </div>
          </div>

          {/* Biographie de l'utilisateur */}
          <div className="user-bio text-gray-700">
            <p className="font-bold text-black">{userData?.name}</p>
            <p>{userData?.bio}</p>
          </div>
        </div>
      </div>

      {/* Section des posts */}
      <div className="border-t-2 border-gray-300">
        <NavProfil />
      </div>
    </>
  );
};

export default ViewProfil;
