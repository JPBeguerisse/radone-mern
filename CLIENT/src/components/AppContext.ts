import React from "react";

type UserContextType = {
    uid: string;
  };
  

const UserContext = React.createContext<UserContextType | null>(null);

export default UserContext;