import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];
// alerts are gonna be objects in this array. They'll look like this: 

// {
//   id: 1,
//   msg: 'Please log in',
//   alertType: 'succes'
// }

// that way in our alert component we can decide which color the alert is going to be

// the funtion takes any piece of state that has to do with alerts and an action. The action will be dispatched from the actions file
// set state = initialState by default
// the action is gonna contain two things: type (mandatory) and payload (data), (sometimes you won't have it)
export default function(state = initialState, action) {
  const { type, payload } = action;

  // evaluate the type with switch statement 
  switch (type) {
    case SET_ALERT:
      // state is immutable, so we have to include any state that's alreday there so we use ... spread operator
      return [...state, payload]; // payload will have payload.id, payload.msg, payload.alertType
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload); // return alerts where id doesn't equal to the one that needs to be removed (filter it out)
    default:
      return state;
  }
}
