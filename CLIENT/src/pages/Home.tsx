import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PostHomeCard } from "../features/post/components/card/PostHomeCard";
import { getPostsRequested } from "src/redux/reducers/posts.reducer";
import { SuggestedUsers } from "src/components/home/SuggestedUsers";
import { UserContext } from "src/components/AppContext";

export const Home: React.FC = () => {
  const dispatch = useDispatch();
  const currentUserUid = useContext(UserContext)?.uid;
  const posts = useSelector((state: any) => state.postsReducer.posts);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 5;

  const loadMorePosts = () => {
    setLoading(true);
    dispatch(getPostsRequested({ skip: posts.length, limit }));
    setTimeout(() => {
      setLoading(false);
      if (posts.length % limit !== 0) {
        setHasMore(false); // Si le nombre de posts récupérés n'est pas un multiple de la limite, il n'y a plus de posts à charger
      }
    }, 1000); // petit délai pour simuler l'attente
  };

  useEffect(() => {
    // Charger les 1ers posts
    if (posts.length === 0) {
      dispatch(getPostsRequested({ skip: 0, limit }));
    }

    // Gérer le scroll infini
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [posts, loading, hasMore]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 lg:px-40">
        {/* Section principale avec les posts */}
        <div className="w-full lg:w-2/3">
          <div className=" border-b-2 border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-left mt-4 ">
              Fil d'actualité
            </h1>
          </div>

          {posts &&
            posts.map((post: any) => (
              <PostHomeCard key={post._id} post={post} />
            ))}
        </div>

        {/* Section de suggestion (visible seulement sur desktop) */}
        {currentUserUid && <SuggestedUsers />}
      </div>
      {!hasMore && (
        <p className="text-center text-gray-400 mt-4">
          Vous avez atteint la fin.
        </p>
      )}
    </div>
  );
};
