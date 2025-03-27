import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { User } from "../../types/user.types";
import NavProfil from "./NavProfil";
import { Post } from "src/types/post.types";

// Type de l'état global, qui inclut userReducer
// interface RootState {
//   userReducer: User;
// }

const ViewProfil = () => {
  const user = useSelector((state: User) => state.userReducer.user);
  const posts = useSelector((state: any) => state.postsReducer.posts);
  const [postsUserLenght, setPostsUserLenght] = useState<number>(0);

  useEffect(() => {
    if (posts && user && posts.length > 0) {
      const count = posts.filter(
        (post: Post) => post.posterId === user._id
      ).length;
      setPostsUserLenght(count);
    }
  }, [posts, user]);
  console.log("NB", postsUserLenght);

  if (!user) {
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
            src={`${process.env.REACT_APP_API_URL}${user.picture?.replace(
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
            <h1 className="text-2xl font-semibold">{user.userName} </h1>
            <button className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition duration-200">
              Modifier le profil
            </button>
          </div>

          {/* Informations de suivi */}
          <div className="flex justify-between gap-4">
            <div className="user-post text-gray-600">
              <span className="font-bold text-lg">{postsUserLenght}</span>{" "}
              publications
            </div>
            <div className="user-follower text-gray-600">
              <span className="font-bold text-lg">134</span> Followers
            </div>
            <div className="user-following text-gray-600">
              <span className="font-bold text-lg">134</span> Following
            </div>
          </div>

          {/* Biographie de l'utilisateur */}
          <div className="user-bio text-gray-700">
            <p className="font-bold text-black">{user.name}</p>
            <p>{user.bio} La vie c'est simple, c'est beau la vie 🖖🏽✨</p>
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
