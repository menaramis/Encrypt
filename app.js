require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
const PORT = 4002;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

try{
  mongoose.connect("mongodb://localhost:27017/userDB");
console.log("Database Connected Successfully..")
}catch(err){console.log(err);}

const userSchmea = new mongoose.Schema ({
  email: String,
  password: String
});


userSchmea.plugin(encrypt, {secret: process.env.SECRET , encryptedFields:["password"]});
//, encryptedFields:["password"]
//for Adding More Fields to encrypt, Add in Array with "password".
// without encryptedfields, the Entire Database will be encrypted (All User Data)

const User = new mongoose.model("User", userSchmea);



app.get('/', function(req, res){
  res.render("home");
})
app.get('/login', function(req, res){
  res.render("login");
})

app.get('/register', function(req, res){
  res.render("register");
})

app.post('/register', function(req, res){
  const newUser = new User({
    email: req.body.username,
    password:req.body.password
  });
newUser.save(function(err){if(err){console.log(err)}else{res.render("secrets")}});
})


app.post('/login', function(req, res){
const username = req.body.username;
const password = req.body.password;

User.findOne({email:username}, function(err, FoundUser){
  if(err){console.log(err)}else{
    if(FoundUser){
      if(FoundUser.password === password){res.render("secrets")}else{res.redirect("/register")}

    }//END IF FOUNDUSER
  }//END OF ELSE ERROR
})


})//END OF APP.POST

app.listen(PORT, function(){
  console.log(`Server is running @ ${PORT}`);
})
