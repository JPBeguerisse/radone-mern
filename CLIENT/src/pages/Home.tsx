import React, { useEffect } from "react";
import NavBar from "../components/layout/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PostHomeCard from "src/components/posts/PostHomeCard";

export const Home: React.FC = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state: any) => state.postsReducer.posts);
  const error = useSelector((state: any) => state.postsReducer.error);

  const [loadPosts, setLoadPosts] = React.useState(false);

  if (!posts || posts.length === 0) {
    return (
      <p className="text-center text-gray-500">Chargement des données...</p>
    );
  }
  return (
    <div className="p-8">
      {posts &&
        posts.map((post: any) => <PostHomeCard key={post._id} post={post} />)}
    </div>
  );
};
