const Router = require('express').Router();
const { query } = require('express-validator');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');



Router.get('/summary',
    query('year').optional().isInt({ min: 2025, max: new Date().getFullYear() }).withMessage('Year must be a valid integer between 2025 and the current year'),
    authMiddleware, 
    dashboardController.getSummary
);

Router.get('/categories',
    query('year').optional().isInt({ min: 2025, max: new Date().getFullYear() }).withMessage('Year must be a valid integer between 2025 and the current year'),
    authMiddleware ,
    dashboardController.getCategoryBreakdown
);

Router.get('/trends', 
    query('period').notEmpty().isIn(['monthly', 'weekly']).withMessage('Period must be either monthly or weekly'),
    query('year').optional().isInt({ min: 2025, max: new Date().getFullYear() }).withMessage('Year must be a valid integer between 2025 and the current year'),
    query('month').if(query('period').equals('weekly')).notEmpty().withMessage('Month is required for weekly trends').isInt({ min: 1, max: 12 }),
    authMiddleware,
    dashboardController.getTrends
);

Router.get('/recent',
    authMiddleware, 
    dashboardController.getRecentTransactions
);

module.exports = Router;