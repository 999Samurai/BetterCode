import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/api/';

class UserService {

  getUserProjects() {
    return axios.get(API_URL + 'user/projects', { headers: authHeader() });
  }

  getCommunityProjects(page) {
    return axios.get(API_URL + 'projects/' + page);
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

  updateThumbnail(project_id, project_thumbnail) {
    return axios.post(API_URL + 'projects/thumbnail/' + project_id, { data: project_thumbnail }, { headers: authHeader() }); 
  }
}

export default new UserService();