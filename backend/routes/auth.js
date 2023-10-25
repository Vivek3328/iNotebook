const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "abcdefghijklmnopqrstuvwxyz";
const fetchuser = require("../middleware/fetchuser");

// ROUTE 1:  Create a user using: POST  "/api/auth/createuser"  No Login required
router.post('/createuser', [
    body('name', 'Enter min 3 Characters').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter min 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    try {


        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, errors: 'sorry user with this email already exist' });
        }

        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePassword,
        });

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }
})


// ROUTE 2:  Login a user using POST : "api/auth/login"

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter min 5 characters').exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: 'Try to login with correct Credentials' });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(400).json({ errors: 'Try to login with correct Credentials' });
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }
})


// ROUTE 3: get loggedin  user details using POST : "api/auth/getuser"

router.post('/getuser', fetchuser, async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);

    } catch (error) {
        console.error(error.message);
        res.status(401).send("Some Error Occured");
    }
})


module.exports = router