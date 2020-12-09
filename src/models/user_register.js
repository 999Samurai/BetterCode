export default class User {
    constructor(first_name, last_name, email, username, password, recaptcha) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.username = username;
        this.password = password;
        this.recaptcha = recaptcha;
    }
  }