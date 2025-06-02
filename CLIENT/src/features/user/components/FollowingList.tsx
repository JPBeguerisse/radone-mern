// Description: Composant qui affiche la liste des personnes que suit un utilisateur
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FollowAction } from "./FollowAction";
import { useFollowing } from "src/hooks/useFollowers";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserByUsernameRequested } from "../../../redux/reducers/viewed-user.reducer";

export interface FollowingListProps {
  onClose: () => void; // pour pouvoir fermer le modal aussi depuis ce composant
  userId: string;
}

const FollowingList: React.FC<FollowingListProps> = ({ onClose, userId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.userReducer.user);
  const [search, setSearch] = useState("");
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFollowing(userId!, 5, search);
  const containerRef = useRef<HTMLDivElement>(null);

  // Détection de fin de liste pour charger les pages suivantes
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

  // Fusionne toutes les pages
  const following = data?.pages.flatMap((page) => page.following) || [];

  const handleGoProfile = useCallback(
    (userName: string) => {
      if (userName === user.userName) {
        navigate("/my-profil");
      } else {
        navigate(`/profil/${userName}?tab=posts`);
        dispatch(getUserByUsernameRequested(userName));
      }
    },
    [user]
  );

  return (
    <div className="max-w-lg mx-auto p-4">
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : following.length > 0 ? (
        <>
          <input
            type="text"
            placeholder="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 border-2 border-gray-300"
          />
          <ul className="flex flex-col space-y-4">
            {following.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 rounded-lg transition duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2">
                    <img
                      src={`${
                        process.env.REACT_APP_API_URL
                      }/${user.picture?.replace(/^\//, "")}`}
                      alt="user"
                      className="w-full h-full rounded-full object-cover object-center"
                    />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => handleGoProfile(user.userName)}
                  >
                    <p className="font-semibold">{user.userName}</p>
                    <p className="text-sm">{user.name}</p>
                  </div>
                </div>
                <FollowAction followerId={user._id} profilePage={true} />
              </div>
            ))}

            {/* Détecteur de fin de liste */}
            {isFetchingNextPage && <p className="text-center">Chargement...</p>}
            <div ref={containerRef} className="h-10"></div>
          </ul>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-lg font-bold">
            Aucun utilisateur suivie pour l’instant.
          </p>
        </div>
      )}
    </div>
  );
};

export default FollowingList;
