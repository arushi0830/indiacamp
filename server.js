var express=require("express");
var mongoose = require('mongoose');
var bodyParser=require("body-parser");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");

//passport-local-mogoose wala model/user mein hai
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
var seedDB=require("./seed.js");

var app=express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

//var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var url='mongodb+srv://'+process.env.USER+':'+process.env.SECRET+'@'+'cluster0-mvqoy.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false })

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

//seedDB();

//password configuration
//here require and use dono ek mein hi kr re hai
app.use(require("express-session")({
        secret:"my my",
        resave:false,
        saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
//now v want passport to use some fucntions of passport-local-mongoose,
//so v r writing those
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//as v have to pass req.user for nav bar taki uspe <li> accordingly display ho
app.use(function(req,res,next){
  res.locals.currentUser=req.user;
  next();
});

//CAMPGROUND ROUTES

/*Campground.create({
  title:"abc-hills",
  image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSeAFjOOK-i37FN_ilfp13bJ-HOmn673C2i2QRjPv417NnCu55i&usqp=CAU",
  description:"its beautiful but has nothing. so never ever come there. bt jada paise toh aajo"
}, function(err,z){
  if(err)
    console.log(err);
  else
    console.log(z);
});*/

app.get("/",function(req,res){
  res.render("landing");
});
//INDEX ROUTE
app.get("/campgrounds", function(req,res){
  Campground.find({}, function(err,allcamps){
    if(err)
      console.log(err);
    else
      {
        console.log("worked");
        res.render("campgrounds/index", {camps:allcamps});
      }
  });
  
});
//CREATE ROUTE
app.post("/campgrounds",isloggedin, function(req,res){
  var newdata={title: req.body.place, image: req.body.url, description:req.body.description ,
              author:{id:req.user._id, username:req.user.username} };
  //camps.push(newdata);
  //console.log(req.user)  it contains info abbt currently loggedin user,
  //agr used logged in nahi hai then it will be empty, bt ese ho ni sakta
  //coz our middelware is there which ensure ki user logged in ho
  Campground.create(newdata,function(err,newly){
    if(err)
      console.log(err);
    else
      res.redirect("/campgrounds");
  });
  
});
//NEW ROUTE
app.get("/campgrounds/new",isloggedin, function(req,res){
  res.render("campgrounds/new");
});
//SHOW ROUTE
app.get("/campgrounds/:id",function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err,z){
    if(err)
      console.log(err);
    else
      {
        console.log(z);
      res.render("campgrounds/show", {campground:z});
      }
  });
});


//edit route
app.get("/campgrounds/:id/edit",function(req,res){
  Campground.findById(req.params.id, function(err,z){
    if(err)
      {
        console.log(err);
        res.redirect("/campgrounds");
      }
    else
      {
        res.render("campgrounds/edit",{campground:z});
      }
  });    
});

//update route
app.put("/campgrounds/:id",function(req,res){
//  res.send("worked");
  
  //finc and update the correct campground
  //redirect somewhere
  Campground.findByIdAndUpdate(req.params.id, req.body.data, function(err,z){ 
    console.log(req.body.data);
    //req.body.data coz form mein name="data[name]" ....
    if(err)
      {
        console.log(err);
        res.redirect("/campgrounds");
      }
    else{
      res.redirect("/campgrounds/"+z._id);  //can also write req.params._id
    }
  });
  
});  

//delete route
app.delete("/campgrounds/:id",function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err,z){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }
    else
      res.redirect("/campgrounds");
  });
});




////////////comments routes

//new route
app.get("/campgrounds/:id/comments/new",isloggedin,function(req,res){
  Campground.findById(req.params.id,function(err,z){
    if(err)
      {
  //      console.log(z);
      console.log(err);
      res.redirect("/campgrounds/show"); //needed co logged in hai bt fir bhi sahi na chale then
      }
    else
      {
        console.log(z);
      res.render("comments/new",{campground:z});
      }
  });
  
});

//iadhr bhi middlware daalo coz someone can make a post route via postamn etc things
//create route
app.post("/campgrounds/:id/comments",isloggedin,function(req,res){
  //lookup campground using id
  //create new comment
  //connect new comment to campground
  //redirect campground show page
  Campground.findById(req.params.id,function(err,z){
    if(err)
      {
        console.log(err);
        res.redirect("/campgrounds/"+z._id);
      }
    else
      {
        console.log(req.body.comment);
        Comment.create(req.body.comment,function(err,x){
          if(err)
            console.log(err);
          else
            {
              //add username and id to comment
        //      console.log(req.user);
             x.author.id=req.user._id;
             x.author.username=req.user.username;
              //save comment
              x.save();
            z.comments.push(x); //comments naam ke array mein daal re hai joki comment ejs mein hai
            z.save(function(err,w){     //not necessary to use callbck here bt i did
              if(err)
                console.log(err);
              else
                res.redirect("/campgrounds/"+z._id);  
            });
            }
        });
      }
  });
});


//AUTH ROUTES

//show registeration form
app.get("/register",function(req,res){
  res.render("auth/register");
});

//handle sign up logic, agr same account se sign up dobara hoga then err aayega.
app.post("/register",function(req,res){
  User.register(new User({username:req.body.username}), req.body.password, function(err,z){
    if(err)
      {
      console.log(err);
        res.render("auth/register");
      }
    else
      {
        passport.authenticate("local")(req,res,function(){
          res.redirect("/campgrounds");
        });  //here if sign p sahi se ho gya then login kwa re
      }      //neeche in login its used as middleware coz before loggin in 
  });          //v have to check if the user is valid
});

//login
app.get("/login",function(req,res){
  res.render("auth/login");
});

//handling login logic, middleware use krna hai
app.post("/login",passport.authenticate("local",
          {successRedirect:"/campgrounds", failureRedirect:"/login"})
         ,function(req,res){ 
});

//logout route
app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/campgrounds");
});

//now v dont want user to add comments without loginor signup
//so uska middleware bna ri hai
function isloggedin(req,res,next){
  if(req.isAuthenticated()) 
    return next();
  else
    res.redirect("/login");
}


//midlleware for edit and delete campground
//now v r doing autherization here
//1st check: if user is logged in or not
//2nd :check if user is same as submitted by wala or not
//if not redirect
function checkOwernship(req,res,next){
  if(req.isAuthenticated())
    {
      Campground.findById(req.params.id, function(err,z){
        if(err)
          {
            console.log(err);
            res.redirect("/campgrounds");
          }
        else
          {
            //does user own the campground, cant do === coz ek object hai and ek string
            //so use equals function defined in mongoose
            if(z.author.id.equals(req.user._id){
               res.render("/campgrounds/edit",{campground:z})
               })
             else
               res.send()
          }
      });
    }
  else
    {
      
    }
}

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("yelp camp server started");
});