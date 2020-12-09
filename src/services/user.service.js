import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/api/';

class UserService {
  getUserProjects() {
    return axios.get(API_URL + 'user/projects', { headers: authHeader() });
  }

  CreateProject(project_name) {
    return axios.post(API_URL + 'user/create', {
        name: project_name
    }, { headers: authHeader() });
  }
}

export default new UserService();