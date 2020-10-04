const express=require('express');
const path=require("path");
const bodyParser = require("body-parser");
const app=express();
const nodemailer = require("nodemailer");
var jwt = require('jwt-simple');

let transporter = nodemailer.createTransport({
    service : "gmail",
    auth :{
        user:'amalaks115@gmail.com',
        pass:'*********'
    },
    tls :{
        rejectUnauthorized : false
    }
});

transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });



app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
let ejs=require('ejs');
const mysql = require('mysql');
app.use(express.json());

 
//var db=require('./database.js');

app.set("view engine","ejs");

//database connection

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "**********"
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

app.get("/reset-password",(req,res)=>{
    res.sendFile(path.join(__dirname,"reset.html"));
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

app.get("/resetpassword",(req,res)=>{
   // var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';
    //var payload = jwt.decode(req.params.token, secret);
    console.log("reset");
    res.sendFile(path.join(__dirname,"reset-password.html"));

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
    var e=req.body.email;
    var p=req.body.password;
    console.log(e," ",p);
    console.log("hai");
    if(e!=null && p!=null)
    {
        const q="SELECT * FROM newusers WHERE email=? AND password=?" ;
        con.query(q,[e,p],(err,r)=>{
            if(r.length>0){
                console.log("hello");
               console.log(r[0].name);
               name=r[0].name;
               res.render("userhomepage",{name:name})
            }
            else{
                res.send("Incorrect email and/or password");
            }
        }) 
    }
    else{
        res.send("Please enter email and password");
    }
}) 

app.post("/forgot",(req,res)=>{
  var e= req.body.email;
  const q="SELECT * FROM newusers WHERE email=?;"
  con.query(q,[e],(err,r)=>{
        if(r.length>0)
        {
           // pass = r.password;
            console.log(r[0].email+" "+r[0].password);
           /* var payload={
                email : e
            }  
            var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';
            var token = jwt.encode(payload,secret); */
            let mailDetails={
                from :'amalaks115@gmail.com',
                to : e,
                subject :'Reset password',
                html : '<a href="http://localhost:3000/resetpassword">Reset password</a>'
            };
                
            transporter.sendMail(mailDetails,(err,data)=>{
                if(err)
                    console.log(err);
                else
                    console.log("mail sent");
            })
            res.send("check your inbox");
        }   
        else
            res.send("No such user");
  })
})

app.post("/reset",(req,res)=>{
   var p1=req.body.password;
   var p2=req.body.pass2;
   res.send("reset");
})

app.listen( process.env.PORT || 3000,function(req,res){
    console.log("started");
});
  
