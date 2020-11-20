const bcrypt = require('bcrypt');
const fetch = require('isomorphic-fetch');

class User {

    constructor(con) {
        this.con = con;
    }

    check_email(email) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT COUNT(*) AS total FROM users WHERE email = ?', [email], function (error, results) {
                if(!error){
                    return resolve(results[0].total > 0);
                } else {
                    return;
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
                    return;
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
            fetch(`https://www.google.com/recaptcha/api/siteverify?secret=6LfGC9gZAAAAAIbvNguNArdKUUDx3XEnbxE2O8ww&response=${token}`, 
                { method: "POST"}).then(response => response.json()).then(function(google_response) {
                if(google_response["success"] == true) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }
    
}


module.exports = User;