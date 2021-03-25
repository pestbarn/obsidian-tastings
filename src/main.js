import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Helpers from './helpers.js'

Vue.use(VueRouter)
Vue.use(Helpers)

import Home from './components/Home.vue'
import './main.scss'

const routes = [
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/',
        component: Home
    }
    /* ,
    {
        path: '/beer/:slug',
        name: 'beer',
        component: Beer
    } */
]

const router = new VueRouter({
    mode: 'history',
    routes
})

new Vue({
    el: '#app',
    components: {
        App
    },
    template: '<App/>',
    router
})
