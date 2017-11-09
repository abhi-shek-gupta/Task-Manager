var mongoose=require('mongoose');
var Schema=mongoose.Schema;
//set the schema

module.exports=mongoose.model('User',new Schema({
 name:String,
 email :String,
 password: String
})
);