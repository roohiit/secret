require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();


console.log(process.env.API_KEY);  //using this we can accesss environment variables

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true , useUnifiedTopology: true });

//---Encryption ecurity part----mongoose-encryption installed and required//
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// const secret = "Thisisourlittlesecret.";
const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"] });
//This is binary encryption based on the secret key----type this mefore mongoose model//
//--for further security install npm i dotenv and require it as at top of code --//
//--now in main folder create the file named as .env//
//Comment the secret key and write it into .env file//

const User = new mongoose.model("user", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});


app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username},function(err, foundUser){
    if(err){
      console.log(err);
    }else {
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }

  });
})









app.listen(3000, function(){
  console.log("Server is running at port 3000");
})
