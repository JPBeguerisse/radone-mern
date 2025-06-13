import { Loader, X } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useProfileFollowers } from "src/hooks/useFollowers";
import { getUserByUsernameRequested } from "src/redux/reducers/viewed-user.reducer";
import { FollowAction } from "../FollowAction";

type FollowersModalProps = {
  userId: string;
  userName?: string;
  onClose: () => void;
};

const FollowersModal = ({ userId, userName, onClose }: FollowersModalProps) => {
  const currentUser = useSelector((state: any) => state.userReducer.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: followers, isLoading, isError } = useProfileFollowers(userId);
  const handleGoProfile = (userName: string) => {
    if (userName === currentUser.userName) {
      navigate("/my-profil");
    } else {
      navigate(`/profil/${userName}?tab=posts`);
      dispatch(getUserByUsernameRequested(userName));
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-4 max-h-[80vh] overflow-y-auto relative">
        {/* Bouton de fermeture */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center border-b pb-2">
          Followers
        </h2>

        {isLoading && (
          <p className="flex items-center text-center text-sm text-gray-500">
            <Loader />
          </p>
        )}
        {isError && (
          <p className="text-center text-sm text-red-500">
            Erreur lors du chargement.
          </p>
        )}

        <div className="flex flex-col gap-3">
          <p className="text-center">
            Seul(e) {userName} peut voir tous les followers{" "}
          </p>
          {followers?.map((user) => (
            <div
              className="flex items-center justify-between p-2 rounded-lg transition"
              key={user._id}
            >
              <div key={user._id} className="flex items-center gap-3">
                <img
                  src={user.picture}
                  alt={user.userName}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span
                  onClick={() => handleGoProfile(user.userName)}
                  className="cursor-pointer text-sm font-medium"
                >
                  {user.userName}
                </span>
              </div>
              <div>
                <FollowAction followerId={user._id} profilePage={true} />
              </div>
            </div>
          ))}

          {followers?.length === 0 && (
            <p className="text-center text-gray-400 text-sm">
              Aucun followers pour le moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
