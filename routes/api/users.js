const express = require('express');
const router = express.Router();
const gravatar = require('gravatar'); // add avatar if user uses an email that has gravatar
const bcrypt = require('bcryptjs'); // hash the password
const jwt = require('jsonwebtoken');
const config = require('config'); // get vars from config/default.json
const { check, validationResult } = require('express-validator'); // handle validation
const normalize = require('normalize-url');

const User = require('../../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public

// register route send a token back

router.post('/', [ // second arg is an array of checks
    // check takes in field to validate and a custom error message and the method (a rule, such as isEmail) is applied
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    // @express-validator 
    // within the route set the errors array
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { name, email, password } = req.body;

    // encrypt the password
    // return JSON web token. In the front end when user registers we want them to get logged in right away and you need the token to be logged in
    try {
      // see if user exists
      let user = await User.findOne({ email }); // returns a promise // takes in a field to search by
      if (user) return res.status(400).json({ errors: [{ msg: 'User already exists' }] }); // match the same type of error response from line 27 .json which is an array of errors. So that on the client you get the same type of error whether it's one of the input errors or the user is actually already there

      // get user's gravatar: pass user's email into a method and it'll give us the url to the gravatar
      // s is size, pg is rating to not allow naked people, mm allows to have user icon if they don't have gravatar
      const avatar = normalize(gravatar.url(email, { s: '200', r: 'pg', d: 'mm' }), { forceHttps: true });
      
      // create an instance of a user
      user = new User({ name, email, avatar, password });

      // create salt to do hashing with
      const salt = await bcrypt.genSalt(10); // returns a promise // pass how many rounds

      // hash the password: pass the password and salt
      user.password = await bcrypt.hash(password, salt);

      // save the user to the database
      await user.save();
      
      // payload is gonna be an object with the user and user is gonna have an id which we can get by user.id
      const payload = { user: { id: user.id } };

      // once we get the payload we pass it to jwt.sign 
      // which takes 4 args: 
      // 1) payload
      // 2) secret(you get it with config.get)
      // 3) how long the token lasts. Change to 3600 for production
      // 4) callback which takes err and token
      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
          if (err) throw err;
          res.json({ token }); // send the token
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

// JWT process 

// return the token once they register so that they can use the token to authenticate and access protected routes

// visit jwt.io to see what's inside the token 

// the token: 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

// has three parts. divided by the .

// first part (HEADER) is the algo:
//  {
//  "alg": "HS256",
//  "typ": "JWT"
//  }

// second part (PAYLOAD) 
// the data you want to send within the token
// this one sends the name and issued at
// {
//   "sub": "1234567890",
//   "name": "John Doe",
//   "iat": 1516239022
// }

// third part (VERIFY SIGNATURE)
// HMACSHA256(
//   base64UrlEncode(header) + "." +
//   base64UrlEncode(payload),
//   your-256-bit-secret)

// we will be sending mongo's _id as the payload so that we can identify which user is within the token. Let's say we wanna update a profile. We can look at the payload see which user it is that's logged in and which user's profile we have to update

// jwt.sign takes in the payload and callback that sends the response back to the client with that token 

// we'll protect our routes by creating a piece of middleware that will verify the token 

// we then can call jwt.verify which will take the token that was sent in through http headers 

// you can go jwt.io and paste a token that was created and you'll see in the payload the user object with id: user.id (mongo _id) that was saved into that payload var 
