// Description : Composant qui affiche la liste des personnes que suit un utilisateur (avec recherche et scroll infini)
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FollowAction } from "./FollowAction";
import { useFollowing } from "src/hooks/useFollowers";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserByUsernameRequested } from "../../../redux/reducers/viewed-user.reducer";
import { User } from "src/types/user.types";
import { useDebounce } from "use-debounce";
import { Loader } from "lucide-react";

export interface FollowingListProps {
  onClose: () => void;
  userId: string;
}

const FollowingList: React.FC<FollowingListProps> = ({ onClose, userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state: any) => state.userReducer.user);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  // 🔁 Récupération des utilisateurs suivis avec scroll infini
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFollowing(userId, 5, debouncedSearch);

  const containerRef = useRef<HTMLDivElement>(null);

  // 📦 Observer pour détecter le bas de la liste
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  // 📂 Fusion des pages paginées
  const following = data?.pages.flatMap((page) => page.following) || [];

  // 🔗 Accès au profil utilisateur
  const handleGoProfile = useCallback(
    (userName: string) => {
      if (userName === currentUser.userName) {
        navigate("/my-profil");
      } else {
        navigate(`/profil/${userName}?tab=posts`);
        dispatch(getUserByUsernameRequested(userName));
      }
    },
    [navigate, dispatch, currentUser.userName]
  );

  return (
    <div className="max-w-lg mx-auto sm:p-4">
      {/* 🔍 Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 border-2 border-gray-300"
      />

      {/* Affichage dynamique */}
      {isLoading ? (
        <Loader className="mx-auto my-4 animate-spin text-gray-500" />
      ) : following.length > 0 ? (
        <>
          <ul className="flex flex-col space-y-4">
            {following.map((user: User) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 rounded-lg transition duration-300"
              >
                {/* 📸 Image de profil */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2">
                    <img
                      src={user.picture}
                      alt="user"
                      className="w-full h-full rounded-full object-cover object-center"
                    />
                  </div>

                  {/* 🔗 Nom d'utilisateur cliquable */}
                  <div
                    className="cursor-pointer"
                    onClick={() => handleGoProfile(user.userName)}
                  >
                    <p className="font-semibold">{user.userName}</p>
                    <p className="text-sm text-gray-600">{user.name}</p>
                  </div>
                </div>

                {/* ✅ Bouton suivre/ne plus suivre */}
                <FollowAction followerId={user._id} profilePage={true} />
              </div>
            ))}

            {/* Détecteur de fin de liste pour chargement automatique */}
            {isFetchingNextPage && <p className="text-center">Chargement...</p>}
            <div ref={containerRef} className="h-10"></div>
          </ul>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-lg font-bold">
            Aucun utilisateur suivi pour l’instant.
          </p>
        </div>
      )}
    </div>
  );
};

export default FollowingList;
