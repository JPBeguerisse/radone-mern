import { PostHomeCard } from "src/features/post/components/card/PostHomeCard";
import { SuggestedUsers } from "./SuggestedUsers";
import { Post } from "src/types/post.types";
import { Loader } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../AppContext";
import { useSelector } from "react-redux";
import { getPostsForYouRequested } from "src/redux/reducers/posts.reducer";
import { User } from "src/types/user.types";

type Props = {
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
  loadMorePosts: () => void;
};

export const PostsForYou = ({
  posts,
  loading,
  hasMore,
  loadMorePosts,
}: Props) => {
  const currentUserUid = useContext(UserContext)?.uid;

  // Liste des utilisateurs pour filtrer les posts valides
  const users = useSelector((state: any) => state.usersReducer.users);

  console.log("users for you", users);

  // Référence à l'élément observé pour le scroll infini
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Ne garder que les posts dont le créateur existe dans `users`
  const filteredPosts =
    Array.isArray(users) && Array.isArray(posts)
      ? posts.filter((post: Post) =>
          users.some((user: User) => user._id === post.posterId)
        )
      : [];
  // Scroll infini grâce à Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [hasMore, loading, loadMorePosts]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:px-40">
      {/* Colonne principale contenant les posts */}

      <div className="w-full lg:w-2/3">
        {filteredPosts.map((post: Post) => (
          <PostHomeCard key={post._id} post={post} />
        ))}

        {/* Chargement */}
        {loading && (
          <div className="flex justify-center my-4">
            <Loader className="animate-spin text-gray-500" />
          </div>
        )}

        {/*  Fin des posts */}
        {!hasMore && !loading && (
          <p className="text-center text-gray-400 mt-4">
            Plus aucun post à afficher.
          </p>
        )}

        {/* Élément d’observation pour chargement automatique */}
        <div ref={sentinelRef} className="h-10" />
      </div>

      {/* Suggestions d'utilisateurs visibles si connecté */}
      {currentUserUid && <SuggestedUsers />}
    </div>
  );
};
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
