const DbConn = require('../database/mongooseConn');
const authUserModel = require('../database/mongooseModels/authUserModel');

var auth = (req, res, next) => {
    let token = req.body.userToken;
    let dbConn = new DbConn();
    let mongoose = dbConn.getConnection();

    let err = {
        code: 'AUTH_UNAUTHORIZED',
        message: 'Unauthorized user request.',
        status: 401
    };

    authUserModel.findByToken(token).then((user) => {
        if (user === null) {
            res.status(err.status).send(err);
        } else {
            if (req.baseUrl === '/seekers') {
                if(user.role === 'seeker'){
                    req.body.userId = user._id;
                    next();
                }else{
                    res.status(err.status).send(err);
                }
            } else if (req.baseUrl === '/employers') {
                if(user.role === 'employer'){
                    req.body.userId = user._id;
                    next();
                }else{
                    res.status(err.status).send(err);
                }
            } else {
                res.status(err.status).send(err);
            }
        }
    }).catch((error) => {
        res.status(err.status).send(err);
    })
}

module.exports = auth;