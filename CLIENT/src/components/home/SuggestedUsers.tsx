import React, { useContext, useEffect } from "react";
import { UserContext } from "../AppContext";
import { useSelector } from "react-redux";
import { stat } from "fs";
import { User } from "src/types/user.types";
import { includesUser } from "src/utils/includesUser";
import { FollowAction } from "../../features/user/components/FollowAction";
import { Link } from "react-router-dom";

export const SuggestedUsers = () => {
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;
  const currentUser = useSelector((state: any) => state.userReducer.user);
  const users = useSelector((state: any) => state.usersReducer.users);
  const [suggestedUsersList, setSuggestedUsersList] = React.useState<User[]>(
    []
  );

  useEffect(() => {
    if (users && currentUser) {
      const notFollowed = users.filter(
        (user: User) =>
          user._id !== currentUserUid &&
          !includesUser(currentUser?.following, user._id)
      );

      const radomUsers = [...notFollowed].sort(() => Math.random() - 0.5); // Mélange le tableau
      setSuggestedUsersList(radomUsers.slice(0, 5)); // Prend les 5 premiers utilisateurs
    }
  }, [users, currentUser]);

  //   if (!users) {
  //     return (
  //       <p className="text-sm text-gray-400">Chargement des suggestions...</p>
  //     );
  //   }

  //   const suggestedUsersList = users.filter((user: User) => {
  //     // Exclure l'utilisateur actuel et les utilisateurs déjà suivis
  //     return (
  //       user._id !== currentUserUid &&
  //       !includesUser(currentUser?.following, user._id)
  //     );
  //   });

  return (
    <div className="w-full lg:w-1/3 p-4 hidden lg:block">
      <h2 className="text-lg font-bold mb-4">Suggestions</h2>
      <div className="space-y-4">
        {suggestedUsersList.map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            <Link
              to={`/profil/${user.userName}`}
              className="flex items-center gap-3"
            >
              <img
                src={`${process.env.REACT_APP_API_URL}/${user.picture?.replace(
                  /^\//,
                  ""
                )}`}
                alt={user.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{user.userName}</p>
                <p className="text-xs text-gray-400">{user.name}</p>
              </div>
            </Link>
            <FollowAction followerId={user._id} />
          </div>
        ))}
      </div>
    </div>
  );
};
