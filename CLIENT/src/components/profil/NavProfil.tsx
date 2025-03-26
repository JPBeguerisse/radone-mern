import React, { useState } from "react";
import { useSelector } from "react-redux";
// import PostsUser from "../posts/PostsUserOld";
import PostSaved from "../posts/PostSaved";
import { PostsUser } from "../../components/posts/PostsUser";
import { Bookmark, GalleryVerticalEnd } from "lucide-react";

const NavProfil = () => {
  const [postsUser, setPostsUser] = useState<boolean>(true);
  const [postsSavedByUser, setPostsSavedByUser] = useState<boolean>(false);

  const posts = useSelector((state: any) => state.postsReducer.pots);

  const handleModals = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;

    if (target.id === "posts-user") {
      setPostsUser(true);
      setPostsSavedByUser(false);
    } else if (target.id === "posts-saved-user") {
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
      </div>

      {postsUser && <PostsUser />}
      {postsSavedByUser && <PostSaved />}
    </div>
  );
};

export default NavProfil;
