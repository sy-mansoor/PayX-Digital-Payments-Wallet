const express = require('express');
    const router = express.Router();
    const jwt = require('jsonwebtoken');
    const { check, validationResult } = require('express-validator');
    const User = require('../models/User');
    const authMiddleware = require('../middleware/authMiddleware');

    // @route   POST api/auth/register
    // @desc    Register user
    // @access  Public
    router.post(
      '/register',
      [
        check('username', 'Username is required').notEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
      ],
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;
        try {
          // Check if user already exists
          let user = await User.findOne({ email });
          if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
          }

        // Create new user
        user = new User({
          username,
          email,
          password,
        });

        // Save user to database
        await user.save();

        // Create and return JWT
        const payload = {
          user: {
            id: user.id,
          },
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '1h' }, // Token expires in 1 hour
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    // @route   POST api/auth/login
    // @desc    Authenticate user & get token
    // @access  Public
    router.post('/login', 
    [
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Password is required').exists(),
    ],async (req, res) => {
      const { email, password } = req.body;

      try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create and return JWT
        const payload = {
          user: {
            id: user.id,
          },
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '1h' }, // Token expires in 1 hour
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });
    // @route   GET api/auth/user
    // @desc    Get logged in user
    // @access  Private
    router.get('/user', authMiddleware, async (req, res) => {
      try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        res.json(user);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });



    module.exports = router;
