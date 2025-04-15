import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import PostsUser from "../posts/PostsUserOld";
import PostSaved from "../posts/PostSaved";
import { PostsUser } from "../../components/posts/PostsUser";
import { Bookmark, GalleryVerticalEnd } from "lucide-react";
import { ProfilUserContext, UserContext } from "../AppContext";
import { useSearchParams } from "react-router-dom";
import { User } from "src/types/user.types";

const NavProfil: React.FC = () => {
  const userName = useContext(ProfilUserContext);
  const currentUserUid = useContext(UserContext)?.uid;
  const users = useSelector((state: User) => state.usersReducer.users);
  const [userData, setUserData] = useState<User>();

  const [postsUser, setPostsUser] = useState<boolean>(true);
  const [postsSavedByUser, setPostsSavedByUser] = useState<boolean>(false);
  //const posts = useSelector((state: any) => state.postsReducer.pots);

  useEffect(() => {
    if (userName && users.length > 0) {
      //extraire le user dans le state
      const user = users.find((user: User) => user.userName === userName);
      setUserData(user); // Met à jour l'état avec les données de l'utilisateur
    }
  }, [userName, users]);

  // Pour récupérer les paramètres de recherche de l'URL
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (tab === "posts") {
      setPostsUser(true);
      setPostsSavedByUser(false);
    } else if (tab === "saved") {
      setPostsUser(false);
      setPostsSavedByUser(true);
    }
  }, [tab]);

  const handleModals = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;

    if (target.id === "posts-user") {
      setSearchParams({ tab: "posts" });
      setPostsUser(true);
      setPostsSavedByUser(false);
    } else if (target.id === "posts-saved-user") {
      setSearchParams({ tab: "saved" });
      setPostsUser(false);
      setPostsSavedByUser(true);
    }
  };

  return (
    <div>
      <div className="flex gap-4 items-center justify-center">
        <button
          onClick={handleModals}
          id="posts-user"
          className={`p-3 transition duration-300 flex items-center gap-3  ${
            postsUser && "text-black border-t-2 border-black font-bold"
          } `}
        >
          <GalleryVerticalEnd width={15} height={15} />
          Publications
        </button>

        {userData?._id === currentUserUid && (
          <button
            onClick={handleModals}
            id="posts-saved-user"
            className={`p-3 transition duration-300 flex items-center gap-2 ${
              postsSavedByUser && "text-black border-t-2 border-black font-bold"
            } `}
          >
            <Bookmark width={15} height={15} />
            Enregistrements
          </button>
        )}
      </div>

      {postsUser && <PostsUser />}

      {postsSavedByUser && userData?._id === currentUserUid && <PostSaved />}
    </div>
  );
};

export default NavProfil;
