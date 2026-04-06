const Router = require('express').Router();
const { query, param, body } = require("express-validator");
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { VALID_USER_ROLES, VALID_USER_STATUSES } = require('../constants');

Router.get('/',
    query('status').optional().isIn(VALID_USER_STATUSES),
    query('role').optional().isIn(VALID_USER_ROLES),
    authMiddleware, 
    userController.getUsers
);

Router.get('/:uuid', 
    param('uuid').notEmpty().isUUID(),
    authMiddleware, 
    userController.getUserByUUID
);

Router.patch('/:uuid/role',
    param('uuid').notEmpty().isUUID(),
    body('role').notEmpty().isIn(VALID_USER_ROLES),
    authMiddleware, 
    userController.updateUserRole
);

Router.patch('/:uuid/status', 
    param('uuid').notEmpty().isUUID(),
    body('status').notEmpty().isIn(VALID_USER_STATUSES),
    authMiddleware, 
    userController.updateUserStatus
);

Router.delete('/:uuid',
    param('uuid').notEmpty().isUUID(),
    authMiddleware, 
    userController.deleteUser
);

module.exports = Router;