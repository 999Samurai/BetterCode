 /*
  *   Installing dependencies
  */

const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const mysql      = require('mysql');
const jwt        = require('jsonwebtoken');
const multer     = require('multer');
const low        = require('lowdb')
const uuid       = require('node-uuid');
const nodemailer = require('nodemailer');
const request    = require('request');   

require('dotenv').config()

var storage = multer.diskStorage({ 
  destination: 'src/assets/images/avatars',
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".png");
  }
});

const avatarUpload = multer({ storage: storage });

const FileAsync = require('lowdb/adapters/FileAsync')

 /*
  *  Creating Node Mailer connection
  */

const transporter = nodemailer.createTransport({
  service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

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

const utils = require('./utils.js');

const User = require("./controllers/user.js");
const Projects = require("./controllers/projects.js");
const Auth = require("./controllers/auth.js");
const _auth = new Auth();
const _projects = new Projects(connection);
const user = new User(connection, process.env.RECAPTCHA_SECRET);

 /*
  *  Creating express environment
  */

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));

 /*
  *  API Routes
  */

const adapter = new FileAsync('database/confirmations.json')
low(adapter).then(db => {
  app.post("/api/login", async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;
    let recaptcha_token = req.body.recaptcha;

    if(email == "" || password == ""){
      // Empty form
      
      return res.send({status: "empty", message: "Some values of the form are empty."});
    }

    let captcha_status = await user.check_captcha(recaptcha_token);
    if(!captcha_status) {
      // The captcha token is invalid.

      return res.send({status: "captcha", message: "The recaptcha token is invalid."});
    }

    let get_results = await user.check_login(email);
    if(get_results == undefined) {
      // The email or password are wrong.

      return res.send({status: "fail", message: "Incorrect email or password."});
    }

    if(await user.verify_password(password, get_results.password)) {
        // Success.

        if(get_results.email_verified) {

          let user_id = get_results.id;
          let user_email = get_results.email;
          let user_name = get_results.username;
          let avatar = get_results.avatar;

          let planId = await user.getUserPlan(user_id);

          var token = jwt.sign({ user_id: user_id, user_email: user_email, user_name: user_name, avatar: avatar }, process.env.SECRET, {
            expiresIn: 43200 // expires in 12 hours
          });
          return res.send({status: "success", user: { auth: token, user_id: user_id, user_email: user_email, username: user_name, avatar: avatar, planId: planId }});
        } else {
          return res.send({status: "fail", message: "Please verify your email first."});
        }

      } else {

        // The email or password are wrong.

        return res.send({status: "fail", message: "Incorrect email or password."});
      }

  });

  app.post("/api/register", async (req, res) => {

    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let recaptcha_token = req.body.recaptcha;

    if(email == "" || username == "" || password == ""){
      // Empty form
      
      return res.send({status: "empty", message: "Some values of the form are empty."});
    }

    let captcha_status = await user.check_captcha(recaptcha_token);
    if(!captcha_status) {
      // The captcha token is invalid.

      return res.send({status: "fail", message: "The captcha token invalid."});
    }

    let email_status = await user.check_email(email);
    if(email_status) {
      // Email is already in use.

      return res.send({status: "fail", message: "The email that you inserted is already in use."});
    }

    let username_status = await user.check_user(username);
    if(username_status) {
      // Username is already in use.

      return res.send({status: "fail", message: "The username that you inserted is already in use."});
    }

    let hashed_password = await user.generate_hash(password);

    connection.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?);", [username, email, hashed_password], (err, rows) => {
      if(err) {
        if(err) console.log(err);
        res.send({status: "fail", message: "An unexpected error occurred, try again later."})
      } else {

        let generated_uuid = uuid.v4(); 

        db.get('emails')
        .push({ uuid: generated_uuid, email: email})
        .last()
        .write()

        let text_email = user.generate_email_text(generated_uuid);

        var mailOptions = {
          from: '"BetterCode" <bettercode.noreply@gmail.com>',
          to: email,
          subject: 'Verify your account',
          html: text_email
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {

            console.log(error);
            return res.send({status: "error", message:"Error while sending the email confirmation."});

          } else {

            return res.send({status: "success", message:"We have sent you a email, please confirm your email."});

          }
        });
      }
    });
  });

  app.get("/api/verification/:uuid", (req, res) => {

    let uuid = req.params.uuid;
    let get_info = db.get("emails").find({ uuid: uuid }).value();

    if(get_info != undefined) {
      
      let verified_email = get_info.email;
      db.get("emails").remove({uuid: uuid}).write();

      connection.query("UPDATE users SET email_verified = 1 WHERE email = ?", [verified_email], (err, rows) => {

        if(!err) {
          return res.redirect('http://localhost:8080?status=email_verified');
        } else {
          return res.redirect('http://localhost:8080?status=error_email');
        }
      })
    } else {
      return res.redirect('http://localhost:8080?status=error_email');
    }
  });

  app.get('/api/user/info/:id', async (req, res) => {

    let user_info = await user.get_user_info(req.params.id);
    let user_projects = await user.get_user_projects(req.params.id);

    if(Object.keys(user_info).length >= 0 && Object.keys(user_projects).length >= 0) {
      return res.status(200).send({success: true, projects: user_projects, user: { username: user_info[0].username, email: user_info[0].email, avatar: user_info[0].avatar, show_email: user_info[0].show_email, bio: user_info[0].bio}});
    } else {
      return res.status(200).send({success: false});
    }
  });

  app.get('/api/user/projects', _auth.verifyJWT, async (req, res, next) => {

    let projects = await user.get_user_projects(req.userId);
    if(Object.keys(projects).length >= 0) {
      return res.status(200).send({auth: true, projects: projects});
    } else {
      return res.status(200).send({auth: true, error: true});
    }
  });

  app.get('/api/user/settings', _auth.verifyJWT, async (req, res, next) => {

    let userSettings = await user.getUserSettings(req.userId);
    return res.status(200).send({auth: true, user: userSettings});
  });

  app.post('/api/user/settings', _auth.verifyJWT, async (req, res, next) => {

    let userInfo = await user.get_user_info(req.userId);

    if(userInfo[0].is_github) {

      let username_status = await user.check_user(req.body.username);
      if(username_status && userInfo[0].username != req.body.username) {
        // Username is already in use.
  
        return res.send({error: true, message: "The username that you inserted is already in use."});
      } else {
        await user.updateUserSettings(req.body, userInfo[0], req.userId);
        return res.status(200).send({auth: true, success: true, error: false});
      }
      
    } else {

      let password = req.body.password;

      let verifyPassword = await user.verify_password(password, userInfo[0].password);

      if(!verifyPassword){
        return res.status(200).send({auth: true, success: false});
      } else {
        let username_status = await user.check_user(req.body.username);
        if(username_status && userInfo[0].username != req.body.username) {
          // Username is already in use.
    
          return res.send({error: true, message: "The username that you inserted is already in use."});
        } else {
          await user.updateUserSettings(req.body, userInfo[0], req.userId);
          return res.status(200).send({auth: true, success: true, error: false});
        }
      }

    }
  });

  app.post('/api/user/recovery', async (req, res, next) => {

    let email = req.body.email;
    let recaptcha_token = req.body.recaptcha;

    let captcha_status = await user.check_captcha(recaptcha_token);
    if(!captcha_status) {
      // The captcha token is invalid.

      return res.send({status: "fail", message: "The captcha token is invalid."});
    }

    let account = await user.getAccountByEmail(email);
    if(account) {

      let generated_uuid = uuid.v4(); 

      db.get('password_reset')
      .push({ uuid: generated_uuid, userId: account.id })
      .last()
      .write()

      let textEmail = user.generateRecoveryText(generated_uuid);

      var mailOptions = {
        from: '"BetterCode" <bettercode.noreply@gmail.com>',
        to: email,
        subject: 'Recover your password',
        html: textEmail
      };
     
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } 
      });
    }

    return res.send({status: "success", message: "We have sent you the recovery link to your email."});

  });

  app.get('/api/user/recovery/:uuid', (req, res) => {

    let uuid = req.params.uuid;
    let get_info = db.get("password_reset").find({ uuid: uuid }).value();

    if(get_info != undefined) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(200).send({ success: false });
    }
  });

  app.post('/api/user/recovery/password', async (req, res) => {

    let password = req.body.password;
    let uuid = req.body.uuid;
    let get_info = db.get("password_reset").find({ uuid: uuid }).value();

    if(get_info != undefined) {

      let userId = get_info.userId;
      let hashedPassword = await user.generate_hash(password);

      await user.changePassword(userId, hashedPassword);

      db.get("password_reset").remove({uuid: uuid}).write();

      return res.status(200).send({ success: true });
    } else {
      return res.status(200).send({ success: false });
    }
  });

  app.post('/api/user/create', _auth.verifyJWT, async (req, res, next) => {

    let project = await user.create_user_project(req.userId, req.body.name);
    if(project) {
      let project_info = await _projects.get_info(project.insertId);
      return res.status(200).send({auth: true, success: true, project: project_info});
    } else {
      return res.status(200).send({auth: true, success: false});
    }
  });

  app.post("/api/user/avatar", [_auth.verifyJWT, avatarUpload.single('file'), async (req, res, next) => {

    let updateAvatar = await user.updateAvatar(req.file.filename, req.userId);
    if(updateAvatar) {
      return res.status(200).send({auth: true, success: true, avatar: req.file.filename});
    } else {
      return res.status(200).send({auth: true, success: false});
    }

  }]);

  app.post("/api/user/plan", _auth.verifyJWT, async (req, res, next) => {

    let userId = req.userId;
    let planId = req.body.planId;
    let paymentId = req.body.paymentId;
    let state = req.body.state;
    
    await user.updateUserPlan(userId, planId, paymentId, state);
    return res.status(200).send({ auth: true, success: true });

  });

  app.post('/api/projects/info', _auth.verifyJWT, async (req, res, next) => {

    let info = await _projects.get_info(req.body.id);
    if(Object.keys(info).length > 0) {
      return res.status(200).send({ auth: true, success: true, project: info});
    } else {
      return res.status(200).send({ auth: true, success: false });
    }

  });

  app.post('/api/projects/delete', _auth.verifyJWT, async (req, res, next) => {

    let projectId = req.body.id;
    let userInfo = await user.get_user_info(req.userId);
    await _projects.deleteProject(projectId, userInfo);
    return res.status(200).send({ auth: true, success: true });

  });

  app.post('/api/projects/clone', _auth.verifyJWT, async (req, res, next) => {

    let userId = req.userId;
    let projectId = req.body.id;

    let userInfo = await user.get_user_info(userId);
    let clonedProject = await _projects.get_info(projectId);

    let newProjectName = "Cloned from " + clonedProject[0].project_name;
    let clonedUserInfo = await user.get_user_info(clonedProject[0].creater_id);
    let createdProject = await user.create_user_project(userId, newProjectName);

    await _projects.cloneProject(userInfo, clonedUserInfo, clonedProject, newProjectName, createdProject);
    return res.status(200).send({ auth: true, success: true, project: createdProject });
    

  });

  app.post('/api/projects/:language/write/:id', _auth.verifyJWT, async (req, res, next) => {

    let info = await _projects.get_info(req.params.id);
    if(info) {
      let user_info = await user.get_user_info(info[0].creater_id);
      let write = await _projects.code_to_file(user_info[0].username, req.params.id, info[0].project_name, req.params.language, req.body.code);
      if(write) {
        return res.status(200).send({ auth: true, success: true });
      }
    } else {
      return res.status(200).send({ auth: true, success: false });
    }

  });

  app.get('/api/projects/:language/read/:id', _auth.verifyJWT, async (req, res, next) => {

    let info = await _projects.get_info(req.params.id);
    if(info) {
      let user_info = await user.get_user_info(info[0].creater_id);
      let read = await _projects.getFileContent(user_info[0].username, req.params.id, info[0].project_name, req.params.language);
      if(read) {
        return res.status(200).send({ auth: true, success: true, code: read });
      } else {
        return res.status(200).send({ auth: true, success: false });
      }
    } else {
      return res.status(200).send({ auth: true, success: false });
    }

  });
  
  app.post('/api/projects/update', _auth.verifyJWT, async (req, res, next) => {

    let user_info = await user.get_user_info(req.body.project.creater_id);
    let update = await _projects.update_project(req.body.project, user_info[0].username);
    if(update) {

      return res.status(200).send({ auth: true, success: true, project: update });

    } else {

      return res.status(200).send({ auth: true, success: false, project: req.body.project });

    }
    
  });

  app.post('/api/projects/thumbnail/:id', _auth.verifyJWT, async (req, res, next) => {

    let project_image = req.body.data;

    let info = await _projects.get_info(req.params.id);
    if(info) {
      await _projects.saveThumbnail(info, project_image);
    }

    return res.status(200).send({ auth: true });

  });

  app.get('/api/projects/:page', async (req, res) => {

    let projects = await _projects.getProjects(req.params.page);
    return res.status(200).send({ projects: projects });

  });

  app.get('/api/github/callback', (req, res) => {

    let code = req.query.code;

    if(code) {

      request.post({ url:'https://github.com/login/oauth/access_token', headers: { "Accept": "application/json" }, form: { client_id: process.env.GITHUB_CLIENTID, client_secret: process.env.GITHUB_SECRET, code: code }}, async function(err, response, body){ 

        if(!body.includes("error")) {

          let exchange = JSON.parse(body);
          let userEmail = await utils.getGithubEmail(exchange.access_token);
          let userUsername = await utils.getGithubUsername(exchange.access_token);

          if(!await user.checkGithub(userEmail)) {
            await user.registerGithub(userUsername, userEmail, userUsername + ".jpeg");
            await utils.downloadGithubImage(exchange.access_token);
          }

          let userId = await user.getIdGithub(userEmail);
          let avatar = userUsername + ".jpeg";

          var token = jwt.sign({ user_id: userId, user_email: userEmail, user_name: userUsername, avatar: avatar }, process.env.SECRET, {
            expiresIn: 43200 // expires in 12 hours
          });

          let planId = await user.getUserPlan(userId);

          return res.redirect(`http://localhost:8080/github?auth=${token}&user_id=${userId}&user_email=${userEmail}&username=${userUsername}&avatar=${avatar}&planId=${planId}`);

        } else {
          return res.status(200).send({ error: true, expired_code: true });
        }
      });
    } else {
      return res.status(200).send({ error: true });
    }
  });

}).then(() => {
  app.listen(port, () => console.log('listening on port 3000'))
})