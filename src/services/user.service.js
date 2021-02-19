import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/api/';

class UserService {

  getPasswordRecovery(email, recaptcha) {
    return axios.post(API_URL + 'user/recovery', { email: email, recaptcha: recaptcha });
  }
  
  checkRecovery(uuid) {
    return axios.get(API_URL + 'user/recovery/' + uuid);
  }

  changePassword(uuid, newPassword) {
    return axios.post(API_URL + 'user/recovery/password', { password: newPassword, uuid: uuid });
  }

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

  getProjectInfo(projectId) {
    return axios.post(API_URL + 'projects/info', {
      id: projectId
    }, { headers: authHeader() });
  }

  writeToFile(projectId, project_language, code) {
    return axios.post(API_URL + 'projects/' + project_language + '/write/' + projectId, {
      code: code
    }, { headers: authHeader() });
  }

  getFileContent(projectId, project_language) {
    return axios.get(API_URL + 'projects/' + project_language + '/read/' + projectId, { headers: authHeader() });
  }

  updateProject(project_settings) {
    return axios.post(API_URL + 'projects/update', { project: project_settings }, { headers: authHeader() });
  }

  deleteProject(projectId) {
    return axios.post(API_URL + 'projects/delete', { id: projectId }, { headers: authHeader() });
  }

  cloneProject(projectId) {
    return axios.post(API_URL + 'projects/clone', { id: projectId }, { headers: authHeader() });
  }

  updateThumbnail(projectId, project_thumbnail) {
    return axios.post(API_URL + 'projects/thumbnail/' + projectId, { data: project_thumbnail }, { headers: authHeader() }); 
  }

  updateSettings(user) {
    return axios.post(API_URL + 'user/settings', { username: user.username, show_email: user.show_email, bio: user.bio, password: user.password }, { headers: authHeader() });
  }

  updateUserPlan(planId, paymentId, state) {
    return axios.post(API_URL + 'user/plan', { planId: planId, paymentId: paymentId, state: state }, { headers: authHeader() });
  }

}

export default new UserService();