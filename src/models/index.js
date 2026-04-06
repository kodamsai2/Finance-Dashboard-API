const User = require("./user.model")
const Record = require("./record.model")


// Define associations
Record.belongsTo(User, {
    foreignKey: 'userUUID',
    as: 'user'
});

User.hasMany(Record, {
    foreignKey: 'userUUID',
    as: 'records'
});


module.exports = {
  User,
  Record
};