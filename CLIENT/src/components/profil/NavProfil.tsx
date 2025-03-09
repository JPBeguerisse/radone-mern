import React, { useState } from "react";
import { useSelector } from "react-redux";
// import PostsUser from "../posts/PostsUserOld";
import PostLikedUser from "../posts/PostLikedUser";
import { PostsUser } from "../../components/posts/PostsUser";

const NavProfil = () => {
  const [postsUserModal, setPostsUserModal] = useState<boolean>(true);
  const [postsLikedUserModal, setPostsLikedUserModal] =
    useState<boolean>(false);

  const posts = useSelector((state: any) => state.postsReducer.pots);

  const handleModals = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;

    if (target.id === "posts-user") {
      setPostsUserModal(true);
      setPostsLikedUserModal(false);
    } else if (target.id === "posts-liked-user") {
      setPostsUserModal(false);
      setPostsLikedUserModal(true);
    }
  };

  return (
    <div>
      <div className="flex gap-4 items-center justify-center">
        <button
          onClick={handleModals}
          id="posts-user"
          className={`p-3 transition duration-300 ${
            postsUserModal && "text-black border-t-2 border-black font-bold"
          } `}
        >
          Mes posts
        </button>

        <button
          onClick={handleModals}
          id="posts-liked-user"
          className={`p-3 transition duration-300 ${
            postsLikedUserModal &&
            "text-black border-t-2 border-black font-bold"
          } `}
        >
          Posts likés
        </button>
      </div>

      {postsUserModal && <PostsUser />}
      {postsLikedUserModal && <PostLikedUser />}
    </div>
  );
};

export default NavProfil;
