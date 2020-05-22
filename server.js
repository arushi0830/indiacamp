var express=require("express");
var mongoose = require('mongoose');
var bodyParser=require("body-parser");
var passport=require("passport");
var LocalStrategy=require("passport-local");
//passport-local-mogoose wala model/user mein hai
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
var seedDB=require("./seed.js");

var app=express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var url='mongodb+srv://'+process.env.USER+':'+process.env.SECRET+'@'+'cluster0-mvqoy.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

seedDB();

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
app.post("/campgrounds", function(req,res){
  var newdata={title: req.body.place, image: req.body.url, description:req.body.description};
  //camps.push(newdata);
  Campground.create(newdata,function(err,newly){
    if(err)
      console.log(err);
    else
      res.redirect("/campgrounds");
  });
  
});
//NEW ROUTE
app.get("/campgrounds/new", function(req,res){
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

////////////comments routes

//new route
app.get("/campgrounds/:id/comments/new",function(req,res){
  Campground.findById(req.params.id,function(err,z){
    if(err)
      console.log(err);
    else
      {
        console.log(z);
      res.render("comments/new",{campground:z});
      }
  });
  
});

//create route
app.post("/campgrounds/:id/comments",function(req,res){
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
        res.render("register");
      }
    else
      {
        passport.authenticate("local")(req,res,function(){
          res.redirect("/campgrounds");
        });  //here if l
      }
  });
});

//login
app.get("/login",function(req,res){
  res.render("auth/login");
});

//handling login logic, middleware use krna hai
app.post("/logic",passport.authenticate("local",
          {successRedirect:"/campgrounds", failureRedirect:"/login"})
         ,function(req,res){ 
});


app.listen(process.env.PORT, process.env.IP, function(){
  console.log("yelp camp server started");
});