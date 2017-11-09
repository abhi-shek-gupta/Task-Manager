//These routes will be used for registration and Login , here
// we would register the user and authenticate the user and generate the token
// the token will be supplied to the user.`

var express = require('express');
var registrationLogin = express.Router();//to provide routin faciity
var mongoose = require('mongoose');
var user = require('../models/user')
var jwt    = require('jsonwebtoken'); 
var superSecret = require('../config/config')

registrationLogin.post('/registration',function(req,res){
   
    if( (req.body.email) && (req.body.password) ){
        var userSave=new user({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        })

        userSave.save(function(err,data){
            if(err){
                res.json({success:false})
            }
            else{ console.log("sending data");
                res.json({
                    success:true,
                    data:data
                })
                console.log(res);
            }
        })
    }//if
    else{
        res.json({
            success:false,
            msg:"No Data entered"
        })
    }

})//new user registration API end


//login API start
registrationLogin.post('/login',function(req,res){
    if(!req.body.email || !req.body.password){
        res.json({
            success:false,
            msg:"Insufficent Data"
        })
    }
    else {
        user.findOne({email:req.body.email},function(err,user){
            if(err) throw err;

            //no user exist
            if(!user){
                res.json({
                    success:false,
                    msg:"Authentication failed ,No such user found"                    
                })
            }
            //user exist
            else{//password chk
                if(user.password != req.body.password){
                    res.json({
                        success:false,
                        msg:"Authentication Failed,Wrong Password"
                    })
                }
                else{
                     // if user is found and password is right
                    // create a token
                    var token =jwt.sign(user,superSecret.secret,{
                        expiresIn:86400//expiring time 24hours in sec
                    });

                    res.json({
                        success:true,
                        message: 'token generated',
                        token: token
                    });
                }
            }
        })
    }
})

module.exports=registrationLogin;