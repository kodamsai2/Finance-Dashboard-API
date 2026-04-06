const { sequelize } = require('../config/db');

const { RECORD_TYPE_LIST, ALL_RECORD_CATEGORIES, getCategoriesForType} = require('../constants');

const Record = sequelize.define('Record', {
    _id: {
        type: sequelize.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    recordUUID: {
        type: sequelize.Sequelize.UUID,
        defaultValue: sequelize.Sequelize.UUIDV4,
        unique: true
    },
    userUUID: {
        type: sequelize.Sequelize.UUID,
        allowNull: false,
        references: {
            model: 'Users', // Table name in the database
            key: 'userUUID'
        },
        onDelete: 'NO ACTION'
    },
    amount: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: false
    },
    type: {
        type: sequelize.Sequelize.ENUM(...RECORD_TYPE_LIST),
        allowNull: false
    },
    category: {
        type: sequelize.Sequelize.ENUM(
            ...ALL_RECORD_CATEGORIES
        ),
        allowNull: false,
        validate: {
            isValidCategory(value) {
                const validCategories = getCategoriesForType(this.type);
                if (!validCategories.includes(value)) {
                    throw new Error(`Invalid category '${value}' for record type '${this.type}'. Valid categories are: ${validCategories.join(', ')}`);
                }
            }
        }    
    },
    date: {
        type: sequelize.Sequelize.DATEONLY,
        allowNull: false
    },
    description: {
        type: sequelize.Sequelize.STRING,
        allowNull: true
    },
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Record;