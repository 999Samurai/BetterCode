import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/api/';

class UserService {

  getPublicUserInfo(user_id) {
    return axios.get(API_URL + 'user/info/' + user_id);
  }

  getUserProjects() {
    return axios.get(API_URL + 'user/projects', { headers: authHeader() });
  }

  getCommunityProjects(page) {
    return axios.get(API_URL + 'projects/' + page);
  }

  getUserSettings() {
    return axios.get(API_URL + 'user/settings', { headers: authHeader() });
  }

  createProject(project_name) {
    return axios.post(API_URL + 'user/create', {
        name: project_name
    }, { headers: authHeader() });
  }

  getProjectInfo(project_id) {
    return axios.post(API_URL + 'projects/info', {
      id: project_id
    }, { headers: authHeader() });
  }

  writeToFile(project_id, project_language, code) {
    return axios.post(API_URL + 'projects/' + project_language + '/write/' + project_id, {
      code: code
    }, { headers: authHeader() });
  }

  getFileContent(project_id, project_language) {
    return axios.get(API_URL + 'projects/' + project_language + '/read/' + project_id, { headers: authHeader() });
  }

  updateProject(project_settings) {
    return axios.post(API_URL + 'projects/update', { project: project_settings }, { headers: authHeader() });
  }

  deleteProject(project_id) {
    return axios.post(API_URL + 'projects/delete', { id: project_id }, { headers: authHeader() });
  }

  updateThumbnail(project_id, project_thumbnail) {
    return axios.post(API_URL + 'projects/thumbnail/' + project_id, { data: project_thumbnail }, { headers: authHeader() }); 
  }

  updateSettings(user) {
    return axios.post(API_URL + 'user/settings', { username: user.username, show_email: user.show_email, bio: user.bio, password: user.password }, { headers: authHeader() });
  }
}

export default new UserService();