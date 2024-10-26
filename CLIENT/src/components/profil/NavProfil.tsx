import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PostsUser from '../posts/PostsUser';
import PostLikedUser from '../posts/PostLikedUser';

const NavProfil = () => {
    const [postsUserModal, setPostsUserModal] = useState<boolean>(true);
    const [postsLikedUserModal, setPostsLikedUserModal] = useState<boolean>(false);

    const posts = useSelector((state :any)=> state.postsReducer.pots);

    const handleModals = (e: React.MouseEvent<HTMLLIElement>) => {
        const target = e.target as HTMLElement;

        if(target.id === "posts-user"){
            setPostsUserModal(true);
            setPostsLikedUserModal(false)
        }else if (target.id === "posts-liked-user") {
            setPostsUserModal(false);
            setPostsLikedUserModal(true)
        }
    }

    return (
        <div>
            <ul>
                <li onClick={handleModals} id="posts-user" className={postsUserModal ? "active-btn" : undefined} >Mes posts</li>
                <li onClick={handleModals} id="posts-liked-user" className={postsLikedUserModal ? "active-btn" : undefined}>Posts likés</li>
            </ul>
            {postsUserModal && <PostsUser/>}
            {postsLikedUserModal && <PostLikedUser/>}
        </div>
    );
};

export default NavProfil;