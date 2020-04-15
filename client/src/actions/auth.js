import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
} from './types';

// load user hits GET api/auth
export const loadUser = () => async dispatch => {
  // in the video Brad checks for the token in the the local storage and pass it to setAuthToken:
  // if (localStorage.token) setAuthToken(localStorage.token)
  // and the same will be done in App.js

  // in this version:

  // check utils/setAuthToken.js. It checks for the token ( @ QUESTION: where does it check? in the back? ) If there is one, puts in the global headers, sets in in the local storage.  If there is none, removes it from the headers and from local storage.
  // and in App.js they don't check for token, they setAuthToken(localStorage.token) in useEffect. So when the App Component loads they check for the token and set it in the headers and in local storage 

  // If there is a token in the local storage we always want to send it. ( @ QUESTION: send it where? to the state? to the front? )
  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// register user
export const register = ({ name, email, password }) => async dispatch => {
  // need to create config object with headers because we are sending data 
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({ 
      type: REGISTER_SUCCESS, 
      payload: res.data 
    });
    
    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));

    dispatch({ 
      type: REGISTER_FAIL 
    });
  }
};

// login user // only 2 fields, so no object {}
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout / Clear Profile
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
