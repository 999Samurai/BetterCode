import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import AOS from 'aos'
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

import App from './App.vue'

import { router } from './router';
import store from './store';

import 'aos/dist/aos.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);
AOS.init()

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');