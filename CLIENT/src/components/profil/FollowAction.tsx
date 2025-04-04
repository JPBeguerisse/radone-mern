import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserContext from "../AppContext";
import { User } from "src/types/user.types";
import {
  followUserRequested,
  unfollowUserRequested,
} from "src/redux/reducers/user.reducer";
import { includesUser } from "src/utils/includesUser";

export interface FollowActionProps {
  followerId: string;
}

export const FollowAction: React.FC<FollowActionProps> = ({ followerId }) => {
  const dispatch = useDispatch();
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;
  const currentUserData: User = useSelector(
    (state: any) => state.userReducer.user
  );

  // Vérifie si l'utilisateur est déjà suivi
  const isFollowing = includesUser(currentUserData.following, followerId);
  return (
    <div>
      {currentUserData.following?.includes(followerId) &&
        currentUserUid! !== followerId && ( // Vérifie si l'utilisateur est déjà suivi
          // Si l'utilisateur est déjà suivi, affiche le bouton "Ne plus suivre"
          <p
            className="text-blue-500 cursor-pointer font-bold hover:text-blue-700"
            onClick={() => {
              dispatch(
                unfollowUserRequested({
                  userId: currentUserUid!,
                  userIdToUnfollow: followerId,
                })
              );
              console.log("Unfollow user:", followerId);
            }}
          >
            <span className="text-black text-sm mr-2">●</span>
            Ne plus suivre
          </p>
        )}
      {!currentUserData.following?.includes(followerId) &&
        currentUserUid! !== followerId && ( // Vérifie si l'utilisateur n'est pas déjà suivi
          // Si l'utilisateur n'est pas suivi, affiche le bouton "Suivre"
          <p
            className="text-blue-500 cursor-pointer font-bold hover:text-blue-700"
            onClick={() => {
              dispatch(
                followUserRequested({
                  userId: currentUserUid!,
                  userIdToFollow: followerId,
                })
              );
              console.log("Follow user:", followerId);
            }}
          >
            <span className="text-black text-sm mr-2">●</span>
            Suivre
          </p>
        )}
    </div>
  );
};
