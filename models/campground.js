var mongoose=require("mongoose");
var campgroundchema=new mongoose.Schema({
  title:String,
  image:String,
  description:String,
  comments:[{   //via ref v r making the relation
    type:mongoose.Schema.Types.ObjectId,   //type
    ref:"Comment"     //name of model
  }]
});

var Campground=mongoose.model("Campground",campgroundchema);
module.exports=Campground;