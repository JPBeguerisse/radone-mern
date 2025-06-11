// Description: Composant qui affiche la liste des abonnés d'un utilisateur avec recherche et scroll infini
import React, { useEffect, useRef, useState } from "react";
import { FollowingListProps } from "./FollowingList";
import { useFollowers } from "../../../hooks/useFollowers";
import { useNavigate } from "react-router-dom";
import { FollowAction } from "./FollowAction";
import { useDispatch, useSelector } from "react-redux";
import { getUserByUsernameRequested } from "src/redux/reducers/viewed-user.reducer";
import { useDebounce } from "use-debounce";

const FollowersList: React.FC<FollowingListProps> = ({ userId, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.userReducer.user);

  //  Recherche avec debounce
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  //  Récupération des followers avec scroll infini
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFollowers(userId!, 5, debouncedSearch);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //  Intersection Observer pour charger les pages suivantes automatiquement
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

  const followers = data?.pages.flatMap((page) => page.followers) || [];

  //  Navigue vers le profil (le sien ou celui d’un autre)
  const handleGoProfile = (userName: string) => {
    if (userName === currentUser.userName) {
      navigate("/my-profil");
    } else {
      navigate(`/profil/${userName}?tab=posts`);
      dispatch(getUserByUsernameRequested(userName));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 border-2 border-gray-300"
      />

      {/* Affichage conditionnel */}
      {isLoading ? (
        <p className="text-center">Chargement...</p>
      ) : followers.length > 0 ? (
        <>
          <ul className="flex flex-col space-y-4">
            {followers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 rounded-lg transition duration-300"
              >
                <div className="flex items-center gap-4">
                  {/* Photo de profil */}
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2">
                    <img
                      src={user.picture}
                      alt="user"
                      className="w-full h-full rounded-full object-cover object-center"
                    />
                  </div>

                  {/* Nom d'utilisateur cliquable */}
                  <div
                    className="cursor-pointer"
                    onClick={() => handleGoProfile(user.userName)}
                  >
                    <p className="font-semibold">{user.userName}</p>
                    <p className="text-sm text-gray-600">{user.name}</p>
                  </div>
                </div>

                {/* Bouton de follow/unfollow */}
                <FollowAction followerId={user._id} profilePage={true} />
              </div>
            ))}

            {/* Fin de liste - déclenche le scroll infini */}
            {isFetchingNextPage && <p className="text-center">Chargement...</p>}
            <div ref={containerRef} className="h-10" />
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

export default React.memo(FollowersList);
