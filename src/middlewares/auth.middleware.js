const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

async function authenticate(req, res, next) {
    const jwtToken = req.header('Authorization')?.replace('Bearer ', '');
    if (!jwtToken) {
        return res.status(401).json({ message: 'Unauthorized access, Please provide a valid token', success: false });
    }

    try {
        const decodedData = jwt.verify(jwtToken, process.env.JWT_SECRET);
        
        const user = await User.findOne({ where: { userUUID: decodedData.UUID } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token: User not found', success: false });
        }
       
        req.userUUID = user.userUUID;
        req.userRole = user.role;
        req.userStatus = user.status;
        next();
    }catch (error) {
        return res.status(500).json({ message: 'Internal server error during authenticating user', success: false, error: error.message });
    }
}

module.exports =  authenticate;