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
    },
    {
      path: '/user',
      name: 'User',
      component: () => import('../views/UserView.vue'),
      children: [
        {
          path: 'newtask',
          name: 'UserNewTask', // Unique name for the route
          component: () => import('../views/NewTask.vue')
        },
        {
          path: 'tasks',
          name: 'UserTasks',  // Unique name for the route
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
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/DashBoard.vue'),
          alias: 'dashboard', // Cung cấp alias cho route này
        },
        {
          path: 'task/all',
          name: 'AdminTasks',  // Unique name for the route
          component: () => import('../views/Tasks.vue')
        },
        {
          path: 'task/detail/:taskId',
          name: 'TaskDetail',
          component: () => import('../views/TaskDetail.vue')
        },
        {
          path: 'task/edit/:id',
          name: 'EditTask',
          component: () => import('../views/EditTask.vue')
        },
        {
          path: 'newtask',
          name: 'SetNewTask',
          component: () => import('../views/SetNewTask.vue')
        },
        {
          path: 'management/user',
          name: 'ManagementUser',
          component: () => import('../views/ManagementUser.vue')
        },
        {
          path: 'management/user/:userId',
          name: 'UserProfile',
          component: () => import('../views/UserProfile.vue')
        }
      ]
    }
  ]
})

export default router
