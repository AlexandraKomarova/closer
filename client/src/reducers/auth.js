import {
  REGISTER_SUCCESS,
  //REGISTER_FAIL,
  USER_LOADED,
  //AUTH_ERROR,
  LOGIN_SUCCESS,
  //LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'), // default token in our state // fetches the token and puts it in the state
  isAuthenticated: null,
  loading: true, // we want to make sure we got a response from the backend 
  user: null // when we get a request to the backend to GET api/auth and we get the user data (name, email, etc) it'll get put in user
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload // set the user to the payload because payload includes the user ( everything but the password )
      };
    case REGISTER_SUCCESS:
      // localStorage.setItem("token", payload.token) @ QUESTION somehow I forgot where we send that payload - we send the payload when we get data from the back, we dispatch to the reducer in the action 
      // localStorage.setItem("token", token) happens in utils/setAuthToken.js
      return {
        ...state,
        ...payload, // @ QUESTION: why are we spreading ...payload and returning it?
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case ACCOUNT_DELETED:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    default:
      return state;
  }
}
