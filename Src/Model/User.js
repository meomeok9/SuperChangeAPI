const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    fullName : {type :String , require :true},
    email : {type : String , require : true},
    password : {type :String, require : true},
    phoneNunber : {type :String, require : true},
    address : {type:String, require : false}
});
module.exports = mongoose.model("User",userSchema);
