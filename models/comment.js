var mongoose=require("mongoose");

//commnet ko user se link krna hai,so comment mein v did changes coz comment
//is dependent on users, bt user is not dependent on comment
var commentSchema=mongoose.Schema({
  text:String,
  author:{
    id:{type:mongoose.Schema.Types.ObejctId, ref:"User"},
    username:String
          }
});
 
module.exports=mongoose.model("Comment",commentSchema);


