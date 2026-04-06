const { where } = require('sequelize');
const { User } = require('../models/index');

async function getUsersService(status, role) {
        const whereClause = {};
        if(status){
            whereClause.status = status;
        }
        if(role){
            whereClause.role = role;
        }

        try {
             const result = User.findAll({ where: whereClause });
             return result;
        }catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }   
}

async function getUserService(uuid) {
    try {
        const user = await User.findOne({ where: { userUUID: uuid } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
    }
}

async function updateUserRoleService(uuid, role) {
    try {
        const user = await User.findOne({ where: { userUUID: uuid } });
        if (!user) {
            throw new Error('User not found');
        }

        user.role = role;
        await user.save();

        return user;
    } catch (error) {
        throw new Error('Error updating user role: ' + error.message);
    }
}

async function updateUserStatusService(uuid, status) {
    try {
        const user = await User.findOne({ where: { userUUID: uuid } });
        if (!user) {
            throw new Error('User not found');
        }

        user.status = status;
        await user.save();

        return user;
    } catch (error) {
        throw new Error('Error updating user status: ' + error.message);
    }
}

module.exports = {
    getUsersService,
    getUserService,
    updateUserRoleService,
    updateUserStatusService
}