var jwt=require('jsonwebtoken');
var superSecret = require('../config/config');


jwtVerify = (function(req, res, next) {
var token = req.body.token || req.param('token') || req.headers['x-access-token'];

if(token){
    jwt.verify(token, superSecret.secret, function(err, decoded){
        if(err){
            console.log('In create do -- upper i am error')
            return res.json({
                success:false,
                msg:"Failed to authenticate token."
            })
        }else{
            req.decoded = decoded;	
            next();
        }
    })
}else{
    return res.status(500).send({
        success: false, 
        message: 'No token provided.'
    })
}

});

module.exports=jwtVerify;