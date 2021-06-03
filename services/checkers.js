const jwt = require('jsonwebtoken');
const Student = require('../models/student.model');
async function ensureAuthenticated(req, res, next) {
    // if (req.isAuthenticated()) {
    //     return next();
    // }
    // res.status(401).json({
    //     error: 'Unauthorized'
    // })
    const token = req.header('x-auth-token');
    if (!token) res.status(401).send('Access denied. No token provided')
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
            let workingUser = await Student.findOne({
                _id: payload.userId
            })
            if (workingUser) {
                req.user = workingUser
                next();
            } else {
                return res.status(400).json({
                    error: 'No user found'
                })
            }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            error: e,
        })
    }

}
module.exports = {
    ensureAuthenticated
}
