// Description : Modal qui affiche la liste des abonnés ("Followers") ou abonnements ("Following") d'un utilisateur
import React, { useContext, useEffect, useState } from "react";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";
import { UserContext } from "../../../components/AppContext";
import { useSelector } from "react-redux";
import { X } from "lucide-react";

export interface FollowModalProps {
  onClose: () => void; // Fonction pour fermer la modal
  title?: string; // Onglet actif : "followers" ou "following"
  onTitleChange: (title: string) => void; // Callback pour changer d’onglet
  page: "myProfile" | "viewedProfile"; // Page actuelle
}

const FollowListModal: React.FC<FollowModalProps> = ({
  onClose,
  title,
  onTitleChange,
  page,
}) => {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const userContext = useContext(UserContext);
  const currentUserUid = userContext?.uid;

  const viewedUser = useSelector((state: any) => state.viewedUserReducer.user);

  // Gère l'onglet sélectionné
  useEffect(() => {
    if (title === "followers") {
      setShowFollowers(true);
      setShowFollowing(false);
    } else if (title === "following") {
      setShowFollowers(false);
      setShowFollowing(true);
    }
  }, [title]);

  // Définit l’ID de l’utilisateur concerné selon la page affichée
  useEffect(() => {
    if (page === "myProfile" && currentUserUid) {
      setUserId(currentUserUid);
    } else if (page === "viewedProfile") {
      setUserId(viewedUser?._id || null);
    }
  }, [page, currentUserUid, viewedUser]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-4 max-h-[80vh] overflow-y-auto relative">
        {/*  Bouton pour fermer la modal */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 font-bold text-lg"
        >
          <X size={20} />
        </button>

        {/*  Sélecteur d'onglet (Followers / Following) */}
        <div className="flex justify-center gap-8 mt-2 mb-4">
          <button
            onClick={() => onTitleChange("followers")}
            className={`p-2 transition ${
              showFollowers && "text-black border-b-2 border-black font-bold"
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => onTitleChange("following")}
            className={`p-2 transition ${
              showFollowing && "text-black border-b-2 border-black font-bold"
            }`}
          >
            Following
          </button>
        </div>

        {/*  Contenu : Liste des abonnés ou abonnements */}
        <div className="max-h-[40vh] overflow-y-auto">
          {showFollowers && userId && (
            <FollowersList userId={userId} onClose={onClose} />
          )}
          {showFollowing && userId && (
            <FollowingList userId={userId} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
