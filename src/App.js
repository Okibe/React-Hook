import React, { useContext } from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';

import { AuthContext } from './context/auth.context';

// import 'bootstrap/dist/css/bootstrap.min.css';

const App = props => {
  const authContext = useContext(AuthContext);

  let content = <Auth />;

  if (authContext.isAuth) {
    content = <Ingredients />;
  }
  return content;
};

export default App;
