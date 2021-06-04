const jwt = require('jsonwebtoken');
const {
    OAuth2Client
} = require('google-auth-library');


// check if Token exists on request Header and attach token to request as attribute
exports.checkTokenMW = (req, res, next) => {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader.split(' ')[1];
        next();
    } else {
        res.sendStatus(403);
    }
};
exports.checkOAUTHtoken = async(req, res, next) => {
        const CLIENT_ID = process.env.CLIENT_ID
        if (req.body.tokenId) {
            const client = new OAuth2Client(CLIENT_ID);
            async function verify() {
                const ticket = await client.verifyIdToken({
                    idToken: req.body.tokenId,
                    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
                    // Or, if multiple clients access the backend:
                    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
                });
                const payload = await ticket.getPayload();
                const userid = payload['sub'];
                console.log("called",payload);
                // If request specified a G Suite domain:
                // const domain = payload['hd'];
                return payload;
            }
            await verify().then((payload) => {
                console.log("verified")
                if (payload['hd'] !== 'iiti.ac.in') {
                    return res.sendStatus(401);
                }
                //verified
                else {
                    req.body.email=payload['email'];
                    return next()
                };
            }).catch(err => {

                console.log(err);
                res.sendStatus(401);

            })

        }
    }
    // Verify Token validity and attach token data as request attribute
exports.verifyToken = (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            return req.authData = authData;
        }
    })
};

// Issue Token
getToken = function(user) {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: 3600
    });
};
exports.loginuser = (req, res, next) => {
    if (req.user) {
        var token = getToken({
            userId: req.user._id
        });
        console.log("user is",req.user,token)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: true,
            token: token,
            status: 'You are successfully logged in!',
            user: req.user
        });
    }
    else{
        console.log("user not found");
    }
}
// exports.signToken = (req, res) => {
//     console.log('req is ', req.user);
//     jwt.sign({
//         userId: req.user._id,
//         email: req.user.email,
//     }, process.env.JWT_SECRET, {
//         expiresIn: 3600 * 6,
//     }, (err, token) => {
//         if (err) {
//             console.log(err);
//             res.sendStatus(500)
//         } else {
//             let deepClone = JSON.parse(JSON.stringify(req.user));
//             if (req.user.password) {
//                 delete deepClone.password;
//             }
//             res.json({
//                 success: true,
//                 token: token,
//                 status: 'You are successfully logged in!',
//                 user: deepClone
//             });
//         }
//     });
// }