const { Op } = require('sequelize');
const { Record } = require('../models/index');
const { RECORD_TYPE_LIST, ALL_RECORD_CATEGORIES } = require('../constants')

async function getRecordsService(queryData) {
     const { where, order, limit, offset } = constructQuery(queryData);

    try {
        const records = await Record.findAll({
            where,
            order,
            limit,
            offset
        });

        return records;
    }catch (error) {
        throw new Error('Error while fetching records: ' + error.message);
    }
}

function constructQuery(queryData) {
    let where = {};
    let order = [['date', 'DESC']];
    let limit = 10;
    let offset = 0;
    
    // Type filters
    if (queryData.type) {
        where.type = queryData.type;
    }

    // Category filters(multiple categories can be provided as comma-separated values)
    if (queryData.category) {
        const categories = queryData.category.split(',');
        where.category = {
            [Op.in]: categories
        };
    }

    // Date range filters
    if (queryData.from || queryData.to) {
        where.date = {};
        if (queryData.from) {
            where.date[Op.gte] = new Date(queryData.from);
        }
        if (queryData.to) {
            where.date[Op.lte] = new Date(queryData.to);
        }
    }

    //  Amount range filters
    if (queryData.minAmount || queryData.maxAmount) {
        where.amount = {};
        if (queryData.minAmount) {
            where.amount[Op.gte] = parseFloat(queryData.minAmount)*100;
        }
        if (queryData.maxAmount) {
            where.amount[Op.lte] = parseFloat(queryData.maxAmount)*100;
        }
    }

    // Search
    if (queryData.search) {
        where.description = {
            [Op.iLike]: `%${queryData.search}%`
        };
    }

    // Sorting
    if (queryData.sortBy) {
        order = [[
            queryData.sortBy,
            queryData.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
        ]];
    }

    // Pagination
    if (queryData.page) {
        const page = parseInt(queryData.page) || 1;
        limit = parseInt(queryData.limit) || 10;
        offset = (page - 1) * limit;
    }

    return { where, order, limit, offset };
}

async function createRecordService({ userUUID, amount, type, category, date, description }) {
    try {
        const newRecord = await Record.create({ userUUID, amount, type, category, date, description });
        return newRecord;
    } catch (error) {
        throw new Error('Error while creating record: ' + error.message);
    }
}

async function updateRecordService(recordUUID, { userUUID, amount, type, category, date, description }) {
    try {
        const updatedRecord = await Record.findOne({ where: { recordUUID: recordUUID } });
        if (!updatedRecord) {
            throw new Error('Record not found');
        }

        await updatedRecord.update({ userUUID, amount, type, category, date, description });
        return updatedRecord;
    } catch (error) {
        throw new Error('Error while updating record: ' + error.message);
    }
}


async function deleteRecordService(recordUUID) {
    try {
        const deletedRecord = await Record.findOne({ where: { recordUUID: recordUUID } });
        if (!deletedRecord) {
            throw new Error('Record not found');
        }

        await deletedRecord.destroy();
        return deletedRecord;

    } catch (error) {
        throw new Error('Error while deleting record: ' + error.message);
    }
}

module.exports = {
    getRecordsService,
    createRecordService, 
    updateRecordService, 
    deleteRecordService
}