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
import VueCodemirror from 'vue-codemirror'
import VueHtml2Canvas from 'vue-html2canvas';
import VueInitialsImg from 'vue-initials-img';
import SkeletonCards from 'vue-ultimate-skeleton-cards'

import App from './App.vue'

import { router } from './router';
import store from './store';

import 'aos/dist/aos.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'codemirror/lib/codemirror.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VeeValidate);
Vue.use(VueHtml2Canvas);
Vue.use(VueCodemirror);
Vue.use(SkeletonCards)
Vue.use(VueInitialsImg);
Vue.component('font-awesome-icon', FontAwesomeIcon);
AOS.init()

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');