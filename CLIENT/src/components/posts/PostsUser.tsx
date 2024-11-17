import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Post } from "../../redux/types/post.types";
import CardProfile from "./CardProfile";

const PostsUser = () => {
  const posts = useSelector((state: any) => state.postsReducer.posts);
  const [isLoading, setIsLoading] = useState(true); // Gère l'état de chargement
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const userData = useSelector((state: any) => state.userReducer.user);

  const openModal = (post: Post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  useEffect(() => {
    if (posts.length > 0) {
      setIsLoading(false);
    }
  }, [posts]);

  return (
    <div className="p-4">
      {isLoading ? (
        <p className="text-center text-gray-500">Chargement des données...</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {posts && posts.length > 0 ? (
            <CardProfile posts={posts} openModal={openModal} />
          ) : (
            <p className="text-center">Aucun post</p>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-sm md:max-w-lg w-full mx-4">
            <button
              onClick={closeModal}
              className="text-gray-500 font-bold text-lg mb-4 self-end"
            >
              X
            </button>
            <img
              className="w-full h-auto mb-4 rounded-lg"
              src={`${
                process.env.REACT_APP_API_URL
              }${selectedPost.picture.replace(/^\//, "")}`}
              alt="Post"
            />
            <div className="text-sm md:text-base">
              {userData._id === selectedPost.posterId && (
                <p className="mb-2">
                  <strong>Posté par :</strong> {userData.firstName}{" "}
                  {userData.lastName}
                </p>
              )}
              <p className="mb-2">
                <strong>Message :</strong> {selectedPost.message}
              </p>
              <p>
                <strong>Date :</strong> {selectedPost.createdAt}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsUser;
