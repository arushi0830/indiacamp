var mongoose=require("mongoose");

//commnet ko user se link krna hai,so comment mein v did changes coz comment
//is dependent on users, bt user is not dependent on comment

/*var commentSchema=mongoose.Schema({
  text:String,
  author:{
    id:{type:mongoose.Schema.Types.ObejctId, ref:"User"},
    username:String
          }
});*/

var commentSchema=new mongoose.Schema({
  text:String,
  author:{   //via ref v r making the relation
    id:{
    type:mongoose.Schema.Types.ObjectId,   //type
    ref:"User"     //name of model
    },
    username:String
  }
});
 
module.exports=mongoose.model("Comment",commentSchema);


