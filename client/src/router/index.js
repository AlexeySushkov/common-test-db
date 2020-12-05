import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/commonLogin.vue'
import GoogleLogin from '../components/commonGoogleLogin.vue'
import Data from '../components/Data.vue'
import NewData from '../components/DataNew.vue'
import Logout from '../components/commonLogout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'commonLogin',
    component: Login
  },
  {
    path: '/googleLogin',
    name: 'commonGoogleLogin',
    component: GoogleLogin
  },
  {
    path: '/data',
    name: 'Data',
    component: Data
  },
  {
    path: '/newData',
    name: 'DataNew',
    component: NewData
  },
  {
    path: '/logout',
    name: 'commonLogout',
    component: Logout
  }  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
