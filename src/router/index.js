import Vue from 'vue'
import Router from 'vue-router'
import flowMain from '@/components/flow/flowMain.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'flowMain',
      component: flowMain
    }
  ]
})
