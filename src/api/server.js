 /*
  *   Installing dependencies
  */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session')
const mysql = require('mysql');

 /*
  *  Creating the MySQL connection to the database
  */

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bettercode"
});

 /*
  *  Librarys to generate a unique session id
  */

const crypto = require('crypto');
const uuid = require('node-uuid');

const app = express();
const port = 3000;

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
    res.send(`{"status": "success", "username": "${req.session.username}"}`);
  } else if (!req.session.username) {
    res.send(`{"status": "fail", "message": "Your session expired or never existed."}`)
  } else {
    res.send(`{"status": "error", "message": "The request returned an error."}`)
  }
})

app.get("/api/login", (req, res) => {

  let username = req.body.username;
  let password = req.body.password;
  let recaptcha_token = req.body.recaptcha_token;

})

app.get("/api/register", (req, res) => {

  

})

app.get("/api/github/callback", (req, res) => {

  console.log(req.query.code)

})

app.listen(port, () => {
  console.log(`BetterCode API listening at http://localhost:${port}`)
})
