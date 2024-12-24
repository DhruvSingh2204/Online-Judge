const jwt = require('jsonwebtoken');
require('dotenv').config()

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('token not found');
        return res.status(403).send('Token is required');
    }

    console.log('inside middleware verifyJWT')

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('token success')
        next();
    } catch (error) {
        console.log('invalid token' , error)
        return res.status(401).send('Invalid Token');
    }
};

module.exports = {verifyToken}