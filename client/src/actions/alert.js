import { v4 as uuidv4 } from 'uuid'; // randomly generate id for the alerts
import { SET_ALERT, REMOVE_ALERT } from './types';

// => dispatch => is added so that we can dispatch multiple action type from one function
// we are able to do it because of the thunk middleware which we set up in store.js
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => { 
  const id = uuidv4();
  dispatch({ // dispatch calls the cases from the reducer
    type: SET_ALERT, 
    payload: { msg, alertType, id } // sends the payload, the info about the alert, whatever msg is passed, whatever alert is passed in
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};

// we have an action called setAlert()
// the action will be called from the component
// it'll dispatch SET_ALERT to the reducer 
// the reducer will add the alert to the state return [...state, payload]