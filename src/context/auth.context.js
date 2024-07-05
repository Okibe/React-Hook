import React, { useState } from 'react';

export const AuthContext = React.createContext({
  auth: false,
  login: () => {},
});

const AuthContextProvider = props => {
  const [isAuthenticated, setIsAuthenitcated] = useState(false);

  const loginHandler = () => {
    setIsAuthenitcated(true);
  };
  return (
    <AuthContext.Provider
      value={{ login: loginHandler, isAuth: isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
