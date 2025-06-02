import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProfilUserContext } from "src/components/AppContext";
import { getPostsByUser } from "src/services/postService";
import { Post } from "src/types/post.types";

export const useUserPosts = () => {
  const userName = useContext(ProfilUserContext);
  const posts = useSelector((state: any) => state.postsReducer.allPosts);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const posts = await getPostsByUser(userName!);
        setUserPosts(posts);
      } catch (error) {
        console.error("Erreur lors de la récupération des posts :", error);
      }
    };

    if (userName) {
      fetchUserPosts();
    }
  }, [userName]);

  return { userPosts };
};
