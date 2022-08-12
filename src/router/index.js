import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Subreddit from '../views/Subreddit.vue'
import User from '../views/User.vue'
import Submit from '../views/Submit.vue'
import CreateProfile from '../views/CreateProfile.vue'
import Post from '../views/Post.vue'
import Loading from '../views/Loading.vue'
import SetupNotifications from '../views/SetupNotifications'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/loading',
    name: 'loading',
    component: Loading
  },
  {
    path: '/r/:subname',
    name: 'subreddit',
    component: Subreddit
  },
  {
    path: '/r/:subname/:postid',
    name: 'post',
    component: Post
  },
  {
    path: '/u/:username',
    name: 'user',
    component: User
  },
  {
    path: '/submit/:subname',
    name: 'submit',
    component: Submit
  },
  {
    path: '/createprofile',
    name: 'create-profile',
    component: CreateProfile
  },
  {
    path: '/notifications',
    name: 'setup-notifications',
    component: SetupNotifications
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
