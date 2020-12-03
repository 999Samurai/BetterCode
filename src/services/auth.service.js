import axios from 'axios';

const API_URL = 'http://localhost:3000/api/';

class AuthService {
  login(data) {
    return axios
      .post(API_URL + 'login', {
        email: data.email,
        password: data.password,
        recaptcha: data.recaptcha
      })
      .then(response => {
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data.user;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(data) {
    return axios.post(API_URL + 'register', {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        username: data.username,
        password: data.password,
        recaptcha: data.recaptcha
    });
  }
}

export default new AuthService();