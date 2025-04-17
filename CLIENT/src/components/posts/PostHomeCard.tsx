import { formatDistanceToNow } from "date-fns";
import { fr, is } from "date-fns/locale";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "src/types/post.types";
import { User } from "src/types/user.types";
import PostButtonAction from "./PostButtonAction";
import { PostView } from "./PostView";
import { useNavigate } from "react-router-dom";
import { getUserByUsernameRequested } from "src/redux/reducers/viewed-user.reducer";

interface PostHomeCardProps {
  post: Post;
}

const PostHomeCard: React.FC<PostHomeCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.usersReducer.users);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleGoProfile = (userName: string) => {
    navigate(`/profil/${userName}?tab=posts`);
    dispatch(getUserByUsernameRequested(userName));
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-4 border-b border-gray-300 lg:w-1/2 lg:mx-auto">
        {users &&
          users.length > 0 &&
          users.map(
            (user: User) =>
              user._id === post.posterId && (
                <>
                  <div key={user._id} className="flex items-center gap-2">
                    <div className="flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-300 w-10 h-10 ">
                      <img
                        src={`${
                          process.env.REACT_APP_API_URL
                        }/${user?.picture?.replace(/^\//, "")}`}
                        alt="user"
                        className="w-full h-full rounded-full object-cover object-center"
                      />
                    </div>
                    <p
                      onClick={() => handleGoProfile(user.userName)}
                      className="text-sm font-semibold cursor-pointer hover:text-gray-600"
                    >
                      {user.userName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(post.createdAt!), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                  <div>
                    <img
                      className="w-full h-auto aspect-square object-cover rounded-lg sm:w-[468px] sm:h-[468px] cursor-pointer"
                      src={
                        post.picture
                          ? `${
                              process.env.REACT_APP_API_URL
                            }/${post.picture.replace(/^\//, "")}`
                          : "/placeholder.jpg" // 🔹 Ajoute une image par défaut si `post.picture` est vide
                      }
                      alt="post-picture"
                      onClick={handleOpenModal}
                    />
                  </div>
                  <div>
                    <PostButtonAction
                      post={post}
                      showComments={isCommentsOpen}
                      onOpenPostView={handleOpenModal} // passe la fonction pour ouvrir le modal
                    />
                  </div>
                  <div className="flex gap-2">
                    <p className="text-sm font-semibold">{user.userName}</p>
                    <p className="text-sm text-gray-500">{post.message}</p>
                  </div>
                  <div>
                    {post.comments?.length! > 0 && (
                      <p
                        onClick={handleOpenModal}
                        className="text-gray-400 text-sm cursor-pointer hover:text-gray-600"
                      >
                        Afficher les {post.comments?.length} commentaires
                      </p>
                    )}
                  </div>
                </>
              )
          )}
      </div>

      <PostView post={post} isOpen={isOpen} onClose={closeModal} />
    </>
  );
};

export default PostHomeCard;
