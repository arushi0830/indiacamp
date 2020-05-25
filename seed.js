/*var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var data=[{
          title:"lily laake",
          image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSeAFjOOK-i37FN_ilfp13bJ-HOmn673C2i2QRjPv417NnCu55i&usqp=CAU",
          description:"gdagcgcb c cyudgcdbc dsnc cbdcbdhcbds"
        },
         {
          title:"lily laake",
          image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSeAFjOOK-i37FN_ilfp13bJ-HOmn673C2i2QRjPv417NnCu55i&usqp=CAU",
          description:"gdagcgcb c cyudgcdbc dsnc cbdcbdhcbds"
         },
        {
          title:"lily laake",
          image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSeAFjOOK-i37FN_ilfp13bJ-HOmn673C2i2QRjPv417NnCu55i&usqp=CAU",
          description:"gdagcgcb c cyudgcdbc dsnc cbdcbdhcbds"
         }];

function seedDB(){
  //remove data
  Campground.remove({},function(err){
    if(err)
      console.log(err);
    else
      {
        console.log("removed");
        //add data
        data.forEach(function(z){
          Campground.create(z,function(err,x){
            if(err)
              console.log(err);
            else{
              console.log("created new entry now");
              //create comment
              Comment.create({
                text:"cudfufcd",
                author:"i"
              },function(err,comment){
                if(err)
                  console.log(err);
                else
                  {
                    console.log("created new comment");
                    x.comments.push(comment);
                    x.save();
                  }
              }
            );
          }
        });
  });
}
});
};
module.exports=seedDB;*/
