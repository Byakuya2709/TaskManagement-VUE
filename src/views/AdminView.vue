<template>
    <div id="admin" class="d-flex">
      <div id="logo-sidebar" class=" bg-white border-end border-secondary bg-light">
        <div class="h-100 px-3 pt-4 pb-2 overflow-auto">
          <ul class="nav flex-column">
            <li class="nav-item mb-2">
              <router-link
                to="/admin/profile"
                class="d-flex align-items-center p-2 text-dark rounded nav-link bg-light hover-bg-primary"
              >
                <svg
                  class="bi bi-clock text-secondary"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                >
                  <path d="M8 3.5a.5.5 0 0 1 .5.5v4h3.5a.5.5 0 0 1 0 1H8a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z" />
                  <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zM1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8z" />
                </svg>
                <span class="ms-2">Trang Cá Nhân</span>
              </router-link>
            </li>
            <li class="nav-item mb-2">
              <router-link
                to="/admin/task/all"
                class="d-flex align-items-center p-2 text-dark rounded nav-link bg-light hover-bg-primary"
              >
                <svg
                  class="bi bi-clipboard text-secondary"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                >
                  <path d="M2 3.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1.5h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h1zm11-1V2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v.5H2v10h12v-10h-1z" />
                  <path d="M9 8H7v4h2V8zm1-3H6v2h4V5z" />
                </svg>
                <span class="ms-2">Quản Lý Công Việc</span>
              </router-link>
            </li>
            <li class="nav-item mb-2">
              <router-link
                to="/admin/newtask"
                class="d-flex align-items-center p-2 text-dark rounded nav-link bg-light hover-bg-primary"
              >
                <svg
                  class="bi bi-plus-circle text-secondary"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 .5-.5z" />
                  <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zM1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8z" />
                </svg>
                <span class="ms-2">Tạo Task</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
  
      <div class="container col-10 my-4">
        <RouterView />
      </div>
    </div>
  </template>
  
  
  <script>
  import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../stores/pina";
 import { useRouter } from 'vue-router';
 import { computed } from 'vue';
 
  export default {
    name: "Admin",
    setup() {
     const authStore = useAuthStore();
     const router = useRouter();
 
     const isAuthenticated = computed(() => authStore.isAuthenticated);
     const isAdmin = computed(() => authStore.isAdmin);
 
     const logout = async () => {
       try {
         await authStore.logout();
         router.push('/login').then(() => {
          window.location.reload(); // Reload sau khi chuyển đến trang login
        });
       } catch (error) {
         console.error('Logout failed:', error);
       }
     };
 
     return {
       isAuthenticated,
       isAdmin,
       logout,
     };
   },
    data(){
     return{
        adminId:""
     }
    },
    created() {
      this.getadminId();
    },
    methods:{
     getadminId() {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          this.adminId = decodedToken.sub;
         
        }
      }
     
    }
  };
  </script>
  <style scoped>
   #logo-sidebar{
  
   }
  </style>
  