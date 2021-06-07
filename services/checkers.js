const jwt = require('jsonwebtoken');
const adminList = require('../models/adminList');
const Student = require('../models/student.model');
async function ensureAuthenticated(req, res, next) {
    // if (req.isAuthenticated()) {
    //     return next();
    // }
    // res.status(401).json({
    //     error: 'Unauthorized'
    // })
    console.log("C")
    const token = req.header('x-auth-token');
    console.log(token);
    if (!token||token===null) return res.status(401).send('Access denied. No token provided')
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
            let workingUser = await Student.findOne({
                _id: payload.userId
            })
            if (workingUser) {
                req.user = workingUser
                return next();
            } else {
                return res.status(400).json({
                    error: 'No user found'
                })
            }
    } catch (e) {
        console.log("hello",e);
        return res.status(400).json({
            error: e
        })
    }

}
async function ensureAdminHelp(req,res,next){
    console.log("D")
    let admin=await adminList.findOne({email:req.user.email});
    
    if(admin!=null){
        return next();
    }
    return res.status(403).json({
        error:"Access denied"
    })

}

async function ensureAdmin(req,res,next){
    return ensureAuthenticated(req,res,function(){
        return ensureAdminHelp(req,res,next);
    })
}

async function ensureAdminAuth(req,res,next){
        // if (req.isAuthenticated()) {
        //     return next();
        // }
        // res.status(401).json({
        //     error: 'Unauthorized'
        // })
        console.log("Admin Auth")
        const token = req.header('x-auth-token');
        if (!token||token===null) return res.status(401).send('Access denied. No token provided')
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
                let workingUser = await Student.findOne({
                    _id: payload.userId
                })
                if (workingUser) {
                    let adminUser = await adminList.findOne({email: workingUser.email})
                    if(adminUser){
                        req.user = adminUser;
                        return next();
                    }
                    else {
                        return res.status(400).json({
                            error: 'Not an Admin'
                        })
                    }

                } else {
                    return res.status(400).json({
                        error: 'No user found'
                    })
                }
        } catch (e) {
            console.log("hello",e);
            return res.status(400).json({
                error: e,
            })
        }
    
}







module.exports = {
    ensureAuthenticated,ensureAdmin, ensureAdminAuth
}
