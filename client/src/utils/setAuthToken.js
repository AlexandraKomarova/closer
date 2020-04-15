import axios from 'axios';

const setAuthToken = token => {
  if (token) { // @ QUESTION: video says this token is coming from local storage. If so, why are we setting it to local storage down bellow?
    // set a global header
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

// when we have a token we just gonna send it with every request
// instead of picking and choosing which request to send it with

export default setAuthToken;
