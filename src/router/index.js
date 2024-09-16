import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },

    {
      path: '/product/new',
      name: 'productForm',
      component: () => import('../views/ProductAddForm.vue')
    },
    {
      path: '/signup',
      name: 'Register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    }
    , {
      path: '/user',
      name: 'User',
      component: () => import('../views/UserView.vue'),
      children: [
        {
          path: 'newtask',
          name: 'NewTask',
          component: () => import('../views/NewTask.vue')
        },
        {
          path: 'tasks',
          name: 'Tasks',
          component: () => import('../views/Tasks.vue')
        }


      ]
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/AdminView.vue'),
      children: [

        {
          path: 'task/all',
          name: 'Tasks',
          component: () => import('../views/Tasks.vue')
        },
        {
          path: 'task/detail/:taskId',
          name: 'TaskDetail',
          component: () => import('../views/TaskDetail.vue')
        },
        {
          path: 'task/edit/:id',
          name: 'EditTask', // Changed the name here
          component: () => import('../views/EditTask.vue')
        }

      ]
    }


  ]
})

export default router
