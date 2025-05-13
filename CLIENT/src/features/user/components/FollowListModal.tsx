// Modal qui affiche la liste des abonnés et des abonnements d'un utilisateur
import React, { useContext, useEffect, useState } from "react";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";
import { UserContext } from "../../../components/AppContext";
import { useSelector } from "react-redux";

export interface FollowModalProps {
  onClose: () => void;
  title?: string;
  onTitleChange: (title: string) => void;
  page: "myProfile" | "viewedProfile";
}

const FollowListModal: React.FC<FollowModalProps> = ({
  onClose,
  title,
  onTitleChange,
  page,
}) => {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;
  const viewedUser = useSelector((state: any) => state.viewedUserReducer.user);
  useEffect(() => {
    if (title === "followers") {
      setShowFollowers(true);
      setShowFollowing(false);
    } else if (title === "following") {
      setShowFollowers(false);
      setShowFollowing(true);
    }
  }, [title]);

  useEffect(() => {
    if (page === "myProfile" && currentUserUid) {
      // Si on est sur la page de profil de l'utilisateur connecté, on utilise son ID
      setUserId(currentUserUid!);
    } else if (page === "viewedProfile") {
      // Si on est sur la page de profil consulté, on utilise l'ID de l'utilisateur consulté
      setUserId(viewedUser?._id);
    }
  }, [page, currentUserUid, viewedUser]);

  return (
    <div className="fixed inset-0 overflow-auto bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md p-8">
        <button
          onClick={onClose}
          className="text-gray-500 font-bold text-lg z-20"
        >
          ✖
        </button>
        <div className="flex items-center p-4 gap-8">
          <button
            className={`p-3 transition duration-300 flex items-center gap-3  ${
              showFollowers && "text-black border-b-2 border-black font-bold"
            } `}
            onClick={() => onTitleChange("followers")}
          >
            Followers
          </button>
          <button
            className={`p-3 transition duration-300 flex items-center gap-3  ${
              showFollowing && "text-black border-b-2 border-black font-bold"
            } `}
            onClick={() => onTitleChange("following")}
          >
            Following
          </button>
        </div>
        <div className="max-h-[40vh] overflow-y-auto">
          {title && title === "followers" && userId && (
            <FollowersList userId={userId} onClose={onClose} />
          )}
          {title && title === "following" && userId && (
            <FollowingList userId={userId!} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
