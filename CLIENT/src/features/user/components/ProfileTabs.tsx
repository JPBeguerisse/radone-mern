// Description : Composant qui gère l’affichage des onglets "Publications" et "Enregistrements" sur une page de profil
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GalleryVerticalEnd, Bookmark } from "lucide-react";

import { User } from "src/types/user.types";
import { UserContext } from "../../../components/AppContext";
import { UserPosts } from "../../post/components/UserPosts";
import UserPostsSaved from "../../post/components/UserPostsSaved";
import { ViewedUserPosts } from "../../post/components/ViewedUserPosts";

interface ProfileTabsProps {
  user: User;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ user }) => {
  const currentUserUid = useContext(UserContext)?.uid;

  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  // Met à jour le state local quand l'URL change
  useEffect(() => {
    if (tab === "saved" && user._id === currentUserUid) {
      setActiveTab("saved");
    } else {
      setActiveTab("posts");
    }
  }, [tab, currentUserUid, user._id]);

  // Change l’onglet et met à jour l’URL
  const handleTabChange = (newTab: "posts" | "saved") => {
    setSearchParams({ tab: newTab });
    setActiveTab(newTab);
  };

  return (
    <div>
      {/* Onglets */}
      <div className="flex gap-4 items-center justify-center border-b">
        <button
          onClick={() => handleTabChange("posts")}
          className={`p-3 flex items-center gap-2 transition duration-300 ${
            activeTab === "posts" &&
            "text-black border-t-2 border-black font-bold"
          }`}
        >
          <GalleryVerticalEnd width={15} height={15} />
          Publications
        </button>

        {user._id === currentUserUid && (
          <button
            onClick={() => handleTabChange("saved")}
            className={`p-3 flex items-center gap-2 transition duration-300 ${
              activeTab === "saved" &&
              "text-black border-t-2 border-black font-bold"
            }`}
          >
            <Bookmark width={15} height={15} />
            Enregistrements
          </button>
        )}
      </div>

      {/* Affichage du contenu selon l’onglet sélectionné */}
      {activeTab === "posts" &&
        (user._id === currentUserUid ? <UserPosts /> : <ViewedUserPosts />)}

      {activeTab === "saved" && user._id === currentUserUid && (
        <UserPostsSaved />
      )}
    </div>
  );
};

export default ProfileTabs;
