const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const isRegisterAuthEnabled = process.env.REGISTER_AUTHENTICATE == "true";
// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        issuer: process.env.JWT_ISSUER || 'Rahul Timbaliya',
    });
};

// Register route
const registerMiddlewares = [];
if (isRegisterAuthEnabled) {
    registerMiddlewares.push(authenticateToken);
}
router.post('/register', ...registerMiddlewares, async (req, res) => {
        try {
            console.log('Register authentication required:', isRegisterAuthEnabled);
            const { username, email, password } = req.body;

            // Validation
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username, email, and password are required'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters long'
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'User with this email or username already exists'
                });
            }

            // Create new user
            const user = new User({ username, email, password });
            await user.save();

            // Generate token
            const token = generateToken(user._id);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during registration'
            });
        }
    });

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Profile retrieved successfully',
            data: {
                user: req.user
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving profile'
        });
    }
});

// Verify token route
router.get('/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Token is valid',
        data: {
            user: req.user
        }
    });
});

module.exports = router;