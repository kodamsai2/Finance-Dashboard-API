const { validationResult } = require('express-validator');
const { 
    getSummaryService, 
    getCategoryBreakdownService,
    getMonthlyTrendsService,
    getWeeklyTrendsService, 
    getRecentTransactionsService  
} = require('../services/dashboard.service');

async function getSummary(req, res) {
    const { userStatus } = req;
    if(userStatus === 'Inactive') {
        return res.status(403).json({ message: 'Account is inactive. Please contact support.', status: 'error' });
    }

    const { year } = req.query;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ message: 'Invalid query parameters', success: false, errors: result.array() });
    }

    try {
        const summary = await getSummaryService(parseInt(year));
        
        const summaryWithFormattedAmounts = {
            ...summary,
            totalIncome: (summary.totalIncome / 100).toFixed(2),
            totalExpense: (summary.totalExpense / 100).toFixed(2),
            netBalance: (summary.netBalance / 100).toFixed(2)
        }

        return res.json({ 
            data: { ...summaryWithFormattedAmounts }, 
            status: 'success', 
            message: 'Dashboard summary retrieved successfully' 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving dashboard summary', status: 'error' });
    }
}

async function getCategoryBreakdown(req, res) {
    const { userStatus, userRole } = req;
    if(userStatus === 'Inactive') {
        return res.status(403).json({ message: 'Account is inactive. Please contact support.', status: 'error' });
    }
    if(userRole === 'Viewer') {
        return res.status(403).json({ message: 'Insufficient permissions to access category breakdown', status: 'error' }); 
    }

    const { year } = req.query;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ message: 'Invalid query parameters', success: false, errors: result.array() });
    }

    try {
        const breakdown = await getCategoryBreakdownService(parseInt(year));
        const breakdownWithFormattedAmounts = breakdown.map(item => ({
            category: item.category,
            totalAmount: (item.totalAmount / 100).toFixed(2)
        }));

        return res.json({ data: breakdownWithFormattedAmounts, status: 'success', message: 'Category breakdown retrieved successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving category breakdown', status: 'error' });
    }
}

async function getTrends(req, res) {
    const { userStatus, userRole } = req;
    if(userStatus === 'Inactive') {
        return res.status(403).json({ message: 'Account is inactive. Please contact support.', status: 'error' });
    }
    if(userRole === 'Viewer') {
        return res.status(403).json({ message: 'Insufficient permissions to access monthly trends', status: 'error' }); 
    }

    const{ period, year, month } = req.query;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ message: 'Invalid query parameters', success: false, errors: result.array() });
    }

    const parsedYear = parseInt(year) || new Date().getFullYear();
    const parsedMonth = parseInt(month) || new Date().getMonth() + 1;

    try {
        if( period === 'monthly' && parsedYear){
            const monthlyTrends = await getMonthlyTrendsService(parsedYear);
            const monthlyTrendsWithFormattedAmounts = monthlyTrends.map(item => ({
                month: item.month,
                totalAmount: (item.totalAmount / 100).toFixed(2)
            }));
            return res.json({ 
                data: monthlyTrendsWithFormattedAmounts, 
                status: 'success', 
                message: 'Monthly trends retrieved successfully' 
            });

        }

        if( period === 'weekly' && parsedYear && parsedMonth){
            const weeklyTrends = await getWeeklyTrendsService(parsedYear, parsedMonth);
            const weeklyTrendsWithFormattedAmounts = weeklyTrends.map(item => ({
                week: item.week,
                totalAmount: (item.totalAmount / 100).toFixed(2)
            }));

            return res.json({ 
                data: weeklyTrendsWithFormattedAmounts, 
                status: 'success', 
                message: 'Weekly trends retrieved successfully' 
            });    
        }
        
        return res.status(400).json({ message: 'Invalid period specified', status: 'error' });
    } catch (error) {
        console.error('Trends error:', error);
        return res.status(500).json({ 
            message: error.message || 'Error retrieving monthly trends', 
            status: 'error' });
    }
}

async function getRecentTransactions(req, res) {
    const { userStatus, userRole } = req;
    if(userStatus === 'Inactive') {
        return res.status(403).json({ message: 'Account is inactive. Please contact support.', status: 'error' });
    }
    if(userRole === 'Viewer') {
        return res.status(403).json({ message: 'Insufficient permissions to access recent transactions', status: 'error' }); 
    }

    try {
        const recentTransactions = await getRecentTransactionsService();
        const recentTransactionsWithFormattedAmounts = recentTransactions.map(item => {
                const {_id, ...safeItem} = item;
                return {
                    ...safeItem,
                    amount: (safeItem.amount / 100).toFixed(2)
                };
            });
        return res.status(200).json({ data: recentTransactionsWithFormattedAmounts, success: true, message: 'Recent 10 transactions retrieved successfully' });       
    }catch (error) {
        return res.status(500).json({ success: true, message: 'Error retrieving recent transactions', status: 'error' });
    }

}

module.exports = {
    getSummary,
    getCategoryBreakdown,
    getTrends,
    getRecentTransactions
}