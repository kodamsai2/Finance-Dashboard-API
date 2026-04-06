const { canTreatArrayAsAnd } = require('sequelize/lib/utils');
const { Record } = require('../models/index');
const { Op, fn, col, literal } = require('sequelize');

async function getSummaryService(year) {
    let selectedYear = year || new Date().getFullYear();

    const whereCondition = {
        date: {
            [Op.between]: [
                `${selectedYear}-01-01`,
                `${selectedYear}-12-31`
            ]
        }
    };

    const totalRecords = await Record.count({ where: whereCondition });

    const totalIncome = await Record.sum('amount', {
        where: { ...whereCondition, type: 'Income' }
    });

    const totalExpense = await Record.sum('amount', {
        where: { ...whereCondition, type: 'Expense' }
    });

    const income = totalIncome || 0;
    const expense = totalExpense || 0;

    return {
        totalRecords,
        totalIncome: income,
        totalExpense: expense,
        netBalance: income - expense,
        year: selectedYear
    };
}

async function getCategoryBreakdownService(year) {
    let selectedYear = year || new Date().getFullYear();
    
    try {
        const breakdown= await Record.findAll({
            attributes: [
                'category',
                [fn('SUM', col('amount')), 'totalAmount']
            ],
            where: {
                date: {
                    [Op.between]: [
                        `${selectedYear}-01-01`,
                        `${selectedYear}-12-31`
                    ]
                }
            },
            group: ['category'],
            raw: true
        });
        return breakdown;
    }catch(error) {
        throw error.message;
    }
}

async function getMonthlyTrendsService(selectedYear) {

    return await Record.findAll({
        where: {
            date: {
                [Op.between]: [
                    new Date(`${selectedYear}-01-01`),
                    new Date(`${selectedYear}-12-31`)
                ]
            }
        },
        attributes: [
            [literal(`EXTRACT(MONTH FROM "date")`), 'month'],
            [fn('SUM', col('amount')), 'totalAmount']
        ],
        group: [literal(`EXTRACT(MONTH FROM "date")`)],
        order: [[literal(`EXTRACT(MONTH FROM "date")`), 'ASC']],
        raw: true
    });
}

async function getWeeklyTrendsService(parsedYear, parsedMonth) {
    try {
        const start = new Date(parsedYear, parsedMonth - 1, 1);
        const end = new Date(parsedYear, parsedMonth, 0);

        return await Record.findAll({
            attributes: [
                [literal(`EXTRACT(WEEK FROM "date")`), 'week'],
                [fn('SUM', col('amount')), 'totalAmount']
            ],
            where: {
                date: {
                    [Op.between]: [start, end]
                }
            },
            group: [literal(`EXTRACT(WEEK FROM "date")`)],
            order: [[literal(`EXTRACT(WEEK FROM "date")`), 'ASC']],
            raw: true
        });

    } catch (error) {
        throw error;
    }
}

async function getRecentTransactionsService() {
    try {
        return await Record.findAll({
            order: [['date', 'DESC']],
            limit: 10,
            raw: true
        });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getSummaryService, 
    getCategoryBreakdownService, 
    getMonthlyTrendsService,
    getWeeklyTrendsService, 
    getRecentTransactionsService  
}