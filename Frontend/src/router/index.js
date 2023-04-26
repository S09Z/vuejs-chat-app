import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import ChatWindow from '../views/ChatWindow.vue';
import GroupChat from '../components/GroupChat.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/chat/:id',
    name: 'ChatWindow',
    component: ChatWindow,
  },
  {
    path: '/group-chat',
    name: 'GroupChat',
    component: GroupChat,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
