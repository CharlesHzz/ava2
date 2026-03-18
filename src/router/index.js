import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('../views/LoginView.vue') },
    { path: '/cadastro', component: () => import('../views/CadastroView.vue') },
    { path: '/admin', component: () => import('../views/AdminView.vue') },
    { 
      path: '/', 
      component: () => import('../views/HomeView.vue'),
      // Proteção básica: se não tiver token, volta pro login
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('token')) next('/login')
        else next()
      }
    }
  ]
})

export default router