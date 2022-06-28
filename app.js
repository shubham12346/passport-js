const express = require('express');
const app = express();
const{connectMongoose ,User} = require("./database");
const ejs = require("ejs");
const bodyparser= require('body-parser');

const passport = require('passport');
const {initilizePassport ,isAuthenticated} = require('./passport-config');
const expressSession =require('express-session');

connectMongoose();

initilizePassport(passport);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");

app.use(expressSession({secret :"secret",resave:false,saveUninitialized :false}));

app.use(passport.initialize());
app.use(passport.session());




app.get("/" ,function(req,res)
{
    res.render("index")
})
app.get("/register",function(req,res)
{
    res.render("register");
})
app.get("/login",function(req,res)
{
    res.render("login");
})

app.post("/register",async (req,res)=>{
    const user = await User.findOne({username:req.body.username});
    if(user) return res.status(400).send("user already exist");

    const newUser = await User.create(req.body);

    res.status(201).send(newUser);
})

app.post("/login",passport.authenticate("local",{failureRedirect:"/register" }),function(req,res)
{
    res.redirect('/profile');
}
);

app.get("/profile",isAuthenticated,(req,res)=>{
    res.send(req.user);
})
app.get("/logout",function(req,res){
    req.logOut(function()
    {
        console.log("logged out");
    });
    res.redirect("/");
})

app.listen(3000,function(req,res)
{
    console.log("Server running ");
})