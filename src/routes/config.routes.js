const Router = require('express').Router();
const configController = require('../controllers/config.controller');

Router.get('/categories', configController.getCategories);

module.exports = Router;