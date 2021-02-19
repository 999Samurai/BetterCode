import Vue from 'vue'
import Router from 'vue-router'
import index from './components/index.vue'
import register from './components/register.vue'
import logout from './components/logout.vue'
import login from './components/login.vue'
import pen from './components/pen.vue'
import discover from './components/discover.vue'
import dashboard from './components/dashboard.vue'
import user_profile from './components/user-profile.vue'
import settings from './components/settings.vue'
import plans from './components/plans.vue'
import github from './components/github.vue'
import recovery from './components/recovery.vue'


Vue.use(Router);

export const router = new Router({
    mode: 'history',
    routes: [
    {
        path: '/',
        component: index
    },
    {
        path: '/login',
        component: login
    },
    {
        path: '/register',
        component: register
    },
    {
        path: '/logout',
        component: logout
    },
    {
        path: '/dashboard',
        component: dashboard
    },
    {
        path: '/pen/:id',
        component: pen
    },
    {
        path: '/discover',
        component: discover
    },
    {
        path: '/user-:id',
        component: user_profile
    },
    {
        path: '/settings',
        component: settings
    },
    {
        path: '/plans',
        component: plans
    },
    {
        path: '/github',
        component: github
    },
    {
        path: '/recovery/:uuid',
        component: recovery
    }
]
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register', '/', '/discover', '/github'];
    const authRequired = !publicPages.includes(to.path);
    const userPage = !to.path.includes("user-");
    const recoveryPage = !to.path.includes("recovery"); 
    const penPage = !to.path.includes("pen");
    const loggedIn = localStorage.getItem('user');
  
    if (userPage && penPage && authRequired && recoveryPage && !loggedIn) {
      next('/');
    } else {
      next();
    }
});