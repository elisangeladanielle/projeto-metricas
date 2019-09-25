import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        icon: 'home', title: 'Home'
      },
      component: () => import(/* webpackChunkName: "home" */ './pages/home/Home')
    },
    {
      path: '/lista-atividades',
      name: 'lista-atividades',
      meta: {
        icon: 'list-ul', title: 'Lista de Atividades'
      },
      component: () => import(/* webpackChunkName: "home" */ './pages/lista-atividades/ListaAtividades')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: {
        icon: 'chart-line', title: 'Dashboard'
      },
      component: () => import(/* webpackChunkName: "home" */ './components/layout/LayoutDashboard')
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: 'Login' },
      // route level code-splitting
      // this generates a separate chunk (login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ './pages/login/Login')
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Métricas`

  if (!window.uid && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
