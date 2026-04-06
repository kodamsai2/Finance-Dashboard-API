const { getUsersService, updateUserRoleService, getUserService, updateUserStatusService } = require('../services/user.service');
const { validationResult } = require('express-validator');

async function getUsers(req, res) {
    const { userRole, userStatus } = req;
    if (userRole !== 'Admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access this resource' });
    }   
    if (userStatus === 'Inactive') {
        return res.status(403).json({ success: false, message: 'Your account is inactive. Please contact support.' });
    }

    const { status, role } = req.query;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: result.array() });
    }
        
    try {
        const users = await getUsersService(status, role);
        const safeUsersData = users.map(user => {
            const { _id, hashedPassword, ...safeData } = user.toJSON();
            return {
                ...safeData
            };
        });

        res.status(200).json({ success: true, data: { users: safeUsersData }, message: 'Users fetched successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
    }
}

async function getUserByUUID(req, res) {
    const { userRole, userStatus } = req;
    if (userRole !== 'Admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access this resource' });
    }   
    if (userStatus === 'Inactive') {
        return res.status(403).json({ success: false, message: 'Your account is inactive. Please contact support.' });
    }

    const { uuid } = req.params;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: result.array() });
    }

    try {
        const user = await getUserService(uuid);
        const { _id, hashedPassword, ...safeUserData } = user.toJSON();

        res.status(200).json({ success: true, data: { user: safeUserData }, message: 'User fetched successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
    }
}

async function updateUserRole(req, res) {
    const { userRole, userStatus } = req;
    if (userRole !== 'Admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access this resource' });
    }   
    if (userStatus === 'Inactive') {
        return res.status(403).json({ success: false, message: 'Your account is inactive. Please contact support.' });
    }

    const { uuid } = req.params;
    const { role } = req.body;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: result.array() });
    }

    try {
        const user = await updateUserRoleService(uuid, role);
        const { _id, hashedPassword, ...safeUserData } = user.toJSON();
        
        res.status(200).json({ success: true, data: { user: safeUserData }, message: 'User role updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user role', error: error.message });
    }
}

async function updateUserStatus(req, res) {
    const { userRole, userStatus } = req;
    if (userRole !== 'Admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access this resource' });
    }   
    if (userStatus === 'Inactive') {
        return res.status(403).json({ success: false, message: 'Your account is inactive. Please contact support.' });
    }

    const { uuid } = req.params;
    const { status } = req.body;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: result.array() });
    }

    try {
        const user = await updateUserStatusService(uuid, status);
        const { _id, hashedPassword, ...safeUserData } = user.toJSON();
        
        res.status(200).json({ success: true, data: { user: safeUserData }, message: 'User status updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user status', error: error.message });
    }
}


async function deleteUser(req, res) {
    const { userRole, userStatus } = req;
    if (userRole !== 'Admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access this resource' });
    }   
    if (userStatus === 'Inactive') {
        return res.status(403).json({ success: false, message: 'Your account is inactive. Please contact support.' });
    }
    
    const { uuid } = req.params;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: result.array() });
    }

    try {
        const user = await getUserService(uuid);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.status = 'Inactive';
        await user.save();

        await user.destroy();

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    }catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
    }
}

module.exports = {
    getUsers,
    getUserByUUID,
    updateUserRole,
    updateUserStatus,
    deleteUser
}