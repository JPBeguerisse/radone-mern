import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AddPost = () => {
    const dispatch = useDispatch();
    
    const userData = useSelector((state: any ) => state.userReducer.user);
    if(!userData)
        return <p>Chargement</p>
    return (
        
        <div>
            <div className="user-picture">
                <img src={userData.picture}/>
            </div>
            <div className="user-info">
                <div className="user-name">
                    <h1>{userData.firstName} {userData.lastName}</h1>
                    <button>Modifier le profil</button>
                </div>
                <div className="user-bio">
                    <p>{userData.bio}</p>
                </div>
            </div>
        </div>
    );
};

export default AddPost;