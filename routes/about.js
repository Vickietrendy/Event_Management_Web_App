const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User')
const Event=require("../models/event")

// Define the route for the "About" page
router.get('/', async(req, res) => {
    let events
    try{
        events=await Event.find().sort({createdAt:'desc'}).limit(2).exec()
    }catch{
        events=[]

    }
    res.render('about/index',
    { layout: false, events }
     // Removes the header
    );
});

router.post('/login',
    passport.authenticate('local', {
    successRedirect: '/events', // Redirect on successful login
    failureRedirect: '/index', // Redirect on failed login
    // failureFlash: true, // Enable flash messages for failed authentication
  }));


  router.post('/register',async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Check if the username already exists in the database
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.redirect('/about'); // Redirect to registration page with a message
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with hashed password
        const newUser = new User({
            username,
            password: hashedPassword,
            role
        });

        // Save the user to the database
        await newUser.save();

        // Redirect to the login page or any other desired destination
        res.redirect('/about');
    } catch (error) {
        console.error(error);
        res.redirect('/about'); // Redirect to registration page with an error message
    }
});


module.exports = router;
