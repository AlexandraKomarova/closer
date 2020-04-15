const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth'); // bring in the middleware to protect routes
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @ QUESTION when is GET api/auth is hit and what exactly does it do? vs POST api/auth (which is a login route?) What user action acesses the GET api/auth?

// later on in the front we are gonna constantly make a request with the token if we are authenticated and we gonna fill our redux state with the user is gonna have our user object with all the info in it so we know which user is logged in during the session

// @ QUESTION why can't be done from login route? and is it good to make constant request to an api?

// @route    GET api/auth
// @desc     Get user by token
// @access   Private

// protect the route by passing auth as the second param
router.get('/', auth, async (req, res) => {
  try {
    // it's a protected route
    // since we used the token which has the id
    // and in the middleware we set req.user to the user in the token
    // we can access req.user 
    const user = await User.findById(req.user.id).select('-password'); // we use .select(-password) because we don't want to return the passowrd
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token LOGIN
// @access   Public

// we wanna be able to take user's credentials and send that to a route and get the token back as well just like it does with the registration

// get the token to make request to private routes

router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists() // @ QUESTION is it the same as .not().isEmpty() ?
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      
      // send user _id in the token
      const payload = { user: { id: user.id } };

      // sign the token and send it back
      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
        });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
