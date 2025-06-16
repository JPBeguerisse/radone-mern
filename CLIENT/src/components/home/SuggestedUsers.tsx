import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../AppContext";
import { useSelector } from "react-redux";
import { User } from "src/types/user.types";
import { includesUser } from "src/utils/includesUser";
import { FollowAction } from "../../features/user/components/FollowAction";
import { Link } from "react-router-dom";

export const SuggestedUsers = () => {
  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;

  const currentUser = useSelector((state: any) => state.userReducer.user);
  const users = useSelector((state: any) => state.usersReducer.users);

  const [suggestedUsersList, setSuggestedUsersList] = useState<User[]>([]);

  // Mémorise la suggestion initiale pour éviter le recalcul à chaque rendu
  const initialSuggestions = useRef<User[]>([]);

  useEffect(() => {
    // Si les suggestions ne sont pas encore générées et que les données sont disponibles
    if (
      initialSuggestions.current.length === 0 &&
      users &&
      currentUser &&
      currentUser.following
    ) {
      // Exclut l'utilisateur actuel et ceux qu'il suit déjà
      const notFollowed = users.filter(
        (user: User) =>
          user._id !== currentUserUid &&
          !includesUser(currentUser.following, user._id)
      );

      // Mélange les utilisateurs restants aléatoirement
      const randomUsers = [...notFollowed].sort(() => Math.random() - 0.5);

      // Sélectionne les 5 premiers pour les suggestions
      const selected = randomUsers.slice(0, 5);

      // Stocke les suggestions initiales pour éviter les recalculs
      initialSuggestions.current = selected;

      // Met à jour l'état local
      setSuggestedUsersList(selected);
    }
  }, [users, currentUser, currentUserUid]);

  return (
    <div className="w-full lg:w-1/3 p-4 hidden lg:block">
      <h2 className="text-lg font-bold mb-4">Suggestions</h2>

      <div className="space-y-4">
        {suggestedUsersList.map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            {/* Affiche l'utilisateur suggéré */}
            <Link
              to={`/profil/${user.userName}`}
              className="flex items-center gap-3"
            >
              <img
                src={user.picture}
                alt={user.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{user.userName}</p>
                <p className="text-xs text-gray-400">{user.name}</p>
              </div>
            </Link>

            {/* Bouton suivre */}
            <FollowAction followerId={user._id} homePage={true} />
          </div>
        ))}
      </div>
    </div>
  );
};
