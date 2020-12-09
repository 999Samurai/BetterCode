import AuthService from '../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, data) {
      return AuthService.login(data).then(response => {

        if(response.auth) {

          commit('loginSuccess', response);
          return Promise.resolve(response);

        } else {

          commit('loginFailure');
          return Promise.reject(response);

        }
      });
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    register({ commit }, data) {
      return AuthService.register(data).then(response => {

        if(response.data.status == "success") {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        } else {
          commit('registerFailure');
          return Promise.reject(response.data);
        }
      });
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    }
  }
};