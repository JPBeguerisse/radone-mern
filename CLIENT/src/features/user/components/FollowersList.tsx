// Description: Composant qui affiche la liste des abonnés d'un utilisateur
import React, { useEffect, useRef, useState } from "react";
import { FollowingListProps } from "./FollowingList";
import { useFollowers } from "../../../hooks/useFollowers";
import { useNavigate } from "react-router-dom";
import { FollowAction } from "./FollowAction";
import { useDispatch, useSelector } from "react-redux";
import { getUserByUsernameRequested } from "src/redux/reducers/viewed-user.reducer";

const FollowersList: React.FC<FollowingListProps> = ({ userId, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.userReducer.user);

  const [search, setSearch] = useState("");
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFollowers(userId!, 5, search);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const followers = data?.pages.flatMap((page) => page.followers) || [];

  const handleGoProfile = (userName: string) => {
    if (userName === user.userName) {
      navigate("/my-profil");
    } else {
      navigate(`/profil/${userName}?tab=posts`);
      dispatch(getUserByUsernameRequested(userName));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : followers.length > 0 ? (
        <>
          <input
            type="text"
            placeholder="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 border-2 border-gray-300"
          />
          <ul className="flex flex-col space-y-4">
            {followers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 rounded-lg transition duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2">
                    <img
                      src={user.picture}
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

export default FollowersList;
