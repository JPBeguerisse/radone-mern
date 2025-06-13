import React, { useContext, useEffect, useRef } from "react";
import { UserContext } from "../AppContext";
import { PostHomeCard } from "src/features/post/components/card/PostHomeCard";
import { useSelector } from "react-redux";
import { SuggestedUsers } from "./SuggestedUsers";
import { Post } from "src/types/post.types";
import { Loader } from "lucide-react";
import { User } from "src/types/user.types";

type Props = {
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
  loadMorePosts: () => void;
};

export const PostsFollowing = ({
  posts,
  loading,
  hasMore,
  loadMorePosts,
}: Props) => {
  const currentUserUid = useContext(UserContext)?.uid;

  // tous les utilisateurs présents en Redux
  const users = useSelector((state: any) => state.usersReducer.users);

  // Ne garder que les posts dont l'auteur est connu
  const filteredPosts = posts.filter((post: Post) =>
    users.some((user: User) => user._id === post.posterId)
  );

  // Intersection Observer pour le scroll infini
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [hasMore, loading, loadMorePosts]);

  console.log("posts", posts);

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 lg:px-40">
        {/* Colonne principale des posts */}

        <div className="w-full lg:w-2/3">
          {filteredPosts.map((post) => (
            <PostHomeCard key={post._id} post={post} />
          ))}

          {/* Chargement en cours */}
          {loading && (
            <div className="flex justify-center my-4">
              <Loader className="animate-spin text-gray-500" />
            </div>
          )}

          {/* Fin de liste */}
          {!hasMore && posts.length > 0 && (
            <p className="text-center text-gray-400 mt-4">
              Plus aucun post à afficher.
            </p>
          )}

          {/* Élément observé pour détecter le scroll */}
          <div ref={sentinelRef} className="h-10" />
        </div>

        {/* Suggestions visibles uniquement si connecté */}
        {currentUserUid && <SuggestedUsers />}
      </div>
    </div>
  );
};
