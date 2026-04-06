const Router = require('express').Router();
const { body } = require("express-validator");
const authController = require('../controllers/auth.controller');

Router.post('/register', 
    body('username').notEmpty().isString().trim().isLength({ min: 2, max: 80 }),
    body('email').notEmpty().isEmail().normalizeEmail(),
    body('password').notEmpty().isString().trim().isLength({ min: 6, max: 50 }),
    authController.register
);

Router.post('/login',
    body('email').notEmpty().isEmail().normalizeEmail(),
    body('password').notEmpty().isString().trim().isLength({ min: 6, max: 50 }),
    authController.login
);

module.exports = Router;