const request  = require('request');
const fs       = require('fs');
const path     = require('path');

const utils = {

    downloadGithubImage(access_token){
      request.get({ url: 'https://api.github.com/user', headers: { "Authorization": `token ${access_token}`, 'User-Agent': 'node.js',  "Accept": "application/json" }}, function(err, response, user_body){

        let json_body = JSON.parse(user_body);

        request.head(json_body.avatar_url, function(err, res, body){

          let filename = json_body.login + ".jpeg";
          let filepath = path.join(__dirname, '../', 'assets/images/avatars/' + filename);
      
          request(json_body.avatar_url).pipe(fs.createWriteStream(filepath));
        });      
      });
    },
      
    getGithubEmail(access_token) {
      return new Promise((resolve, reject) => {
        request.get({ url: 'https://api.github.com/user/emails', headers: { "Authorization": `token ${access_token}`, 'User-Agent': 'node.js',  "Accept": "application/json" }}, function(err, response, user_body){
          let user_data = JSON.parse(user_body);
          resolve(user_data[0].email);
        });
      });
    },
      
    getGithubUsername(access_token) {
      return new Promise((resolve, reject) => {
        request.get({ url: 'https://api.github.com/user', headers: { "Authorization": `token ${access_token}`, 'User-Agent': 'node.js',  "Accept": "application/json" }}, function(err, response, user_body){
          let user_data = JSON.parse(user_body);    
          resolve(user_data.login);
        });
      });
    } 
}

module.exports = utils;