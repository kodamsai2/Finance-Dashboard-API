const authService = require('../services/auth.service');
const { validationResult } = require('express-validator');

async function register(req, res) {
    const {username, email, password} = req.body;

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: result.array() });
    }

    try {
        const user = await authService.register(username, email, password);

        let {_id, hashedPassword, ...safeData} = user.toJSON();
        res.status(201).json({success: true, message: 'User registered successfully', data:{ user: safeData }});
    } catch (error) {
        res.status(400).json({success: false, message:'User registration failed', error: error.message});
    }

}

async function login(req, res) {
    const { email, password } = req.body;

    const result = validationResult(req);
    console.log('Validation errors:', result.array());
    if (!result.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: result.array() });
    }

    try {
        const { userData, token } = await authService.login(email, password);

        const { _id, hashedPassword, ...safeData } = userData;
        res.status(200).json({success: true, message: 'User logged in successfully', data: { user: safeData, token }});
    } catch (error) {
        res.status(400).json({success: false, message: 'Login failed', error: error.message});
    }
}

module.exports = {
    register,
    login
}