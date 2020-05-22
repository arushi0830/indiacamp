var mongoose=require("mongoose");
var campgroundchema=new mongoose.Schema({
  title:String,
  image:String,
  description:String,
  author:{   //ek user hi bna sakta hai campground,so wo bhi link kr re hai
    id:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    username:String
  },
  comments:[{   //via ref v r making the relation
    type:mongoose.Schema.Types.ObjectId,   //type
    ref:"Comment"     //name of model
  }]
});

var Campground=mongoose.model("Campground",campgroundchema);
module.exports=Campground;