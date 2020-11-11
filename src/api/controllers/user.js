const password_hash = require('password-hash');

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

    check_login(email, password) {
        return new Promise((resolve, reject) => {
            let user_password = this.generate_hash(password);
            this.con.query('SELECT * FROM users WHERE email = ? AND password = ? AND is_github = 0;', [email, user_password], function (error, results) {
                if(!error){
                    return resolve(results[0]);
                } else {
                    return;
                }
              }
            );
        });
    }

    generate_hash(password) {
        return new Promise((resolve, reject) => {
            return resolve(password_hash.generate(password));
        });
    }
    
}


module.exports = User;