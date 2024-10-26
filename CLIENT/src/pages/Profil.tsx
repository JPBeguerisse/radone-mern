import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../actions/users/user";
import ViewProfil from "../components/profil/ViewProfil";

  
const Profil: React.FC = () => {
 const dispatch = useDispatch();

//  useEffect(() => {
//    dispatch({ type: "GET_USERS_REQUESTED" });
//  }, [dispatch]);

//  const users = useSelector((state: any ) => state.usersReducer.users);
//  console.log(users);
 return (
   <div className="main">
     <ViewProfil/>
   </div>
 );
};

export default Profil;
