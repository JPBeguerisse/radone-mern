import React from 'react';
import { useSelector } from 'react-redux';
import { User } from '../../actions/users/user';
import NavProfil from './NavProfil';

// Type de l'état global, qui inclut userReducer
interface RootState {
    userReducer: User;
}

const ViewProfil = () => {
    const userData = useSelector((state: any) => state.userReducer.user);
    if (!userData) {
        return <p>Chargement des données...</p>;
    }

    return (
        <>
        <div className="profil-view">
            <div className="user-picture">
            <img src={`${process.env.REACT_APP_API_URL}${userData.picture.replace(/^\//, '')}`} alt="user" />
            </div>
            <div className="user-info">
                <div className="user-name">
                    <h1>{userData.firstName} {userData.lastName}</h1>
                    <button>Modifier le profil</button>
                </div>
                <div className="user-followers">
                    <div className="user-post">
                        4 publications
                    </div>
                    <div className="user-follower">
                        134 Followers
                    </div>
                    <div className="user-following">
                        134 Following
                    </div>
                </div>
                <div className="user-bio">
                    {userData.bio}La vie c'est simple, c'est beau la vie🖖🏽✨
                </div>
            </div> 
        </div>
        <div className="posts-user-container">
            <NavProfil/>
        </div>
        </>
    );
};

export default ViewProfil;