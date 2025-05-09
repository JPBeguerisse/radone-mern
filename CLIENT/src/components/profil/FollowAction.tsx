import React, { useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProfilUserContext, UserContext } from "../AppContext";
import { User } from "src/types/user.types";
import {
  followUserRequested,
  unfollowUserRequested,
} from "src/redux/reducers/user.reducer";
import { includesUser } from "src/utils/includesUser";
import { getUserByUsernameRequested } from "src/redux/reducers/viewed-user.reducer";

export interface FollowActionProps {
  followerId?: string;
}

export const FollowAction: React.FC<FollowActionProps> = ({ followerId }) => {
  const userName = useContext(ProfilUserContext);
  const dispatch = useDispatch();
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;
  const currentUserData: User = useSelector(
    (state: any) => state.userReducer.user
  );

  const isInProfilePage = !!userName;

  const handleFollow = useCallback(() => {
    // Vérifie si l'utilisateur est connecté
    if (!currentUserUid || !followerId) {
      return null; // Ne pas afficher le bouton si l'utilisateur n'est pas connecté
    }
    dispatch(
      followUserRequested({
        userId: currentUserUid!,
        userIdToFollow: followerId!,
      })
    );
    dispatch(getUserByUsernameRequested(userName!));
  }, [dispatch, currentUserUid, followerId]);

  const handleUnfollow = useCallback(() => {
    // Vérifie si l'utilisateur est connecté
    if (!currentUserUid || !followerId) {
      return null; // Ne pas afficher le bouton si l'utilisateur n'est pas connecté
    }
    dispatch(
      unfollowUserRequested({
        userId: currentUserUid!,
        userIdToUnfollow: followerId!,
      })
    );
    dispatch(getUserByUsernameRequested(userName!));
  }, [dispatch, currentUserUid, followerId]);

  // Vérifie si l'utilisateur est déjà suivi
  const isFollowing = includesUser(currentUserData?.following, followerId!);
  return (
    <div>
      {currentUserData &&
        isFollowing &&
        currentUserUid! !== followerId && ( // Vérifie si l'utilisateur est déjà suivi
          // Si l'utilisateur est déjà suivi, affiche le bouton "Ne plus suivre"
          <p
            onClick={handleUnfollow}
            className={`cursor-pointer font-semibold ${
              isInProfilePage
                ? "bg-gray-200 text-black px-4 py-1 rounded-md text-sm hover:bg-gray-300"
                : "text-blue-500 hover:text-blue-700"
            }`}
          >
            {isInProfilePage && <span className="mr-2">●</span>}
            Ne plus suivre
          </p>
        )}
      {currentUserData &&
        //!currentUserData.following?.includes(followerId!)
        !isFollowing &&
        currentUserUid! !== followerId && ( // Vérifie si l'utilisateur n'est pas déjà suivi
          // Si l'utilisateur n'est pas suivi, affiche le bouton "Suivre"
          <p
            onClick={handleFollow}
            className={`cursor-pointer font-semibold ${
              isInProfilePage
                ? "bg-blue-500 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-600"
                : "text-blue-500 hover:text-blue-700"
            }`}
          >
            Suivre
          </p>
        )}
    </div>
  );
};
