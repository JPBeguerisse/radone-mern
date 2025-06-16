import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { UserContext } from "src/components/AppContext";
import { PostsFollowing } from "src/components/home/PostsFollowing";
import { PostsForYou } from "src/components/home/PostsForYou";
import {
  getPostsByFollowingRequested,
  getPostsForYouRequested,
} from "src/redux/reducers/posts.reducer";
import { Post } from "src/types/post.types";

export const Home: React.FC = () => {
  const [tab, setTab] = useState("yourFollowing");
  const currentUserUid = useContext(UserContext)?.uid;
  const dispatch = useDispatch();
  const [forYouPosts, setForYouPosts] = useState<Post[]>([]);
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [loadingForYou, setLoadingForYou] = useState(false);
  const [loadingFollowingPosts, setLoadingFollowingPosts] = useState(false);
  const hasMoreForYou = useSelector(
    (state: any) => state.postsReducer.hasMoreForYou
  );
  const hasMoreFollowing = useSelector(
    (state: any) => state.postsReducer.hasMoreFollowingPosts
  );

  useEffect(() => {
    if (
      tab === "yourFollowing" &&
      !loadingFollowingPosts &&
      followingPosts.length === 0
    ) {
      setTab("forYou");
    }
  }, [followingPosts, loadingFollowingPosts, tab]);

  useEffect(() => {
    if (currentUserUid) {
      // Posts Following
      setLoadingFollowingPosts(true);
      dispatch(
        getPostsByFollowingRequested({
          userId: currentUserUid,
          skip: 0,
          limit: 5,
        })
      );
      // Posts For You
      setLoadingForYou(true);
      dispatch(
        getPostsForYouRequested({
          userId: currentUserUid,
          skip: 0,
          limit: 5,
        })
      );
    }
  }, [currentUserUid]);

  const postsState = useSelector((state: any) => state.postsReducer);

  useEffect(() => {
    setFollowingPosts(postsState.followingPosts);
    setForYouPosts(postsState.forYouPosts);
    setLoadingForYou(false);
    setLoadingFollowingPosts(false);
  }, [postsState.followingPosts, postsState.forYouPosts]);

  const loadMoreFollowingPosts = () => {
    if (!loadingFollowingPosts && hasMoreFollowing && currentUserUid) {
      // Vérifie si on n'est pas déjà en train de charger
      setTimeout(() => {
        dispatch(
          getPostsByFollowingRequested({
            userId: currentUserUid!,
            skip: followingPosts.length,
            limit: 5,
          })
        );
      }, 1000); // Simule un délai de chargement
      setLoadingFollowingPosts(true);
    }
  };

  const loadMoreForYouPosts = () => {
    if (!loadingForYou && hasMoreForYou && currentUserUid) {
      setTimeout(() => {
        dispatch(
          getPostsForYouRequested({
            userId: currentUserUid!,
            skip: forYouPosts.length,
            limit: 5,
          })
        );
      }, 1000); // Simule un délai de chargement
      setLoadingForYou(true);
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 px-4 h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 shadow-px-4 lg:pr-24 lg:pl-24 ">
          {followingPosts.length > 0 ? (
            <div className="flex gap-4 border-b-2 border-gray-200 pb-4 pt-2">
              <button
                className={` font-bold ${
                  tab === "forYou" ? "text-black" : "text-gray-500"
                }`}
                onClick={() => setTab("forYou")}
              >
                Pour vous
              </button>
              {}
              <button
                className={` font-bold ${
                  tab === "yourFollowing" ? "text-black" : "text-gray-500"
                }`}
                onClick={() => setTab("yourFollowing")}
              >
                Suivi(e)
              </button>
            </div>
          ) : (
            <div className="flex gap-4 border-b-2 border-gray-200 pb-4 pt-2">
              <button
                className={` font-bold ${
                  tab === "forYou" ? "text-black" : "text-gray-500"
                }`}
                onClick={() => setTab("forYou")}
              >
                Pour vous
              </button>
              {}
            </div>
          )}
        </div>
        {followingPosts.length === 0 && (
          <div className="bg-yellow-50 text-yellow-800 border border-yellow-300 rounded p-4 my-4 text-sm">
            <p>
              Vous ne suivez encore personne. Pour voir les publications de vos
              abonnements, commencez par suivre des utilisateurs.
            </p>
          </div>
        )}

        {/* Posts */}
        {tab === "yourFollowing" ? (
          <PostsFollowing
            key="following"
            posts={followingPosts}
            loading={loadingFollowingPosts}
            hasMore={hasMoreFollowing}
            loadMorePosts={loadMoreFollowingPosts}
          />
        ) : (
          <PostsForYou
            key="foryou"
            posts={forYouPosts}
            loading={loadingForYou}
            hasMore={hasMoreForYou}
            loadMorePosts={loadMoreForYouPosts}
          />
        )}
      </div>
    </div>
  );
};
