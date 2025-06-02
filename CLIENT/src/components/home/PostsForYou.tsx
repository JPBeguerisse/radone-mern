// PostsForYou.tsx
import { PostHomeCard } from "src/features/post/components/card/PostHomeCard";
import { SuggestedUsers } from "./SuggestedUsers";
import { Post } from "src/types/post.types";
import { Loader } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../AppContext";
import { useSelector } from "react-redux";

export const PostsForYou = ({
  posts,
  loading,
  hasMore,
  loadMorePosts,
}: {
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
  loadMorePosts: () => void;
}) => {
  const currentUserUid = useContext(UserContext)?.uid;
  const users = useSelector((state: any) => state.usersReducer.users);
  const sentinelRef = useRef(null);

  const filteredPosts = posts.filter((post: Post) =>
    users.some((user: any) => user._id === post.posterId)
  );

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

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [hasMore, loading]);

  console.log("Posts For You:", filteredPosts);
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:px-40">
      <div className="w-full lg:w-2/3">
        {filteredPosts.map((post: Post) => (
          <PostHomeCard key={post._id} post={post} />
        ))}
        {loading && (
          <div className="flex justify-center my-4">
            <Loader className="animate-spin text-gray-500" />
          </div>
        )}
        {!hasMore && !loading && (
          <p className="text-center text-gray-400 mt-4">
            Plus aucun post à afficher.
          </p>
        )}
        <div ref={sentinelRef} className="h-10" /> {/* 👈 sentinelle */}
      </div>

      {currentUserUid && <SuggestedUsers />}
    </div>
  );
};
