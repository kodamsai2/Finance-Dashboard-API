const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
const { UUID } = require('sequelize');

async function register(username, email, password) {
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, hashedPassword });
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
}

async function login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const userData = user.toJSON();
    const isMatch = await bcrypt.compare(password, userData.hashedPassword);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ UUID: userData.userUUID, role: userData.role, status: userData.status }, process.env.JWT_SECRET, { expiresIn: '6h' });
    return { userData, token };
}

module.exports = {
    register,
    login
}