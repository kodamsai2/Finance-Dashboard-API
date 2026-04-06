const { sequelize } = require('../config/db');
const { VALID_USER_ROLES, VALID_USER_STATUSES} = require('../constants')

const User = sequelize.define('User', {
    _id: {
        type: sequelize.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userUUID: {
        type: sequelize.Sequelize.UUID,
        defaultValue: sequelize.Sequelize.UUIDV4,
        unique: true
    },
    username: {
        type: sequelize.Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize.Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    hashedPassword: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: sequelize.Sequelize.ENUM(...VALID_USER_ROLES),
        defaultValue: 'Viewer'
    },
    status: {
        type: sequelize.Sequelize.ENUM(...VALID_USER_STATUSES),
        defaultValue: 'Inactive'
    },
}, {
    timestamps: true,
    paranoid: true
});

module.exports = User;