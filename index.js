const express=require('express');
const path=require("path");
const bodyParser = require("body-parser");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
let ejs=require('ejs');
const mysql = require('mysql');

app.set("view engine","ejs");

//database connection

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "smash1551"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("USE Imagiminds",(err,res)=>{
            if(err)
                throw err;
            console.log("Database changed");
    });
});

//GET commands

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
})

app.get("/register",(req,res)=>{
    res.sendFile(path.join(__dirname,"register.html"));
})

app.get("/about",(req,res)=>{
    res.sendFile(path.join(__dirname,"about.html"));
})

app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"login.html"));
})

app.get("/contact",(req,res)=>{
    res.sendFile(path.join(__dirname,"contact.html"));
})

app.get("/elements",(req,res)=>{
    res.sendFile(path.join(__dirname,"elements.html"));
})

app.get("/courses",(req,res)=>{
    res.sendFile(path.join(__dirname,"courses.html"));
})

//POST Commands

app.post("/register",function(req,res){
    var n=req.body.name;
    var e=req.body.email;
    var p1=req.body.pass1;
    var p2=req.body.pass2;
    if(p1==p2)
    {
        var q1="SELECT email FROM newusers WHERE email='"+e+"'";
        con.query(q1,(err,resp)=>{
            if(err)
                throw err;
            if(resp.length===0)
            {
                var q2="INSERT INTO newusers(name,email,password) VALUES(?,?,?);";
                var data=[n,e,p1];
                con.query(q2,data,(err,r)=>{
                    if(err)
                        throw err;
                    console.log("Registration successful");
                    res.sendFile(path.join(__dirname,"login.html"));
                });
            }
            else
                res.send("Email already in use");
        })
    }
    else
    {
        res.send("Passwords must match");
    }
})

app.post("/login",(req,res)=>{
    var e=req.body.name;
    var p=req.body.password;
    const search=(e,p)=>{
        const q="SELECT * FROM newusers WHERE email =? AND password =?;";
        con.query(q,[e,p],(err,r)=>{
            if(err)
                throw(err);
            if(r.length==0)
                res.send("No such user");
            else
                console.log(r);
                res.send("Logged in");
        })
    }
})

app.listen( process.env.PORT || 3000,function(req,res){
    console.log("started");
});
  
