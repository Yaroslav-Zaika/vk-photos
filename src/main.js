import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import VK from '../lib/openapi.js'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: require('./component/Main.vue'),
      children: [
        {
          name: 'photo',
          path: 'photo/:owner_id/:photo_id',
          component: require('./component/Modal.vue')
        }
      ]
    },
    {
      name: 'album',
      path: '/album/:album_id/user/:owner_id',
      component: require('./component/Album.vue'),
      children: [
        {
          name: 'albumPhoto',
          path: 'photo/:photo_id',
          component: require('./component/Modal.vue')
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
 ]
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})