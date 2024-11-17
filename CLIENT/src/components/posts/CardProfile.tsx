import React from "react";
import { Post } from "../../redux/types/post.types";
import { useSelector } from "react-redux";

interface CardProfileProps {
  posts: Post[];
  openModal: (post: Post) => void;
}

const CardProfile: React.FC<CardProfileProps> = ({ posts, openModal }) => {
  const userData = useSelector((state: any) => state.userReducer.user);

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {posts && posts.length > 0 && userData ? (
        posts.some((post: Post) => post.posterId === userData._id) ? (
          posts.map(
            (post: Post) =>
              post.posterId === userData._id && (
                <div
                  key={post._id}
                  onClick={() => openModal(post)}
                  className="cursor-pointer"
                >
                  <img
                    className="w-48 h-48 md:w-96 md:h-96 object-cover rounded-lg"
                    src={
                      post.picture
                        ? `${
                            process.env.REACT_APP_API_URL
                          }${post.picture.replace(/^\//, "")}`
                        : undefined
                    }
                    alt="post-picture"
                  />
                </div>
              )
          )
        ) : (
          <p>Aucun post</p>
        )
      ) : (
        <p>Aucun post</p>
      )}
    </div>
  );
};

export default CardProfile;
