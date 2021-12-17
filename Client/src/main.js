import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import {checkToken} from '@/core/helpers/checkToken';

Vue.config.productionTip = false;

const startApp = () => {
    new Vue({
        router,
        store,
        render: h => h(App),
    }).$mount('#app');
};


if (localStorage.getItem('token')) {
    checkToken().then(() => {
        startApp();
    });
} else {
    startApp();
}
