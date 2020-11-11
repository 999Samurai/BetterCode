 /*
  *   Installing dependencies
  */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session')
const mysql = require('mysql');

 /*
  *  Librarys to generate a unique session id
  */

const crypto = require('crypto');
const uuid = require('node-uuid');

/*
 *  Creating the connection to the database 
 */

var config = require("../../config/database");
var connection = mysql.createConnection(config);
connection.connect();

/*
 *  Creating the web app and defining the port
 */

const app = express();
const port = 3000;

/*
 *  Importing controllers
 */

const User = require("./controllers/user.js")

 /*
  *  Creating sessions environment
  */

app.use(session({
  secret: 'BetterCode_Secret', 
  cookie: { maxAge: 60000 },
  genid: function(req){
    return crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");
  }
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

 /*
  *  API Routes
  */

app.get('/api/check_session', (req, res) => {
  if(req.session.username) {
    res.send({status: "success", username: "${req.session.username}"});
  } else if (!req.session.username) {
    res.send({status: "fail", message: "Your session expired or never existed."})
  } else {
    res.send({status: "error", message: "The request returned an error."})
  }
})

app.get("/api/login", (req, res) => {

  let username = req.body.username;
  let password = req.body.password;
  let recaptcha_token = req.body.recaptcha_token;

})

app.post("/api/register", async (req, res) => {

  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  
  if(first_name == "" || last_name == "" || email == "" || username == "" || password == ""){
    // Empty form
    
    res.send({status: "empty", message: "Some value of the form is empty."});
    return;
  }

  let user = new User(connection);

  let email_status = await user.check_email(email);
  if(email_status) {
    // Email is already in use.

    res.send({status: "fail", message: "The email that you inserted is already in use."});
    return;
  }

  let username_status = await user.check_user(username);
  if(username_status) {
    // Username is already in use.

    res.send({status: "fail", message: "The username that you inserted is already in use."});
    return;
  }

  let hashed_password = await user.generate_hash(password);

  connection.query("INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?);", [first_name, last_name, username, email, hashed_password], (err, rows) => {
    if(err) {
      if(err) console.log(err);
      res.send({status: "fail", message: "An unexpected error occurred, try again later."})
    } else {
      res.send({status: "success", message:"Account created with success, redirecting in 5 seconds."})
    }
  });
})

app.get("/api/github/callback", (req, res) => {

  console.log(req.query.code)

})

app.listen(port, () => {
  console.log(`BetterCode API listening at http://localhost:${port}`)
})
