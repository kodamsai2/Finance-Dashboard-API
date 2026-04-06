const { getAllTypesAndCategories } = require('../constants');

function getCategories(req, res) {
    
    const recordCategoriesObj = getAllTypesAndCategories();
    if(!recordCategoriesObj || Object.keys(recordCategoriesObj).length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No record categories found'
        })
    }

    res.status(200).json({
        success: true,
        message: 'Record categories retrieved successfully',
        data: {
           recordCategoriesObj
        }
    })
}

module.exports = { getCategories };