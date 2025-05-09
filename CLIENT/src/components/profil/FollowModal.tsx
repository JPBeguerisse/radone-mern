import React, { useEffect, useState } from "react";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";

export interface FollowModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  onTitleChange: (title: string) => void;
}

const FollowModal: React.FC<FollowModalProps> = ({
  isOpen,
  onClose,
  title,
  onTitleChange,
}) => {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    if (title === "followers") {
      setShowFollowers(true);
      setShowFollowing(false);
    } else if (title === "following") {
      setShowFollowers(false);
      setShowFollowing(true);
    }
  }, [title]);

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
        {title && title === "followers" && <FollowersList />}
        {title && title === "following" && <FollowingList />}
      </div>
    </div>
  );
};

export default FollowModal;
