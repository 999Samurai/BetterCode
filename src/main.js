import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import AOS from 'aos'
import VueRouter from 'vue-router'

import App from './App.vue'
import mainpage from './components/mainpage.vue'
import register from './components/register.vue'
import login from './components/login.vue'

import 'aos/dist/aos.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
AOS.init()

const routes = [
  { path: "/", component: mainpage},
  { path: "/register", component: register},
  { path: "/login", component: login}
]

const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')