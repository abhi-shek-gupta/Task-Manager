var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config/config'); // get our config file
var user = require('../models/user'); // get our mongoose model
var todo = require('../models/todo')
var registrationLogin = require('../routes/registrationLogin')
var jwtVerify = require('../routes/jwtVerify')

var todoRoutes = express.Router()

todoRoutes.use(function(req, res, next) {
    console.log('In create do -- upper')
    jwtVerify(req, res, next)
  })


  todoRoutes.post('/createTodo',function(req,res){
    if(!req.body.name){

        // console.log('In create do -- upper')
        res.json({
            success:false,
            msg:"Data not provided"
        })
    }else{
        // console.log('In create do -- upper')
        var newToDo=new todo({
            email:req.decoded._doc.email,
            name:req.body.name
        })
        newToDo.save(function(err,data){
            if(err){
                next(err);
            }
            else{
                // console.log('In create todo')
                res.json({
                    success: true,
                    data: data
                    // decoded: req.decoded
                  })
            }
        })
    }

})//creaate todo api end


//tofind a todo
todoRoutes.get('/todo', function(req, res) {
    todo.find({ email: req.decoded._doc.email }, { email: 0 }, function(err, data) {
       if (err) next(err)
      else {
        res.json({
          success: true,
          data: data
        })
      }
    })
  
  })//to find todo Api close

todoRoutes.post('/checkToDo',function(req,res){
    if(!req.body._id){
        res.json({
            success: false,
            msg: "Data not provided"
          })
    }else{
        todo.findById({_id:req.body._id},function(err,data){
            if (err) {
                res.status(500).json({
                success: false,
                msg: "Database error"
              })  
            }
            else{
                data.status='done';
                data.completed_date = new Date();
                data.save(function(err,newData){
                    if(err) next(err)

                    else {
                        res.json({
                          success: true,
                          data: newData
                        })
                      }
                })

            }  
        })
    }
})

todoRoutes.use(function(err,req,res,next){
  res.status(500);
   res.send("Oops, something went wrong.")
})

module.exports = todoRoutes