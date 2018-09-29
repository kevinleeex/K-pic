import Vue from 'vue'
import Router from 'vue-router'

import SettingPage from '../components/SettingPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'drag-page',
      component: require('@/components/DragPage').default
    },
    {
      path: '/setting',
      name: 'setting-page',
      component: SettingPage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
