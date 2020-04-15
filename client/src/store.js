import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers'; // we call it index.js so we can just say from ./reducers
import setAuthToken from './utils/setAuthToken';

const initialState = {};

const middleware = [thunk]; // set to an array, we just only have one

const store = createStore( // takes in:
  rootReducer,
  initialState,
  // because we use redux-devtools-extension
  composeWithDevTools(applyMiddleware(...middleware)) // composeWithDevTool takes applyMiddleware which takes ...middleware that we created up above
);

// set up a store subscription listener
// to store the users token in localStorage

// prevent auth error on first run of subscription
let currentState = { auth: { token: null } };

store.subscribe(() => {
  // keep track of the previous and current state to compare changes
  let previousState = currentState;
  currentState = store.getState();
  // if the token changes set the value in localStorage and axios headers
  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState.auth.token;
    setAuthToken(token);
  }
});

export default store;
