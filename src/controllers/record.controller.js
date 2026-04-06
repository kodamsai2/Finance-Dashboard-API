const { validationResult } = require('express-validator');
const { getRecordsService, createRecordService, updateRecordService, deleteRecordService } = require('../services/record.service');


async function getRecords(req, res) {
    const { userStatus } = req;
    if (userStatus !== 'Active') {
        return res.status(403).json({ 
            message: 'Forbidden: Your account is not active', 
            success: false 
        });
    }
    const queryData = req.query;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ 
            message: 'Invalid query parameters', 
            success: false, 
            errors: result.array() 
        });
    }
    
    try {
        const records = await getRecordsService(queryData);
        res.status(200).json({ message: 'Records retrieved successfully', success: true, data: records });
    }catch (error) {
        res.status(500).json({ message: 'Internal server error while retrieving records', success: false, error: error.message });
    }
}

async function createRecord(req, res) {
    const { userUUID, userStatus, userRole } = req;
    if (userStatus !== 'Active') {
        return res.status(403).json({ message: 'Forbidden: Your account is not active', success: false });
    }
    if (userRole !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden: You are not an admin', success: false });
    }

    const { amount, type, category, date, description } = req.body;
    
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ message: 'Invalid input data', success: false, errors: result.array() });
    }

    try { 
        const newRecord = await createRecordService({ userUUID, amount: amount*100, type, category, date, description });
        if (!newRecord) {
            return res.status(400).json({ 
                message: 'Failed to create record', 
                success: false 
            });
        }

        const { _id, ...safeRecord } = newRecord.toJSON();

        res.status(201).json({
             message: 'Record created successfully', 
             success: true, 
             data: { 
                record : {
                    ...safeRecord,
                    amount: safeRecord.amount / 100
                }} 
            });
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal server error while creating record', 
            success: false, 
            error: error.message 
        });
    }
}

async function updateRecord(req, res) {
    const { userUUID, userStatus, userRole } = req;
    if (userStatus !== 'Active') {
        return res.status(403).json({ message: 'Forbidden: Your account is not active', success: false });
    }
    if (userRole !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden: You are not an admin', success: false });
    }

    const {uuid} = req.params;
    const { amount, type, category,date, description } = req.body;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ message: 'Invalid input data', success: false, errors: result.array() }); 
    }
   
    try {   
        const updatedRecord = await updateRecordService(uuid, { userUUID, amount: amount*100, type, category, date, description });
        if (!updatedRecord) {
            return res.status(404).json({ message: 'Record not found', success: false });
        }

        const { _id, ...safeRecord } = updatedRecord.toJSON();
        res.status(200).json({ message: 'Record updated successfully', success: true, data: { record: safeRecord } });
    }catch (error) {    

        res.status(500).json({ message: 'Internal server error while updating record', success: false, error: error.message });
    }
}

async function deleteRecord(req, res) {
    const { userStatus, userRole } = req;
    if (userStatus !== 'Active') {
        return res.status(403).json({ message: 'Forbidden: Your account is not active', success: false });
    }
    if (userRole !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden: You are not an admin', success: false });
    }

    const {uuid} = req.params;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ message: 'Invalid input data', success: false, errors: result.array() });     
    }

    try {
        const deletedRecord = await deleteRecordService(uuid);
        if (!deletedRecord) {
            return res.status(404).json({ message: 'Record not found', success: false });
        }

        res.status(200).json({ message: 'Record deleted successfully', success: true });
    }catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting record', success: false, error: error.message });
    }
}

module.exports={
    getRecords,
    createRecord,
    updateRecord,
    deleteRecord
}