import React, { useContext, useEffect, useState } from "react";
import UserPostsSaved from "../../post/components/UserPostsSaved";
import { ViewedUserPosts } from "../../post/components/ViewedUserPosts";
import { Bookmark, GalleryVerticalEnd } from "lucide-react";
import { UserContext } from "../../../components/AppContext";
import { useSearchParams } from "react-router-dom";
import { User } from "src/types/user.types";
import { UserPosts } from "../../post/components/UserPosts";

interface ProfileTabsProps {
  user: User;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ user }) => {
  const currentUserUid = useContext(UserContext)?.uid;
  const [postsUser, setPostsUser] = useState<boolean>(true);
  const [postsSavedByUser, setPostsSavedByUser] = useState<boolean>(false);

  // Pour récupérer les paramètres de recherche de l'URL
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  // console.log("userData", user);
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

        {user && user?._id === currentUserUid && (
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

      {postsUser &&
        (user && user._id === currentUserUid ? (
          <UserPosts />
        ) : (
          <ViewedUserPosts />
        ))}

      {postsSavedByUser && user._id === currentUserUid && <UserPostsSaved />}
    </div>
  );
};

export default ProfileTabs;
