export default class User {
    constructor(email, username, password, recaptcha) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.recaptcha = recaptcha;
    }
  }