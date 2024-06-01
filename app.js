const express = require('express') ;
const path = require('path');
const app  = express() ;
const bcrypt = require('bcrypt');
const userModel = require('./models/user');
const { hash } = require('crypto');
const user = require('./models/user');
const cookieParser = require('cookie-parser');
const { ConnectionStates } = require('mongoose');
const { Console } = require('console');
const jwt = require('jsonwebtoken');

app.use(cookieParser());
app.set("view engine" , "ejs")
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,"public")))
app.get("/",(req,res)=>{
    res.render("index")
})
app.post("/create", (req,res)=>{
    let {name,email,password} = req.body;
    const token = jwt.sign(email,"secret")
            res.cookie("Token" , token);
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            let user = await  userModel.create({
                name,
                password : hash ,
                email,
                })
            })
    })
   
    res.send("Done")
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/logout",(req,res)=>{
    res.cookie("Token" , "");
    res.redirect("/");
})
app.post("/login",async (req,res)=>{
let user = await userModel.findOne({email : req.body.email});
if(!user) return res.send("somthing went wrong");
if(user){
    bcrypt.compare(req.body.password,user.password,(err,result)=>{
        if(result) {
          return  res.send("you loged in")
        }else{
          return  res.send("Somthing went wrong")
        }
    })
}
})
app.listen(3000)