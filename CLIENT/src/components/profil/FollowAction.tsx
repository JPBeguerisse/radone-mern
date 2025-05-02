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
            className="text-blue-500 cursor-pointer font-bold hover:text-blue-700"
            onClick={handleUnfollow}
          >
            <span className="text-black text-sm mr-2">●</span>
            Ne plus suivre
          </p>
        )}
      {currentUserData &&
        //!currentUserData.following?.includes(followerId!)
        !isFollowing &&
        currentUserUid! !== followerId && ( // Vérifie si l'utilisateur n'est pas déjà suivi
          // Si l'utilisateur n'est pas suivi, affiche le bouton "Suivre"
          <p
            className="text-blue-500 cursor-pointer font-bold hover:text-blue-700"
            onClick={handleFollow}
          >
            Suivre
          </p>
        )}
    </div>
  );
};
