const bcrypt = require('bcrypt');
const fetch = require('isomorphic-fetch');
const path = require('path');
const fs = require('fs');

class User {

    constructor(con, secret) {
        this.con = con;
        this.captcha_secret = secret; 
    }

    check_email(email) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT COUNT(*) AS total FROM users WHERE email = ?', [email], function (error, results) {
                if(!error){
                    return resolve(results[0].total > 0);
                } else {
                    return resolve(false);
                }
              }
            );
        });
    } 
    
    check_user(username) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT COUNT(*) AS total FROM users WHERE username = ?', [username], function (error, results) {
                if(!error){
                    return resolve(results[0].total > 0);
                } else {
                    return resolve(false);
                }
              }
            );
        });
    }

    check_login(email) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT * FROM users WHERE email = ? AND is_github = 0;', [email], function (error, results) {
                if(!error){
                    return resolve(results[0]);
                } else {
                    return resolve(error);
                }
            });
        });
    }

    get_user_info(user_id) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT * FROM users WHERE id = ?', [user_id], function (error, results) {
                if(!error) {
                    return resolve(results);
                } else {
                    return resolve(false);
                }
            })
        });
    }

    generate_hash(password) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    return resolve(hash);
                });
            });

        });
    }

    verify_password(password, hash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, function(err, result) {
                return resolve(result);
            });
        })
    }

    check_captcha(token) {
        return new Promise((resolve, reject) => {
            fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${this.captcha_secret}&response=${token}`, 
                { method: "POST"}).then(response => response.json()).then(function(google_response) {
                if(google_response["success"] == true) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }

    registerGithub(username, email, avatar) {
        return new Promise((resolve, reject) => {
            this.con.query('INSERT INTO users(username, email, avatar, is_github, email_verified) VALUES (?, ?, ?, 1, 1)', [username, email, avatar], function (error, result) {
                if(!error) {
                    return resolve(result.insertId);
                } else {
                    return resolve(false);
                }
            })
        });
    }

    checkGithub(email) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT COUNT(*) as total FROM users WHERE email = ? AND is_github = 1', [email], function (error, result) {
                if(!error) {
                    return resolve(result[0].total > 0);
                } else {
                    return resolve(false);
                }
            })
        });
    }

    getIdGithub(email) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT id FROM users WHERE email = ? AND is_github = 1', [email], function (error, result) {
                if(!error) {
                    return resolve(result[0].id);
                } else {
                    return resolve(false);
                }
            })
        });
    }

    get_user_projects(user_id) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT * FROM projects WHERE creater_id = ?', [user_id], function (error, results) {
                if(!error) {
                    return resolve(results);
                } else {
                    return resolve(false);
                }
            })
        });
    }

    getUserSettings(userId) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT username, bio, show_email, is_github FROM users WHERE id = ?', [userId], function (error, result) {
                if(!error) {
                    return resolve(result[0]);
                } else {
                    return resolve(false);
                }
            });
        });
    }
    
    updateUserSettings(userSettings, oldSettings, userId) {

        let oldProjectPath = path.join(__dirname, '../../', 'projects/' + oldSettings.username);
        let newProjectPath = path.join(__dirname, '../../', 'projects/' + userSettings.username);

        if (fs.existsSync(oldProjectPath)){
            fs.renameSync(oldProjectPath, newProjectPath);
        }

        return new Promise((resolve, reject) => {
            this.con.query('UPDATE users SET username = ?, bio = ?, show_email = ? WHERE id = ?', [userSettings.username, userSettings.bio, userSettings.show_email, userId], function (error, result) {
                if(!error) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }

    create_user_project(user_id, project_name) {
        return new Promise((resolve, reject) => {
            this.con.query('INSERT INTO projects (project_name, creater_id) VALUES (?, ?)', [project_name, user_id], function (error, result) {
                if(!error) {
                    return resolve(result);
                } else {
                    return resolve(false);
                }
            });
        });
    }

    updateAvatar(avatarPath, userId) {
        return new Promise(async (resolve, reject) => {

            let OldAvatar = await this.get_user_info(userId);
            let oldAvatarPath = path.join(__dirname, '../../', 'assets/images/avatars/' + OldAvatar[0].avatar);

            fs.unlink(oldAvatarPath, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            });

            this.con.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarPath, userId], function (error, results) {
                if(!error) {
                    return resolve(true);
                } else {
                    return reject("Error updating the avatar field.");
                }
            });
        });
    }
    
    updateUserPlan(userId, planId, paymentId, state) {
        return new Promise(async (resolve, reject) => {

            this.con.query('INSERT INTO plans_history(user_id, plan_id, payment_id, status) VALUES (?, ?, ?, ?)', [userId, planId, paymentId, state], function (error, result) {
                if(!error) {
                    return resolve(result);
                } else {
                    return resolve(false);
                }
            });

        });
    }

    getUserPlan(userId) {
        return new Promise(async (resolve, reject) => {

            this.con.query('SELECT * FROM plans_history WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId], function (error, result) {
                if(!error) {
                    try {
                        return resolve(result[0].plan_id);
                    } catch {
                        return resolve(0);
                    }
                } else {
                    return resolve(false);
                }
            });

        });
    }



    generate_email_text(uuid) {
            return (`<!doctype html>
            <html>
            
            <head>
                <meta name="viewport" content="width=3Ddevice-width, initial-scale 1.0">
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8
            ">
            
                <style type="text/css" rel="stylesheet" media="all">
                    /* Media Queries */
                    @media  only screen and (max-width: 500px) {
                        .button {
                            width: 100% !important;
                        }
                    }
                </style>
            </head>
            
            
            
            <body style="box-sizing: border-box; font-family: -apple-system, BlinkMac SystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -webkit-text-size-adjust: none; color: #718096; height: 100%; line-height: 1.4; margin: 0; padding: 0; width: 100%; background-color: #F2F4F6;">
                <table width="100%" cellpadding="0" cellspacing="0" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI E=
            moji', 'Segoe UI Symbol'; position: relative;">
                    <tr>
                        <td style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; width: 100%; margin: 0; padding: 0; background-color: #F2F4F6;" align="center">
                            <table width="100%" cellpadding="0" cellspacing="0" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                <!-- Logo -->
                                <tr>
                                    <td style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; padding: 25px 0; text-align: center;">
                                        <a style="box-sizing: border-box; position: relative; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; font-weight: bold; color: #2F3133; text-decoration: none; text-shadow: 0 1px 0 white;">
                                            BetterCode
                                        </a>
                                    </td>
                                </tr>
            
                                <!-- Email Body -->
                                <tr>
                                    <td style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; width: 100%; margin: 0; padding: 0; border-top: 1px solid #EDEF2; border-bottom: 1px solid #EDEFF2; background-color: #FFF;" width="100%">
                                        <table style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; width: auto; max-width: 570px; margin: 0 auto; padding: 0;" align="center" width="570" cellpadding=3D"0" cellspacing=3D"0">
                                            <tr>
                                                <td style="box-sizing: border-box; position: relative; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; padding: 35px;">
                                                    <!-- Greeting -->
                                                    <h1 style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; margin-top: 0; color: #2F3133; font-size: 19px; font-weight: bold; text-align: left;">
                                                                                 Hello!
                                                                     </h1>
            
                                                    <!-- Intro -->
                                                                                       
                     <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; text-align: left; margin-top: 0; color: #74787E; font-size: 16px; line-height: 1.5em;">
                                                            Please click the button below to verify your email address.
                                                        </p>
                                                    <!-- Action Button -->
                                                                                       
                     <table style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; width: 100%; margin: 30px auto; padding: 0; text-align: center;" align="center" width="100%" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td align="center" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                                                    <a href="http://localhost:3000/api/verification/${uuid}" style="box-sizing: border-box; position: relative; overflow: hidden; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; display: inline-block; width: 200px; min-height: 20px; padding: 10px; background-color: #3869D4; border-radius: 3px; color: #ffffff; font-size: 15px; line-height: 25px; text-align: center; text-decoration: none; -webkit-text-size-adjust: none;" class="button" target="_blank">
                                                                        Verify Email Address
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    <!-- Outro -->
                     <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; text-align: left; margin-top: 0; color: #74787E; font-size: 16px; line-height: 1.5em;">
                                                            If you did not create an account, no further action is required.
                                                        </p>
                                                                                   <!-- Salutation -->
                                                    <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; text-align: left; margin-top: 0; color: #74787E; font-size: 16px; line-height: 1.5em;">
                                                        Regards, BetterCode
                                                    </p>
            
                                                    <!-- Sub Copy -->
                     <table style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; margin-top: 25px; padding-top: 25px; border-top: 1px solid #EDEFF2;">
                                                            <tr>
                                                                <td style="box-sizing: border-box; position: relative; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;">
                                                                    <p style="box-siz=
            ing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; text-align: left; margin-top: 0; color: #74787E; font-size: 12px; line-height: 1.5em;">
                                                                        If you're having trouble clicking the "Verify Email Address" button,
                                                                        copy and paste the URL below into your web browser:
                                                                    </p>
            
                                                                    <p style="box-siz=
            ing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; text-align: left; margin-top: 0; color: #74787E; font-size: 12px; line-height: 1.5em;">
                                                                        <a style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; color: #3869D4;" href="http://localhost:3000/api/verification/${uuid}" target="_blank">
            http://localhost:3000/api/verification/${uuid}
                                                                        </a>
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                 </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
            
                                <!-- Footer -->
                                <tr>
                                    <td style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                        <table style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; width: auto; max-width: 570px; margin: 0 auto; padding: 0; text-align: center;" align="center" width="570" cellpadding="0" ce=
            llspacing="0">
                                            <tr>
                                                <td style="box-sizing: border-box; position: relative; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #AEAEAE; padding: 35px; text-align: center;">
                                                    <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; text-align: left; margin-top: 0; color: #74787E; font-size: 12px; line-height: 1.5em;">
                                                        2020 - 2021
                                                        <a style=3D"box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; color: #3869D4;">BetterCode</a>.
                                                        All rights reserved.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>`);
    }
    
}


module.exports = User;