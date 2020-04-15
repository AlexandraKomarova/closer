// create middleware that will verify the token when it's sent back to the server

// we need to be able to send the token back from the client to authenticate and access protected routes

const jwt = require('jsonwebtoken');
const config = require('config');

// middleware function takes 3 things: req, res and next 
// middleware function is a function that has access to request and respoonse cycle or req and res objects
// next is the callback that we have to run so that the function moves on to the next piece of middleware

module.exports = function(req, res, next) {
  // get token from header
  // when we send a request to a protected route we need to send the token within the header 
  // pass the header that we want to get: 'x-auth-token'
  // that's the header key that we want to send the token in
  const token = req.header('x-auth-token');

  // check for token
  // if there is no token and the route is protected with this middleware send 401
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  
  // verify token
  // jwt.verify() takes in token and secret. And if a callback is supplied the function acts asynchronously
  // callback will be called with the decoded payload if the signature is valid, if not - with error
  try {
    // token will be put inside the decoded object
    // we will set req.user bellow to the user that's in that decoded object (token)
    jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
      // if there is a token but it's not valid send json error 
      if (error) res.status(401).json({ msg: 'Token is not valid' });
      else {
      // @  QUESTION  // ? why is there .user in the request object? because we send in that payload object? or looks like no ...

      // from the docs, in app.param(), router.param():
      // For example, when :user is present in a route path, you may map user loading logic to automatically provide req.user to the route, or perform validations on the parameter input.

      // take request object and assign the value to user
      // set it that decoded value which has user in the payload because we attached user with the id in the payload 
      req.user = decoded.user;
      next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};

// we can then use req.user in any of our protected routes eg. get user's profile





