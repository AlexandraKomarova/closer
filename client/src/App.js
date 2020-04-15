import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

// call loadUser() that hits GET api/auth and send the data (user) recieved from the back, user gets put in the state, token goes to local storage
// files to check: 
// routes/api/auth.js (back)
// middleware/auth.js (back)
// utils/setAuthToken.js (front)
// actions/auth.js (front)
// reducers/auth.js (front)

const App = () => {
  useEffect(() => {
    setAuthToken(localStorage.token);
    store.dispatch(loadUser()); // dispatch directly from the store
  }, []);

  return (
    // pass in the store to the Provider
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
