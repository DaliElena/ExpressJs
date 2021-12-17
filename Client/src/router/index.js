import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/authorization',
        name: 'Authorization',
        component: () => import('../views/Authorization.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.path !== '/authorization' && !localStorage.getItem('token')) {
        next('/authorization');
    } else {
        next();
    }
});

export default router;
