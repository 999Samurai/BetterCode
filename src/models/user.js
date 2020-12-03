export default class User {
    constructor(email, password, recaptcha) {
      this.email = email;
      this.password = password;
      this.recaptcha = recaptcha;
    }
  }