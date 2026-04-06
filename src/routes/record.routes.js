const Router = require('express').Router();
const { query, body, param } = require("express-validator");
const recordController = require('../controllers/record.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { RECORD_TYPE_LIST, ALL_RECORD_CATEGORIES } = require('../constants')


Router.get('/',
    query('type').optional().isIn(RECORD_TYPE_LIST).withMessage(`type must be either ${RECORD_TYPE_LIST.join(' or ')}`),
    query('category').optional().isIn(ALL_RECORD_CATEGORIES).withMessage(`category must be either ${ALL_RECORD_CATEGORIES.join(' or ')}`),
    query('from').optional().isISO8601().withMessage('from must be a valid date (YYYY-MM-DD)'),
    query('to').optional().isISO8601().withMessage('to must be a valid date (YYYY-MM-DD)'),
    query('minAmount').optional().isFloat({ min: 0 }).withMessage('minAmount must be a positive number'),
    query('maxAmount').optional().isFloat({ min: 0 }).withMessage('maxAmount must be a positive number'),
    query('search').optional().isString().withMessage('search must be a string'),
    query('sortBy').optional().isIn(['date', 'amount']).withMessage('sortBy must be either date or amount'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be either asc or desc'),
    query('page').optional().isInt({ min: 1 }).withMessage('page must be an integer greater than 0'),
    query('limit').optional().isInt({ min: 10, max: 30 }).withMessage('limit must be an integer between 10 and 30'),
    authMiddleware,
    recordController.getRecords
);

Router.post('/', 
    body('amount').exists().isFloat({ min: 0 }).withMessage('amount is required and must be a positive number'),
    body('type').exists().isIn(RECORD_TYPE_LIST).withMessage(`type is required and must be either ${RECORD_TYPE_LIST.join(' or ')}`),
    body('category').exists().isIn(ALL_RECORD_CATEGORIES).withMessage(`category is required and must be either ${ALL_RECORD_CATEGORIES.join(' or ')}`),
    body('date').exists().isISO8601().withMessage('date is required and must be a valid date (YYYY-MM-DD)'),
    body('description').optional().isString().withMessage('description must be a string'),
    authMiddleware, 
    recordController.createRecord
);

Router.patch('/:uuid',
    param('uuid').isUUID().withMessage('Invalid record UUID'),
    body('amount').optional().isFloat({ min: 0 }).withMessage('amount must be a positive number'),
    body('type').optional().isIn(RECORD_TYPE_LIST).withMessage(`type must be either ${RECORD_TYPE_LIST.join(' or ')}`),
    body('category').optional().isIn(ALL_RECORD_CATEGORIES).withMessage(`category must be either ${ALL_RECORD_CATEGORIES.join(' or ')}`),
    body('date').optional().isISO8601().withMessage('date must be a valid date (YYYY-MM-DD)'),
    body('description').optional().isString().withMessage('description must be a string'),
    authMiddleware, 
    recordController.updateRecord
);

Router.delete('/:uuid',
    param('uuid').isUUID().withMessage('Invalid record UUID of record to delete'), 
    authMiddleware, 
    recordController.deleteRecord
);

module.exports = Router;