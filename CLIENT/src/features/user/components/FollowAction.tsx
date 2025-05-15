// Description: Composant de gestion de l'action de suivre ou ne plus suivre un utilisateur
import React, { useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProfilUserContext, UserContext } from "../../../components/AppContext";
import { User } from "src/types/user.types";
import {
  followUserRequested,
  unfollowUserRequested,
} from "src/redux/reducers/user.reducer";
import { includesUser } from "src/utils/includesUser";
import { getUserByUsernameRequested } from "src/redux/reducers/viewed-user.reducer";

export interface FollowActionProps {
  followerId?: string;
  profilePage?: boolean;
  homePage?: boolean;
}

export const FollowAction: React.FC<FollowActionProps> = ({
  followerId,
  profilePage,
  homePage,
}) => {
  const userName = useContext(ProfilUserContext);
  const dispatch = useDispatch();
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;
  const currentUserData: User = useSelector(
    (state: any) => state.userReducer.user
  );

  const isInProfilePage = profilePage || false;

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
    if (userName) {
      dispatch(getUserByUsernameRequested(userName));
    }
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

    if (userName) {
      dispatch(getUserByUsernameRequested(userName));
    }
  }, [dispatch, currentUserUid, followerId]);

  // Vérifie si l'utilisateur est déjà suivi
  const isFollowing = includesUser(currentUserData?.following, followerId!);
  const isFollowedByViewedUser = includesUser(
    currentUserData?.followers,
    followerId!
  );

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
                : "text-gray-800 hover:text-gray-500"
            }`}
          >
            {isInProfilePage && <span className="mr-2">●</span>}
            Suivi(e)
          </p>
        )}
      {/* {currentUserData &&
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
        )} */}
      {currentUserData &&
      !isFollowing &&
      isFollowedByViewedUser &&
      !homePage ? (
        <p
          onClick={handleFollow}
          className={`cursor-pointer font-semibold ${
            isInProfilePage
              ? "bg-blue-500 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-600"
              : "text-gray-800 hover:text-gray-500"
          }`}
        >
          Suivre en retour
        </p>
      ) : (
        !isFollowing &&
        currentUserUid !== followerId && (
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
        )
      )}
    </div>
  );
};
