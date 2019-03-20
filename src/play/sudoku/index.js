import Vue from 'vue';
import App from './App';
import Router from '../../vue/router';
const Foo = { template: '<div>foo</div>' }
const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/test',
            component: Foo
        }
    ]
})
Vue.use(Router);
new Vue({
    el: '#app',
    router,
    template: '<App />',
    components: {
        App
    }
})