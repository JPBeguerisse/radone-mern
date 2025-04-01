import React, { Dispatch, SetStateAction } from "react";

type UserContextType = {
  uid?: null;
  setUid: Dispatch<SetStateAction<any>>;
};

const UserContext = React.createContext<UserContextType | null>(null);

export default UserContext;
